import { TodoList } from './components/TodoList'
import React, { createApplication, ReactivNode, useState } from './react'
import { createContext } from './react/context/createContext'

const Test = (props: { children: ReactivNode }) => {
  return <>{props.children}</>
}

export const { Provider } = createContext<{ a: number; b: string } | null>(null)
const App = () => {
  const [state, setState] = useState(0)
  const obj = { test: { a: 'testing' } }
  return (
    <div>
      <button onClick={() => setState(() => Math.random())}></button>
      <Provider value={{ a: 2, b: 'test' }}>
        <Test>
          <p>testing</p>
        </Test>
        <Provider value={state}>
          <TodoList />
        </Provider>
      </Provider>
    </div>
  )
}

createApplication(document.getElementById('root')!, App)
