import { useEffect, useState } from 'react';
import './App.css';

const STORAGE_KEY = 'todos';

function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

const FILTERS = {
  all: () => true,
  active: (todo) => !todo.completed,
  completed: (todo) => todo.completed,
};

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  const save = () => {
    const text = draft.trim();
    if (text) {
      onEdit(todo.id, text);
    } else {
      setDraft(todo.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') {
      setDraft(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'not done' : 'done'}`}
      />
      {isEditing ? (
        <input
          className="edit-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span className="todo-text" onDoubleClick={() => setIsEditing(true)}>
          {todo.text}
        </span>
      )}
      <button
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.text}"`}
      >
        ×
      </button>
    </li>
  );
}

function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // Storage may be full or unavailable; keep working in memory.
    }
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
    setInput('');
  };

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const editTodo = (id, text) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, text } : t)));

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id));

  const clearCompleted = () => setTodos(todos.filter((t) => !t.completed));

  const visibleTodos = todos.filter(FILTERS[filter]);
  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="App">
      <h1>Todo List</h1>

      <form className="add-form" onSubmit={addTodo}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo"
        />
        <button type="submit">Add</button>
      </form>

      {todos.length > 0 && (
        <>
          <ul className="todo-list">
            {visibleTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
          </ul>

          <div className="footer">
            <span>
              {remaining} item{remaining !== 1 ? 's' : ''} left
            </span>
            <div className="filters">
              {Object.keys(FILTERS).map((name) => (
                <button
                  key={name}
                  className={filter === name ? 'active' : ''}
                  onClick={() => setFilter(name)}
                >
                  {name[0].toUpperCase() + name.slice(1)}
                </button>
              ))}
            </div>
            <button className="clear-btn" onClick={clearCompleted}>
              Clear completed
            </button>
          </div>
        </>
      )}

      {todos.length === 0 && <p className="empty">No todos yet. Add one above!</p>}
      <p className="hint">Double-click a todo to edit it.</p>
    </div>
  );
}

export default App;
