import { UI } from './ui'
import { ReactivComponentNode } from '../react'

export enum Action {
  ADDED_COMPONENT = 'ADDED',
  STATE_CHANGE = 'STATE_CHANGE',
  REF_CHANGED = 'REF_CHANGE',
  DEPENDENCY_CHANGE = 'DEPENDENCY_CHANGE',
  RE_RENDER = 'RE_RENDER',
  REMOVED_COMPONENT = 'REMOVED',
  NONE = 'NONE',
}

export type QueuedAction = {
  cache: ReactivComponentNode
  actionType: Action
  message: string
  promise: Promise<void>
  resolve: () => void
}

export const pause: {
  isEnabled: boolean
  setIsEnabled: (value: boolean) => void
  actions: (() => Promise<void>)[]
  showAll: boolean
  toClear: HTMLElement | null | undefined
} = {
  isEnabled: false,
  setIsEnabled(value: boolean) {
    this.isEnabled = value
  },
  actions: [],
  showAll: false,
  toClear: null,
}

export async function addAction(
  cache: ReactivComponentNode,
  actionType: Action,
  message: string,
  show: boolean = false
) {
  if (!pause.isEnabled) return
  let resolve: () => void
  const promise = new Promise<void>((res) => {
    resolve = res
  })

  pause.actions.push(async () => {
    const action = { cache, actionType, message, promise, resolve }
    showMessage(action)
    await action.promise
    pause.actions.shift()
    if (pause.showAll && pause.actions.length >= 1) {
      if (pause.actions.length) {
        pause.actions[0]()
      } else {
        pause.showAll = false
      }
    }
  })

  if (show && pause.actions.length === 1) {
    pause.actions[0]()
  }
  return promise
}

function showMessage(action: QueuedAction) {
  if (!pause.isEnabled || pause.actions.length === 0) {
    pause.showAll = false
    return
  }
  const { message, actionType, resolve, cache } = action
  const actionIndex = Object.values(Action).indexOf(actionType)

  UI.notification.innerText = message
  UI.notification.classList.add(
    'update-message',
    `update-message-${actionIndex}`
  )

  if (!(cache.ref instanceof Text)) {
    pause.toClear = cache.ref

    cache.ref?.classList.add(`update`, `update-${actionIndex}`)
  }
  waitForNext(resolve)
}

export function showAllMessages() {
  if (pause.showAll) return
  pause.showAll = !!pause.actions.length

  if (pause.actions.length) {
    pause.actions[0]()
  }
}

async function waitForNext(resolve: () => void) {
  function listener() {
    UI.notification.innerText = ''
    UI.notification.setAttribute('class', '')
    if (pause.toClear)
      pause.toClear.classList.remove(
        ...Array.from({ length: Object.keys(Action).length }).map(
          (_, i) => `update-${i}`
        )
      )
    const oldNode = UI.stepButton
    const newButton = UI.stepButton.cloneNode(true) as HTMLButtonElement
    UI.stepButton.parentNode?.replaceChild(newButton, oldNode)
    UI.stepButton = newButton
    resolve()
  }
  UI.stepButton.addEventListener('click', listener)
}
