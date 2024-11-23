import { TodoList } from './components/TodoList'
import React, { createApplication, ReactivNode, useState } from './react'
import { createContext } from './react/context/createContext'

export const MyContext = createContext<number | null>(null)
const App = () => {
  const [state, setState] = useState(0)
  const obj = { test: { a: 'testing' } }
  return (
    <div>
      {state < 2 ? null : <p>testing</p>}
      <button onClick={() => setState((current) => current + 1)}></button>
      <MyContext.Provider value={2}>
        <MyContext.Provider value={state}>
          <TodoList />
        </MyContext.Provider>
      </MyContext.Provider>
    </div>
  )
}

createApplication(document.getElementById('root')!, App)
