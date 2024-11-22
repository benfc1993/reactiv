import { TodoList } from './components/TodoList'
import React, { createApplication, ReactivNode } from './react'

const Test = (props: { children: ReactivNode }) => {
  return <>{props.children}</>
}
const App = () => {
  const obj = { test: { a: 'testing' } }
  return (
    <div>
      <Test>
        <p>testing</p>
      </Test>
      <TodoList />
    </div>
  )
}

createApplication(document.getElementById('root')!, App)
