import { TodoList } from './components/TodoList'
import React, { createApplication, ReactivNode, useState } from './react'
import { createContext } from './react/context/createContext'

const Test = (props: { children: ReactivNode }) => {
  return <>{props.children}</>
}

export const { Provider } = createContext(1)
const App = () => {
  const [state, setState] = useState(0)
  const obj = { test: { a: 'testing' } }
  return (
    <div>
      <button onClick={() => setState(() => Math.random())}></button>
      <Provider value={2}>
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
