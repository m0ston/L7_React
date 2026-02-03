import { useState, useEffect, useRef } from 'react';
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
      date: "10.12.2024",
      deadline: "2024-12-15"
    },
    {
      id: 2,
      title: "Купить продукты",
      description: "Молоко, хлеб, яйца",
      status: "Задача выполнена",
      priority: "Средний",
      date: "08.12.2024",
      deadline: "2024-12-09"
    },
  ];

  const [todos, setTodos] = useState(initialTodos);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // ID задачи в режиме редактирования
  const [editingField, setEditingField] = useState(null); // Поле которое редактируем
  const [editingValue, setEditingValue] = useState(""); // Значение для редактирования
  
  // Состояние для формы
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Активная задача',
    priority: 'Средний',
    deadline: ''
  });

  // Реф для отслеживания кликов вне поля редактирования
  const editRef = useRef(null);

  // Обработчик кликов вне поля редактирования
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editRef.current && !editRef.current.contains(event.target)) {
        saveEdit();
      }
    };

    if (editingId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingId, editingField, editingValue]);

  // Начать редактирование
  const startEdit = (id, field, value) => {
    setEditingId(id);
    setEditingField(field);
    setEditingValue(value);
  };

  // Сохранить изменения
  const saveEdit = () => {
    if (editingId === null || editingField === null) return;

    // Валидация - нельзя сохранить пустое значение
    if (!editingValue.trim()) {
      alert(`Поле не может быть пустым!`);
      cancelEdit();
      return;
    }

    setTodos(todos.map(todo => 
      todo.id === editingId 
        ? { ...todo, [editingField]: editingValue }
        : todo
    ));

    cancelEdit();
  };

  // Отменить редактирование
  const cancelEdit = () => {
    setEditingId(null);
    setEditingField(null);
    setEditingValue("");
  };

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
    if (window.confirm('Вы уверены, что хотите удалить задачу?')) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  // Фильтрация
  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return todo.status === "Активная задача";
    if (filter === "completed") return todo.status === "Задача выполнена" || todo.status === "Задача отменена";
    return true;
  });

  // Опции для статусов
  const statusOptions = ["Активная задача", "Задача выполнена", "Задача отменена"];
  
  // Опции для приоритетов
  const priorityOptions = ["Высокий", "Средний", "Низкий"];

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
                  {/* Название */}
                  <td 
                    className="editable-cell"
                    onClick={() => startEdit(todo.id, 'title', todo.title)}
                  >
                    {editingId === todo.id && editingField === 'title' ? (
                      <div ref={editRef}>
                        <input
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                          className="edit-input"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <span className="cell-content">{todo.title}</span>
                    )}
                  </td>

                  {/* Описание */}
                  <td 
                    className="editable-cell"
                    onClick={() => startEdit(todo.id, 'description', todo.description)}
                  >
                    {editingId === todo.id && editingField === 'description' ? (
                      <div ref={editRef}>
                        <textarea
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={saveEdit}
                          className="edit-textarea"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <span className="cell-content">{todo.description || '—'}</span>
                    )}
                  </td>

                  {/* Статус */}
                  <td 
                    className="editable-cell"
                    onClick={() => startEdit(todo.id, 'status', todo.status)}
                  >
                    {editingId === todo.id && editingField === 'status' ? (
                      <div ref={editRef}>
                        <select
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={saveEdit}
                          className="edit-select"
                          autoFocus
                        >
                          {statusOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <span className={`status-badge ${todo.status === 'Активная задача' ? 'active' : 'completed'}`}>
                        {todo.status}
                      </span>
                    )}
                  </td>

                  {/* Приоритет */}
                  <td 
                    className="editable-cell"
                    onClick={() => startEdit(todo.id, 'priority', todo.priority)}
                  >
                    {editingId === todo.id && editingField === 'priority' ? (
                      <div ref={editRef}>
                        <select
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={saveEdit}
                          className="edit-select"
                          autoFocus
                        >
                          {priorityOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <span className={`priority-badge ${todo.priority.toLowerCase()}`}>
                        {todo.priority}
                      </span>
                    )}
                  </td>

                  {/* Дата создания (не редактируется) */}
                  <td>{todo.date}</td>

                  {/* Дедлайн */}
                  <td 
                    className="editable-cell"
                    onClick={() => startEdit(todo.id, 'deadline', todo.deadline || '')}
                  >
                    {editingId === todo.id && editingField === 'deadline' ? (
                      <div ref={editRef}>
                        <input
                          type="date"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={saveEdit}
                          className="edit-input"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <span className="cell-content">{todo.deadline ? new Date(todo.deadline).toLocaleDateString('ru-RU') : '—'}</span>
                    )}
                  </td>

                  {/* Действия */}
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="delete-btn"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        Удалить
                      </button>
                      {editingId === todo.id && (
                        <button 
                          className="save-btn"
                          onClick={saveEdit}
                          style={{ marginLeft: '5px' }}
                        >
                          ✓
                        </button>
                      )}
                    </div>
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
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Приоритет</label>
                <select 
                  name="priority" 
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  {priorityOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
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

      {/* Подсказка */}
      <div className="hint">
        💡 Подсказка: кликните на любую ячейку (кроме "Дата создания"), чтобы редактировать
      </div>
    </div>
  );
}

export default App;