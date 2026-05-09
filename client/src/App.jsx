import { useEffect, useState } from 'react'
import logoImg from './assets/logo.svg'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const response = await fetch(`${API_URL}/todos`)
        const data = await response.json()
        setTodos(data)
      } catch (error) {
        console.error('Failed to load todos', error)
      }
    }

    loadTodos()
  }, [])

  const addTodo = async () => {
    const trimmed = newTodo.trim()
    if (!trimmed) return

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: trimmed }),
      })

      if (!response.ok) {
        console.error('Failed to save todo')
        return
      }

      const created = await response.json()
      setTodos((current) => [...current, created])
      setNewTodo('')
    } catch (error) {
      console.error('Failed to save todo', error)
    }
  }

  const toggleTodo = async (todo) => {
    try {
      const response = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todo.completed }),
      })

      if (!response.ok) {
        console.error('Failed to update todo')
        return
      }

      const updated = await response.json()
      setTodos((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      )
    } catch (error) {
      console.error('Failed to update todo', error)
    }
  }

  const sortedTodos = [...todos].sort((a, b) => a.completed - b.completed)

  return (
    <>
      <section id="title-box">
        <img src={logoImg} className="logo" alt="Logo" />
        <h1 className="title">My To Do List</h1>
      </section>

      <section id="todo-app">
        <p>
          Total tasks: {todos.length} ({todos.filter((t) => t.completed).length}{' '}
          completed; &nbsp;{todos.filter((t) => !t.completed).length} pending)
        </p>
        <div id="task-list">
          <ul>
            {sortedTodos.map((todo) => (
              <li
                key={todo.id}
                style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo)}
                  />
                  {todo.text}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div id="add-task">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="New task..."
          />
          <button onClick={addTodo}>Add</button>
        </div>
      </section>

      <section id="spacer"></section>
    </>
  )
}

export default App
