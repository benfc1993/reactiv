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
const App = () => {
  const [state, setState] = useState(1)
  const obj = { test: { a: 'testing' } }
  return (
    <div className='app'>
      {Array.from({ length: state }).map((_, idx) => (
        <p key={`some-${idx}`}>testing{idx}</p>
      ))}
      {/* {state < 2 ? null : <p>testing</p>} */}
      <button onClick={() => setState((current) => current + 1)}>
        increment context
      </button>
      {state < 2 ? null : (
        <MyContext.Provider value={2}>
          <TodoList />
        </MyContext.Provider>
      )}
      <MyContext.Provider value={state}>
        <TodoList />
      </MyContext.Provider>
    </div>
  )
}

createApplication(document.getElementById('root')!, App)
