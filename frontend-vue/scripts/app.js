const TodosApp = {
  data() {
    return {
      todos: [],
      todoText: "",
      todoCategory: "",
      createdAt: "",
      focused: false,
      beforeEditedTodoTextCache: "",
    };
  },
  directives: {
    focus: {
      mounted: function (el) {
        el.focus();
      },
    },
  },
  methods: {
    async saveTodo(event) {
      event.preventDefault();
      this.createdAt = Date.now();

      let reqres;
      try {
        reqres = await fetch("http://localhost:3000/todos", {
          method: "POST",
          body: JSON.stringify({
            text: this.todoText,
            category: this.todoCategory,
            createdDate: this.createdAt,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        alert("Something went wrong!");
        return;
      }

      if (!reqres.ok) {
        alert("Something went wrong!");
        return;
      }

      const responseData = await reqres.json();

      const newTodo = {
        text: this.todoText,
        category: this.todoCategory,
        createdDate: this.createdAt,
        id: responseData.createdTodo.id,
        editable: false,
      };

      this.todos.push(newTodo);

      console.log(newTodo)
      this.todoText = "";
      this.todoCategory = "";
      this.createdAt = "";
    },
    async deleteTodo(todoId) {
      this.todos = this.todos.filter((todoItem) => {
        return todoItem.id !== todoId;
      });

      let response;

      try {
        response = await fetch("http://localhost:3000/todos/" + todoId, {
          method: "DELETE",
        });
      } catch (error) {
        alert("Something went wrong!");
        return;
      }

      if (!response.ok) {
        alert("Something went wrong!");
        return;
      }
    },
    startUpdateTodo(todoId) { 
      let todo = this.todos.find(function (todoItem) {
        return todoItem.id === todoId;
      });
      this.beforeEditedTodoTextCache = todo.text;
      
      todo.editable = true;
    },
    async updateTodo(todoId) {
      let todo = this.todos.find(function (todoItem) {
        return todoItem.id === todoId;
      });
     
      let reqres;

      try {
        reqres = await fetch("http://localhost:3000/todos/" + todoId, {
          method: "PATCH",
          body: JSON.stringify({
            newText: todo.text,
            category: todo.category,
            createdDate: todo.createdDate,
            editable: false,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        alert("Something went wrong!");
        return;
      }

      if (!reqres.ok) {
        alert("Something went wrong!");
        return;
      }

      const responseData = await reqres.json();
      console.log(responseData);     
      console.log(todo);
    },
    cancelEditing(todoId) {
      const todo = this.todos.find(function (todoItem) {
        return todoItem.id === todoId;
      });
      console.log(todo);
      todo.text = this.beforeEditedTodoTextCache;
      todo.editable = false;
    },
    doneUpdating(todoId) {
      const todo = this.todos.find(function (todoItem) {
        return todoItem.id === todoId;
      });
      if (todo.text.trim().length === 0) {
        todo.text = this.beforeEditedTodoTextCache;
      }
      // calling function for the update
      this.updateTodo(todo.id);
      
      todo.editable = false;
    }
  },
  async created() {
    let reqres;
    try {
      reqres = await fetch("http://localhost:3000/todos");
    } catch (error) {
      alert("Something went wrong!");
      //this.isLoading = false;
      return;
    }

    if (!reqres.ok) {
      alert("Something went wrong!");
      return;
    }

    const responseData = await reqres.json();

    this.todos = responseData.todos;
  },
};

Vue.createApp(TodosApp).mount("#todos-app");