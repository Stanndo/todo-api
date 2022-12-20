const Todo = require('../models/todo.model');

async function getAllTodos(req, res, next) {

    let todos;

    try {
        todos = await Todo.getAllTodos();
    } catch (error) {
        return next(error);
    }
    
    res.json({
        todos: todos
    });
};

async function createTodo(req, res, next) {

    const todoText = req.body.text;
    const todoCategory = req.body.category;
    const createdDate = req.body.createdDate;
    const todo = new Todo(todoText, todoCategory, createdDate);
    let insertedId;
    try {
        const result = await todo.save();
        insertedId = result.insertedId;
    } catch (error) {
        return next(error)
    }
    
    todo.id = insertedId.toString();

    res.json({
        message: "Todo added successfully!",
        createdTodo: todo
    });
};

async function updateTodo(req, res, next) {
    const todoText = req.body.newText;
    const todoCategory = req.body.category;
    const createdDate = req.body.createdDate
    const todoId = req.params.id;   

    const updatedTodo = new Todo(todoText, todoCategory, createdDate, todoId);

    try {
        await updatedTodo.save();
    } catch (error) {
        return next(error);
    }

    res.json({
        message: "Todo successfully updated!",
        updatedTodo: updatedTodo,
    });
};

async function deleteTodo(req, res, next) {
    const todoId = req.params.id; 

    const todo = new Todo(null, null, null, todoId);

    try {
        await todo.delete();
    } catch (error) {
        return next(error);
    }

    res.json({
        message: "Todo successfully deleted!"
    });
};

module.exports = {
    getAllTodos: getAllTodos,
    createTodo: createTodo,
    updateTodo: updateTodo,
    deleteTodo: deleteTodo
}