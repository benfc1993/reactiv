import { TodoList } from './components/TodoList'
import React, { createApplication } from './react'

const App = () => {
  const obj = { test: { a: 'testing' } }
  return (
    <div>
      <TodoList />
    </div>
  )
}

createApplication(document.getElementById('root')!, App)
