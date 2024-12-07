import { ReactNode } from 'react'
import React from '../react'
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

  function addTask() {
    const newTask = {
      id: Math.random(),
      text: text,
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
      <p>Below</p>
      <Test>
        <p>testing</p>
      </Test>
      <input
        className='input-todo'
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
      />
      <button className='todo-btn' onClick={() => addTask()}>
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
