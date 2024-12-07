import { globalKey, nodePointers } from '../globalState'
import { ReactivComponentNode, ReactivElementNode, ReactivNode } from '../types'
import { startReconcile } from './reconcile'

function blankNode(partial?: Partial<ReactivElementNode>): ReactivNode {
  return {
    tag: 'div',
    dirty: false,
    props: {},
    isComponent: false,
    child: null,
    sibling: null,
    ref: null,
    return: expect.any(Function),
    prev: expect.any(Function),
    ...partial,
  }
}

function blankComponentNode(
  partial?: Partial<ReactivComponentNode>
): ReactivComponentNode {
  return {
    ...blankNode(),
    tag: 'MyComponent',
    isComponent: true,
    key: 'some-key',
    fn: () => null,
    hooks: [],
    ...partial,
  } as ReactivComponentNode
}

describe('reconcile', () => {
  beforeEach(() => {
    nodePointers.clear()
  })

  it('should flag an element with changed props for rerender', () => {
    const before: ReactivNode = blankNode({
      props: { value: 1 },
    })

    const after: ReactivNode = blankNode({
      props: { value: 10 },
    })

    startReconcile(before, after)
    expect(before).toStrictEqual(
      blankNode({
        dirty: true,
        props: { value: 10 },
      })
    )
  })

  it('should replace a node if the tags are different', () => {
    const before: ReactivNode = blankNode({
      tag: 'p',
      props: { value: 1 },
    })

    const after: ReactivNode = blankNode({
      tag: 'a',
      props: { value: 10 },
    })

    startReconcile(before, after)
    expect(before).toStrictEqual(
      blankNode({
        tag: 'a',
        dirty: true,
        props: { value: 10 },
      })
    )
  })

  describe('child', () => {
    it('should add new child if before is null', () => {
      const before = blankNode()
      const after: ReactivNode = blankNode({
        child: blankNode({
          tag: 'div',
          dirty: false,
          props: { value: 10 },
          isComponent: false,
          child: null,
          sibling: null,
          ref: null,
        }),
      })

      startReconcile(before, after)
      expect(before).toStrictEqual({
        ...after,
        child: { ...after.child, dirty: true },
      })
    })

    it('should remove a child if after is null', () => {
      const before: ReactivNode = blankNode({
        child: blankNode({
          props: { value: 10 },
        }),
      })

      const after = blankNode()

      startReconcile(before, after)
      expect(before).toStrictEqual(
        blankNode({
          child: null,
        })
      )
    })

    it('should flag a child element with changed props for rerender but not the parent', () => {
      const before: ReactivNode = blankNode()
      before.child = blankNode({
        props: { value: 1 },
      })

      const after: ReactivNode = blankNode()
      after.child = blankNode({
        props: { value: 10 },
      })

      startReconcile(before, after)
      expect(before).toStrictEqual(
        blankNode({
          child: blankNode({
            dirty: true,
            props: { value: 10 },
          }),
        })
      )
    })
  })

  describe('sibling', () => {
    it('should add new sibling if before is null', () => {
      const before = blankNode({
        child: blankNode({ sibling: null }),
      })

      const after: ReactivNode = blankNode({
        child: blankNode({
          sibling: blankNode({
            tag: 'div',
            dirty: false,
            props: { value: 10 },
            isComponent: false,
            child: null,
            sibling: null,
            ref: null,
          }),
        }),
      })

      startReconcile(before, after)
      expect(before).toStrictEqual(
        blankNode({
          child: blankNode({
            sibling: blankNode({
              tag: 'div',
              props: { value: 10 },
              dirty: true,
            }),
          }),
        })
      )
    })
    it('should remove all siblings if after is null', () => {
      const after = blankNode({
        child: blankNode({ sibling: null }),
      })

      const before: ReactivNode = blankNode({
        child: blankNode({
          sibling: blankNode({
            props: { value: 10 },
            sibling: blankNode({
              tag: 'p',
              props: { value: 10 },
            }),
          }),
        }),
      })

      startReconcile(before, after)
      expect(before).toStrictEqual(
        blankNode({
          child: blankNode({
            sibling: null,
          }),
        })
      )
    })
    it('should change and add a child', () => {
      const before = blankNode({
        tag: 'p',
        child: blankNode({
          tag: 'TEXT',
          props: { value: 1 },
          sibling: blankNode({
            tag: 'p',
            child: blankNode({
              tag: 'TEXT',
              props: { value: 7 },
            }),
          }),
        }),
      })

      const after = blankNode({
        tag: 'p',
        child: blankNode({
          tag: 'TEXT',
          props: { value: 1 },
          sibling: blankNode({
            tag: 'p',
            child: blankNode({
              tag: 'TEXT',
              props: { value: 4 },
              sibling: blankNode({
                tag: 'p',
                child: blankNode({
                  tag: 'TEXT',
                  props: { value: 7 },
                }),
              }),
            }),
          }),
        }),
      })
      startReconcile(before, after)
      expect(before).toStrictEqual(
        blankNode({
          tag: 'p',
          child: blankNode({
            tag: 'TEXT',
            props: { value: 1 },
            sibling: blankNode({
              tag: 'p',
              child: blankNode({
                tag: 'TEXT',
                props: { value: 4 },
                dirty: true,
                sibling: blankNode({
                  tag: 'p',
                  dirty: true,
                  child: blankNode({
                    tag: 'TEXT',
                    props: { value: 7 },
                    dirty: true,
                  }),
                }),
              }),
            }),
          }),
        })
      )
    })
  })
  describe('component node', () => {
    it('should call the after function with the new props', () => {
      const before: ReactivNode = blankComponentNode({
        tag: 'MyComponent',
        props: { value: 1 },
        key: 'some-key',
        child: blankNode({
          tag: 'p',
          child: blankNode({ tag: 'TEXT', props: { value: 1 } }),
        }),
      })

      const after: ReactivNode = blankComponentNode({
        tag: 'MyComponent',
        fn: (props: any) =>
          blankNode({
            tag: 'p',
            child: blankNode({ tag: 'TEXT', props: { value: props.value } }),
          }),
        props: { value: 10 },
      })

      startReconcile(before, after)
      expect(before).toStrictEqual(
        blankComponentNode({
          tag: 'MyComponent',
          props: { value: 10 },
          fn: expect.any(Function),
          dirty: true,
          child: blankNode({
            tag: 'p',
            child: blankNode({
              tag: 'TEXT',
              dirty: true,
              props: { value: 10 },
            }),
            dirty: true,
          }),
        })
      )
    })
    it('should set the globalKey to the before key', () => {
      const before: ReactivNode = blankComponentNode({
        tag: 'MyComponent',
        props: { value: 1 },
        child: blankNode({
          tag: 'p',
          props: { value: 1 },
        }),
      })

      const after: ReactivNode = blankNode({
        tag: 'MyComponent',
        key: 'some-key',
      })

      startReconcile(before, after)
      expect(globalKey.value).toBe(before.key)
    })
    it('should add an entry to nodePointers when a component child is added', () => {
      const key = 'test-key'
      const before = blankNode()
      const afterReturn = blankNode({ tag: 'p' })
      const after = blankNode({
        child: blankComponentNode({
          fn: () => afterReturn,
          key,
        }),
      })
      startReconcile(before, after)
      expect(nodePointers.get(key)).toBe(before.child)
      before.child!.props.test = 10
      expect(nodePointers.get(key)!.props.test).toStrictEqual(10)
    })
    it('should add an entry to nodePointers when a component sibling is added', () => {
      const key = 'test-key'
      const before = blankNode()
      const afterReturn = blankNode({ tag: 'p' })
      const after = blankNode({
        sibling: blankComponentNode({
          fn: () => afterReturn,
          key,
        }),
      })
      startReconcile(before, after)
      expect(nodePointers.get(key)).toBe(before.sibling)
      before.sibling!.props.test = 10
      expect(nodePointers.get(key)!.props.test).toStrictEqual(10)
    })
    describe.only('Arrays', () => {
      const secondChildRef = document.createElement('div')

      const before = blankNode({
        tag: 'FRAGMENT',
        child: blankNode({
          props: { value: 1, key: 'item-1' },
          return: () => before,
          sibling: blankNode({
            props: { value: 4, key: 'item-2' },
            ref: secondChildRef,
            return: () => before,
          }),
        }),
      })

      const after = blankNode({
        tag: 'FRAGMENT',
        child: blankNode({
          props: {
            value: 1,
            key: 'item-1',
          },
          return: () => after,
          sibling: blankNode({
            props: {
              value: 2,
              key: 'item-3',
            },
            return: () => after,
            sibling: blankNode({
              props: { value: 4, key: 'item-2' },
              return: () => after,
              ref: null,
            }),
          }),
        }),
      })
      const expected = blankNode({
        tag: 'FRAGMENT',
        dirty: false,
        child: blankNode({
          props: { value: 1, key: 'item-1' },
          dirty: false,
          return: expect.any(Function),
          sibling: blankNode({
            return: expect.any(Function),
            props: { value: 2, key: 'item-3' },
            dirty: true,
            sibling: blankNode({
              props: { value: 4, key: 'item-2' },
              dirty: true,
              return: expect.any(Function),
              ref: secondChildRef,
            }),
          }),
        }),
      })
      startReconcile(before, after)
      expect(before).toStrictEqual(expected)
    })
    it('should not flag the component as dirty if a child changes', () => {
      const before = blankComponentNode({
        fn: () =>
          blankNode({
            tag: 'p',
            child: blankNode({
              tag: 'TEXT',
              props: { value: 'start' },
            }),
          }),
        child: blankNode({
          tag: 'p',
          child: blankNode({
            tag: 'TEXT',
            props: { value: 'start' },
          }),
        }),
      })
      const after = blankComponentNode({
        fn: () =>
          blankNode({
            tag: 'p',
            child: blankNode({
              tag: 'TEXT',
              props: { value: 'end' },
            }),
          }),
      })

      startReconcile(before, after)
      expect(before).toStrictEqual(
        blankComponentNode({
          fn: expect.any(Function),
          child: blankNode({
            tag: 'p',
            child: blankNode({
              tag: 'TEXT',
              props: { value: 'end' },
              dirty: true,
            }),
          }),
        })
      )
    })
    it('should not remove a components sibling if the component is the initialiser', () => {
      const before = blankComponentNode({
        tag: 'MyComponent',
        child: blankNode({ tag: 'testing' }),
        sibling: blankComponentNode({ tag: 'MyComponent' }),
      })
      const after = blankComponentNode({
        tag: 'MyComponent',
        fn: () => blankNode({ tag: 'testing' }),
      })

      const expected = blankComponentNode({
        tag: 'MyComponent',
        child: blankNode({ tag: 'testing' }),
        fn: expect.any(Function),
        sibling: blankComponentNode({
          tag: 'MyComponent',
          fn: expect.any(Function),
        }),
      })

      startReconcile(before, after)
      expect(before).toStrictEqual(expected)
    })
    it('should remove a components sibling if the component is not the initialiser', () => {
      const before = blankComponentNode({
        tag: 'MyComponent',
        child: blankNode({
          tag: 'testing',
          sibling: blankComponentNode({ tag: 'MyComponent' }),
        }),
        sibling: blankComponentNode({ tag: 'MyComponent' }),
      })
      const after = blankComponentNode({
        tag: 'MyComponent',
        fn: () =>
          blankNode({
            tag: 'testing',
          }),
        sibling: blankComponentNode({ tag: 'MyComponent' }),
      })

      const expected = blankComponentNode({
        tag: 'MyComponent',
        fn: expect.any(Function),
        child: blankNode({ tag: 'testing' }),
        sibling: blankComponentNode({
          tag: 'MyComponent',
          fn: expect.any(Function),
        }),
      })

      startReconcile(before, after)
      expect(before).toStrictEqual(expected)
    })
    it('should allow deletion in the middle of a list of keyed items', () => {
      const ref1 = document.createElement('div')
      const ref2 = document.createElement('div')
      const before = blankNode({
        child: blankNode({
          props: { key: 'item-1' },
          ref: ref1,
          sibling: blankNode({
            props: { key: 'item-2' },
            sibling: blankNode({ props: { key: 'item-3' }, ref: ref2 }),
          }),
        }),
      })
      const after = blankNode({
        child: blankNode({
          props: { key: 'item-1' },
          sibling: blankNode({ props: { key: 'item-3' } }),
        }),
      })
      const expected = blankNode({
        child: blankNode({
          ref: ref1,
          props: { key: 'item-1' },
          sibling: blankNode({
            props: { key: 'item-3' },
            dirty: true,
            ref: ref2,
          }),
        }),
      })
      startReconcile(before, after)
      expect(before).toStrictEqual(expected)
    })
    it.only('should allow deletion in the middle of a list of keyed items', () => {
      const ref1 = document.createElement('div')
      const ref2 = document.createElement('div')
      const before = blankNode({
        child: blankComponentNode({
          props: { key: 'item-1' },
          ref: ref1,
          child: blankNode(),
          sibling: blankComponentNode({
            props: { key: 'item-2' },
            child: blankNode(),
            sibling: blankComponentNode({
              tag: 'MyComponent2',
              props: { key: 'item-3' },
              child: blankNode(),
              ref: ref2,
            }),
          }),
        }),
      })
      const after = blankNode({
        child: blankComponentNode({
          props: { key: 'item-1' },
          fn: () => blankNode(),
          sibling: blankComponentNode({
            tag: 'MyComponent2',
            props: { key: 'item-3' },
            fn: () => blankNode(),
          }),
        }),
      })
      const expected = blankNode({
        child: blankComponentNode({
          ref: ref1,
          props: { key: 'item-1' },
          child: blankNode(),
          sibling: blankComponentNode({
            tag: 'MyComponent2',
            props: { key: 'item-3' },
            dirty: true,
            ref: ref2,
            child: blankNode(),
          }),
        }),
      })
      startReconcile(before, after)
      expect(before).toStrictEqual(expected)
    })
  })
})
