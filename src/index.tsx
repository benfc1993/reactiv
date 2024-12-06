import { TodoList } from './components/TodoList'
import React, { createApplication, ReactivNode, useState } from './react'
import { createContext } from './react/context/createContext'

export const MyContext = createContext<number | null>(1)
function FragmentComponent() {
  return (
    <>
      <div>
        <p>This is inside of a fragment</p>
      </div>
    </>
  )
}

function Count() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <button onClick={() => setCount((current) => current + 1)}>
        increment
      </button>
      <p>{count}</p>
      {/* {count > 5 && <Count />} */}
      {Array.from({ length: count }).map((_, idx) => (
        <p>item {idx}</p>
      ))}
    </div>
  )
}
function Test() {
  const [data, setData] = useState([
    { id: 'ab2', value: 1 },
    { id: 'xy7', value: 7 },
  ])
  return (
    <div>
      <button
        onClick={() =>
          setData((current) => [
            ...current,
            { id: 'rs4', value: Math.round(Math.random() * 100) },
          ])
        }
      >
        add
      </button>
      <p>before</p>
      {data
        .sort((a, b) => a.value - b.value)
        .map((d) => (
          <p>{d.value}</p>
        ))}
      <p>after</p>
    </div>
  )
}

function Wrapper() {
  const [value, setValue] = useState(1)

  return (
    <>
      <button onClick={() => setValue((current) => current + 1)}>
        increment
      </button>
      <Test />
      <Count />
      <MyContext.Provider value={value}>
        <TodoList />
      </MyContext.Provider>
    </>
  )
}

export const App = () => {
  return (
    <div draggable>
      <Wrapper />
    </div>
  )
}

createApplication(document.getElementById('root')!, App)
