import Project from './project.js';
import Todo from './todo.js';

const Storage = (() => {
  const saveProjects = (projects) => {
    localStorage.setItem('projects', JSON.stringify(projects.map(p => ({
      name: p.getName(),
      todos: p.getTodos()
    }))));
  };

  const loadProjects = () => {
    const data = JSON.parse(localStorage.getItem('projects'));
    if (!data) return null;

    return data.map(p => {
      const project = Project(p.name);
      p.todos.forEach(t => {
        project.addTodo(Todo(t.title, t.description, t.dueDate, t.priority, t.notes, t.done));
      });
      return project;
    });
  };

  return { saveProjects, loadProjects };
})();

export default Storage;