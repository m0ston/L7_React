import { useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  // Добавить задачу
  const addTodo = () => {
    if (input.trim()) {
      const newTodo = {
        id: Date.now(),
        text: input,
        status: 'active',
        date: new Date().toLocaleDateString()
      };
      setTodos([...todos, newTodo]);
      setInput('');
    }
  };

  // Удалить задачу
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Изменить статус
  const toggleStatus = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, status: todo.status === 'active' ? 'completed' : 'active' }
        : todo
    ));
  };

  // Фильтрация
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return todo.status === 'active';
    if (filter === 'completed') return todo.status === 'completed';
    return true;
  });

  return (
    <div className="app">
      <h1>📝 Мой To-Do List</h1>
      
      {/* Форма добавления */}
      <div className="add-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите задачу..."
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Добавить</button>
      </div>

      {/* Фильтры */}
      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Все задачи
        </button>
        <button 
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Активные
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Завершенные
        </button>
      </div>

      {/* Список задач */}
      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <p>Нет задач</p>
        ) : (
          <ul>
            {filteredTodos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.status}`}>
                <span 
                  className="todo-text"
                  onClick={() => toggleStatus(todo.id)}
                >
                  {todo.text}
                </span>
                <div className="todo-info">
                  <span className="status">{todo.status === 'active' ? '🟢' : '✅'}</span>
                  <span className="date">{todo.date}</span>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Статистика */}
      <div className="stats">
        Всего: {todos.length} | Активных: {todos.filter(t => t.status === 'active').length}
      </div>
    </div>
  );
}

export default App;