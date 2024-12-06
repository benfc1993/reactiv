import React, { useEffect, useState } from '../react'
import { Todo } from './TodoList'

type TodoItemProps = {
  task: Todo
  deleteTask: (id: number) => void
  toggleCompleted: (id: number) => void
}
export function TodoItem(props: TodoItemProps) {
  const { task, deleteTask, toggleCompleted } = props
  const [count, setCount] = useState(0)

  function handleChange() {
    toggleCompleted(task.id)
  }

  useEffect(() => {
    if (task.completed) setCount(100)
  }, [task.completed])

  return (
    <div className='todo-item'>
      <input
        type='checkbox'
        defaultChecked={task.completed}
        {...(task.completed && { checked: true })}
        onChange={handleChange}
      />
      <p className={task.completed ? 'completed' : ''}>{task.text}</p>
      <p onClick={() => setCount((current) => current + 1)}>test-{count}</p>
      <button className='todo-btn' onClick={() => deleteTask(task.id)}>
        X
      </button>
    </div>
  )
}
