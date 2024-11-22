import { Provider } from '..'
import React, { useContext } from '../react'
import { useState } from '../react'
import { TodoItem } from './TodoItem'

export type Todo = { id: number; text: string; completed: boolean }

export function TodoList() {
  const [tasks, setTasks] = useState<Todo[]>([
    {
      id: 1,
      text: 'Doctor Appointment',
      completed: true,
    },
    {
      id: 2,
      text: 'Meeting at School',
      completed: false,
    },
  ])

  const [text, setText] = useState('')
  const value = useContext(Provider)
  console.log({ value })

  function addTask(text: string) {
    const newTask = {
      id: Math.random(),
      text,
      completed: false,
    }
    setTasks((current) => [...current, newTask])
    setText('')
  }
  function deleteTask(id: number) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
  }
  function toggleCompleted(id: number) {
    setTasks((current) =>
      current.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed }
        } else {
          return task
        }
      })
    )
  }
  return (
    <div className='todo-container'>
      <input
        className='input-todo'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className='todo-btn' onClick={() => addTask(text)}>
        Add
      </button>
      <div className='todo-list'>
        {tasks.map((task) => {
          return (
            <TodoItem
              key={`${task.text}-${task.id}`}
              task={task}
              deleteTask={deleteTask}
              toggleCompleted={toggleCompleted}
            />
          )
        })}
      </div>
    </div>
  )
}
