import { TodoList } from './components/TodoList'
import React, { createApplication, ReactivNode, useState } from './react'
import { createContext } from './react/context/createContext'

export const MyContext = createContext<number | null>(1)
const App = () => {
  const [state, setState] = useState(1)
  const obj = { test: { a: 'testing' } }
  return (
    <div className='app'>
      {Array.from({ length: state }).map((_, idx) => (
        <p>testing{idx}</p>
      ))}
      {/* {state < 2 ? null : <p>testing</p>} */}
      <button onClick={() => setState((current) => current + 1)}>
        increment context
      </button>
      {/* <MyContext.Provider value={2}> */}
      <MyContext.Provider value={state}>
        <TodoList />
      </MyContext.Provider>
      {/* </MyContext.Provider> */}
    </div>
  )
}

createApplication(document.getElementById('root')!, App)
