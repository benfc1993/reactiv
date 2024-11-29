import { ReactNode } from 'react'
import { MyContext } from '..'
import React, { useContext } from '../react'
import { useState } from '../react'
import { TodoItem } from './TodoItem'

export type Todo = { id: number; text: string; completed: boolean }
function Test(props: { children: ReactNode }) {
  const { children } = props
  return <>{children}</>
}

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
  const value = useContext(MyContext)

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

  /* TODO: Fix array rerender with no parent tag */

  return (
    <div className='todo-container'>
      {value}
      {Array.from({ length: value ?? 0 }).map((_, idx) => (
        <p key={`testing${idx}`}>testing - {idx}</p>
      ))}
      <p>Below</p>
      <Test>
        <p>testing</p>
      </Test>
      {value}
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
        <p>Blocked</p>
      </div>
    </div>
  )
}
