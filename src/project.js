const Project = (name) => {
  const todos = [];

  const getName = () => name;
  const getTodos = () => todos;

  const addTodo = (todo) => {
    todos.push(todo);
  };

  const removeTodo = (index) => {
    todos.splice(index, 1);
  };

  const getTodo = (index) => todos[index];

  return { getName, getTodos, addTodo, removeTodo, getTodo };
};

export default Project;