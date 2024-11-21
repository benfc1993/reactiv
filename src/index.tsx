import React, {
  useState,
  useRef,
  useEffect,
  createApplication,
  useMemo,
} from './react'

const Testing = (props: { count?: number; key?: string }) => {
  const [state, setState] = useState(0)
  const [count, setCount] = useState(props?.count ?? 1)
  const testing = useMemo(() => count * 10, [state])

  useEffect(() => {
    setState(count * 10)
  }, [count])

  return (
    <main>
      <p>{testing}</p>
      <p
        className={`update-message-${state}`}
        onClick={() => {
          setState((current) => current + 1)
        }}
      >
        testing {props.key} - {state}
      </p>
      <p onClick={() => setCount((current) => current * 2)}>count - {count}</p>
      <div>{count > 2 && count < 10 ? <Input /> : <p>other</p>}</div>
    </main>
  )
}

const TextSplit = (props: { text: string; key?: string }) => {
  const { text } = props
  return (
    <div>
      {text.split('').map((char) => (
        <p key={`text-split-${char}`}>{char}</p>
      ))}
    </div>
  )
}

const Input = () => {
  const [value, setValue] = useState('test')
  const ref = useRef<number | null>(1)

  useEffect(() => {}, [ref.current])

  return (
    <div>
      <div
        onClick={() => {
          if (ref.current) ref.current += 1
        }}
      >
        change ref
      </div>
      )<div onClick={() => console.log(ref.current)}>log ref</div>
      <input
        type='text'
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
        }}
      />
      <TextSplit text={value} />
      {ref.current && ref.current > 1 && <p>test</p>}
    </div>
  )
}

const ListItem = () => {
  const [count, setCount] = useState(0)
  return (
    <>
      <button onClick={() => setCount((current) => current + 1)}>button</button>
      <>
        <p>ListItem-{count}</p>
      </>
      <p>{count < 10 ? 'test' : null}</p>
    </>
  )
}
const ParentToPassDown = () => {
  const [count, setCount] = useState(1)
  return (
    <div style={{ width: 100, fontSize: 20 }}>
      <button onClick={() => setCount((current) => current + 1)}>
        add item
      </button>
      {Array.from({ length: count }).map((_, i) => (
        <ListItem key={`ListItem-${i}`} />
      ))}
    </div>
  )
}

const App = () => (
  <div draggable>
    {/* <TextSplit text="asd" /> */}
    <ParentToPassDown />
    <Testing key='i-made-this' />
    {/* <h2>Hello React!</h2> */}
    {/* <Testing key="another" /> */}
    {/* <p>I am a pargraph</p> */}
    {/* <input type="text" /> */}
    <Input />
    {/* {1 === 2 && <p>test</p>} */}
  </div>
)

createApplication(document.getElementById('root')!, App)
