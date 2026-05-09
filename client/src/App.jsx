import { useState } from 'react'
import logoImg from './assets/logo.svg'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')

  const addTodo = () => {
    const trimmed = newTodo.trim()
    if (!trimmed) return
    setTodos([...todos, { text: trimmed, completed: false }])
    setNewTodo('')
  }

  const toggleTodo = (index) => {
    setTodos(
      todos.map((todo, idx) =>
        idx === index ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  return (
    <>
      <section id="title-box">
        <img src={logoImg} class="logo" alt="Logo" />
        <h1 class="title">My To Do List</h1>
      </section>

      <section id="todo-app">
        <p>Total tasks: {todos.length} ({todos.filter(t => t.completed).length} completed;
         &nbsp;{todos.filter(t => !t.completed).length} pending)</p>
        <div id="task-list">
          <ul>
            {todos.sort((a, b) => a.completed - b.completed).map((todo, index) => (
              <li
                key={index}
                style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(index)}
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
