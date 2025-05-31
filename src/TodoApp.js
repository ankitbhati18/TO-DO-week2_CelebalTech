import React, { useState, useEffect } from 'react';
import './index.css';

const TodoApp = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newTask = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInput('');
  };

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const getFilteredTasks = () => {
    let filtered = [...tasks];
    if (filter === 'completed') filtered = filtered.filter(t => t.completed);
    else if (filter === 'active') filtered = filtered.filter(t => !t.completed);
    if (sortAsc) filtered.sort((a, b) => a.text.localeCompare(b.text));
    else filtered.sort((a, b) => b.text.localeCompare(a.text));
    return filtered;
  };

  return (
    <div className="todo-app">
      <div className="todo-container">
        <h1 className="todo-title">Things To Do</h1>

        <div className="todo-input-section">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Write a task and hit enter..."
            className="todo-input"
          />
          <button onClick={handleAddTask} className="todo-add-button">Add</button>
        </div>

        <div className="todo-controls">
          <div className="filters">
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
            <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Active</button>
            <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed</button>
          </div>
          <button onClick={() => setSortAsc(!sortAsc)} className="sort-button">
            Sort {sortAsc ? '▲' : '▼'}
          </button>
        </div>

        <ul className="todo-list">
          {getFilteredTasks().map((task) => (
            <li key={task.id} className={`todo-item ${task.completed ? 'done' : ''}`}>
              <span onClick={() => toggleTask(task.id)}>{task.text}</span>
              <button onClick={() => removeTask(task.id)} className="delete-button">×</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoApp;
