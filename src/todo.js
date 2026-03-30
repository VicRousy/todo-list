const Todo = (title, description, dueDate, priority, notes = '', done = false) => {
  return { title, description, dueDate, priority, notes, done };
};

export default Todo;