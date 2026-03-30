import Todo from './todo.js';
import Project from './project.js';
import Storage from './storage.js';
import { format } from 'date-fns';

const UI = (() => {
  let projects = [];
  let activeProject = null;

  const loadProjects = () => {
    const saved = Storage.loadProjects();
    if (saved && saved.length > 0) {
      projects = saved;
    } else {
      const defaultProject = Project('Default');
      projects.push(defaultProject);
    }
    activeProject = projects[0];
  };

  const saveProjects = () => {
    Storage.saveProjects(projects);
  };

  const renderProjects = () => {
    const list = document.getElementById('projects-list');
    list.innerHTML = '';
    projects.forEach((project, index) => {
      const btn = document.createElement('button');
      btn.textContent = project.getName();
      btn.classList.add('project-btn');
      if (project === activeProject) btn.classList.add('active');
      btn.addEventListener('click', () => {
        activeProject = projects[index];
        renderProjects();
        renderTodos();
      });
      list.appendChild(btn);
    });
  };

  const renderTodos = () => {
    const list = document.getElementById('todos-list');
    const title = document.getElementById('project-title');
    list.innerHTML = '';
    title.textContent = activeProject.getName();

    activeProject.getTodos().forEach((todo, index) => {
      const item = document.createElement('div');
      item.classList.add('todo-item', todo.priority);
      if (todo.done) item.classList.add('done');

      item.innerHTML = `
        <div class="todo-left">
          <input type="checkbox" ${todo.done ? 'checked' : ''} data-index="${index}">
          <div>
            <p class="todo-title">${todo.title}</p>
            <p class="todo-date">${todo.dueDate ? format(new Date(todo.dueDate), 'MMM dd yyyy') : 'No date'}</p>
          </div>
        </div>
        <div class="todo-right">
          <span class="priority-badge ${todo.priority}">${todo.priority}</span>
          <button class="delete-todo-btn" data-index="${index}">🗑️</button>
        </div>
      `;

      list.appendChild(item);
    });
  };

  const setupEventListeners = () => {
    // Project dialog
    const projectDialog = document.getElementById('project-dialog');
    document.getElementById('add-project-btn').addEventListener('click', () => {
      projectDialog.showModal();
    });
    document.getElementById('cancel-project-btn').addEventListener('click', () => {
      projectDialog.close();
    });
    document.getElementById('project-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('project-name-input').value;
      const project = Project(name);
      projects.push(project);
      activeProject = project;
      saveProjects();
      renderProjects();
      renderTodos();
      document.getElementById('project-form').reset();
      projectDialog.close();
    });

    // Todo dialog
    const todoDialog = document.getElementById('todo-dialog');
    document.getElementById('add-todo-btn').addEventListener('click', () => {
      todoDialog.showModal();
    });
    document.getElementById('cancel-todo-btn').addEventListener('click', () => {
      todoDialog.close();
    });
    document.getElementById('todo-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('todo-title').value;
      const description = document.getElementById('todo-description').value;
      const dueDate = document.getElementById('todo-due-date').value;
      const priority = document.getElementById('todo-priority').value;
      const notes = document.getElementById('todo-notes').value;
      const todo = Todo(title, description, dueDate, priority, notes);
      activeProject.addTodo(todo);
      saveProjects();
      renderTodos();
      document.getElementById('todo-form').reset();
      todoDialog.close();
    });

    // Delete and toggle todo
    document.getElementById('todos-list').addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-todo-btn')) {
        const index = e.target.dataset.index;
        activeProject.removeTodo(index);
        saveProjects();
        renderTodos();
      }
      if (e.target.type === 'checkbox') {
        const index = e.target.dataset.index;
        activeProject.getTodo(index).done = !activeProject.getTodo(index).done;
        saveProjects();
        renderTodos();
      }
    });
  };

  const init = () => {
    loadProjects();
    renderProjects();
    renderTodos();
    setupEventListeners();
  };

  return { init };
})();

export default UI;