import { useState } from 'react';
import './App.css';

function App() {
  // Пример начальных задач
  const initialTodos = [
    {
      id: 1,
      title: "Сделать домашку по React",
      description: "Написать todo-лист с модальным окном",
      status: "Активная задача",
      priority: "Высокий",
      date: "2024-12-10",
      deadline: "2024-12-15"
    },
    {
      id: 2,
      title: "Купить продукты",
      description: "Молоко, хлеб, яйца",
      status: "Задача выполнена",
      priority: "Средний",
      date: "2024-12-08",
      deadline: "2024-12-09"
    },
  ];

  const [todos, setTodos] = useState(initialTodos);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  
  // Состояние для формы
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Активная задача',
    priority: 'Средний',
    deadline: ''
  });

  // Обработчик изменения формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Добавить задачу через модалку
  const addTodo = () => {
    if (!formData.title.trim()) {
      alert('Введите название задачи!');
      return;
    }

    const newTodo = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      date: new Date().toLocaleDateString('ru-RU'),
      deadline: formData.deadline
    };

    setTodos([...todos, newTodo]);
    setShowModal(false);
    
    // Сброс формы
    setFormData({
      title: '',
      description: '',
      status: 'Активная задача',
      priority: 'Средний',
      deadline: ''
    });
  };

  // Удалить задачу
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Фильтрация
  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return todo.status === "Активная задача";
    if (filter === "completed") return todo.status === "Задача выполнена" || todo.status === "Задача отменена";
    return true;
  });

  return (
    <div className="app">
      <h1>📋 Управление задачами</h1>
      
      {/* Кнопка добавления */}
      <div className="header-controls">
        <button 
          className="add-btn"
          onClick={() => setShowModal(true)}
        >
          + Добавить задачу
        </button>
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
          Активные задачи
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Завершенные задачи
        </button>
      </div>

      {/* Таблица */}
      <div className="table-container">
        <table className="todo-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Описание</th>
              <th>Статус</th>
              <th>Приоритет</th>
              <th>Дата создания</th>
              <th>Дедлайн</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredTodos.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  Нет задач
                </td>
              </tr>
            ) : (
              filteredTodos.map(todo => (
                <tr key={todo.id}>
                  <td>{todo.title}</td>
                  <td>{todo.description}</td>
                  <td>
                    <span className={`status-badge ${todo.status === 'Активная задача' ? 'active' : 'completed'}`}>
                      {todo.status}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-badge ${todo.priority.toLowerCase()}`}>
                      {todo.priority}
                    </span>
                  </td>
                  <td>{todo.date}</td>
                  <td>{todo.deadline || '—'}</td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Модальное окно */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Новая задача</h2>
            
            <div className="form-group">
              <label>Название *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Введите название"
              />
            </div>

            <div className="form-group">
              <label>Описание</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Введите описание"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Статус</label>
                <select 
                  name="status" 
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Активная задача">Активная задача</option>
                  <option value="Задача выполнена">Задача выполнена</option>
                  <option value="Задача отменена">Задача отменена</option>
                </select>
              </div>

              <div className="form-group">
                <label>Приоритет</label>
                <select 
                  name="priority" 
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="Высокий">Высокий</option>
                  <option value="Средний">Средний</option>
                  <option value="Низкий">Низкий</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Дедлайн</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Отмена
              </button>
              <button className="submit-btn" onClick={addTodo}>
                Создать задачу
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Статистика */}
      <div className="stats">
        Всего задач: {todos.length} | 
        Активных: {todos.filter(t => t.status === "Активная задача").length} | 
        Завершенных: {todos.filter(t => t.status === "Задача выполнена" || t.status === "Задача отменена").length}
      </div>
    </div>
  );
}

export default App;