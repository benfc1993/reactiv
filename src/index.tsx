import { TodoList } from './components/TodoList'
import React, { createApplication, ReactivNode, useState } from './react'
import { createContext } from './react/context/createContext'

const Test = (props: { children: ReactivNode }) => {
  return <>{props.children}</>
}

export const MyContext = createContext<number | null>(null)
const App = () => {
  const [state, setState] = useState(0)
  const obj = { test: { a: 'testing' } }
  return (
    <div>
      <button onClick={() => setState(() => Math.random())}></button>
      <MyContext.Provider value={2}>
        <MyContext.Provider value={state}>
          <TodoList />
        </MyContext.Provider>
      </MyContext.Provider>
    </div>
  )
}

createApplication(document.getElementById('root')!, App)
