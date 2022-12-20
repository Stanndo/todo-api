const todoFormElem = document.getElementById("new-todo-form");
const todosListElem = document.getElementById("todos-list");
const inputDateElem = document.getElementById("date-input");

let editedTodoElement;

async function loadTodos() {
    let reqres;
    try {
        reqres = await fetch("http://localhost:3000/todos");
    } catch (error) {
        alert("Something went wrong!");
        return;
    }
    
    if (!reqres.ok) {
      alert("Something went wrong!");
      return;
    }

    const responseData = await reqres.json();
    const todos = responseData.todos;

    for(const todo of todos) {
        createTodoListItem(todo.text, todo.category, todo.createdDate , todo.id);
    }
}

function createTodoListItem(todoText, todoCategory, createdDate, todoId) {
    const todoItemListElem = document.createElement('li');
    todoItemListElem.classList.add("todo-item");
    todoItemListElem.dataset.todoid = todoId;
    
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";

    const span = document.createElement("span");
    span.classList.add("bubble");

    if (todoCategory == "personal") {
      span.classList.add("personal");
    } else {
      span.classList.add("business");
    }
    const content = document.createElement("div");
    content.classList.add("todo-content");
    content.innerHTML = `<input type="text" value="${todoText}" readonly>`;

    const categoryInputHiddenElem = document.createElement("input");
    categoryInputHiddenElem.type = "hidden";
    categoryInputHiddenElem.value = todoCategory;

    const dateInputHiddenElem = document.createElement("input");
    dateInputHiddenElem.type = "hidden";
    dateInputHiddenElem.value = createdDate;

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit");
    editBtn.textContent = 'Edit';
    editBtn.addEventListener("click", startTodoEditing);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener("click", deleteTodo);

    label.appendChild(input);
    label.appendChild(span);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    todoItemListElem.appendChild(label);
    todoItemListElem.appendChild(content);
    todoItemListElem.appendChild(actions);  
    todoItemListElem.appendChild(categoryInputHiddenElem);
    todoItemListElem.appendChild(dateInputHiddenElem);
    
    todosListElem.appendChild(todoItemListElem);
}

async function createTodo(todoText, todoCategory, createdDate) {
  let reqres;
  try {
    reqres = await fetch("http://localhost:3000/todos", {
      method: "POST",
      body: JSON.stringify({
        text: todoText,
        category: todoCategory,
        createdDate: createdDate,
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
  const todoId = responseData.createdTodo.id;

  todoFormElem.querySelector('input[name="text"]').value = "";
  todoFormElem.querySelector('input[name="category"]:checked').checked = false;

  createTodoListItem(todoText, todoCategory, createdDate, todoId);
}

async function updateTodo(updatedText, category, createdDate) {
  const todoId = editedTodoElement.dataset.todoid;
  let reqres;
  try {
    reqres = await fetch("http://localhost:3000/todos/" + todoId, {
      method: "PATCH",
      body: JSON.stringify({
        newText: updatedText,
        category: category,
        createdDate: createdDate,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrongs!");
    return;
  }

  if (!reqres.ok) {
    alert("Somethings went wrong!");
    return;
  }

  editedTodoElement.children[1].children[0].value = updatedText;

}

function startTodoEditing(event) {

  const clickedEditButtonElem = event.target;
  editedTodoElement = clickedEditButtonElem.parentElement.parentElement;
 
  let currentText = editedTodoElement.children[1].firstElementChild.value;
  const currentCategory = editedTodoElement.children[3].value;
  const createdDate = editedTodoElement.children[4].value;
  
  const editInput = editedTodoElement.querySelector("input[type=text]");
  console.log(editInput);
  editInput.removeAttribute("readonly");
  editInput.focus();
  editInput.classList.add("input-focus");
  
  editInput.addEventListener('blur', (e) => {

    const confirmMessage = "Are you sure you want to make the changes?";

    if (confirm(confirmMessage)) {
      editInput.setAttribute("readonly", true);
      editInput.classList.remove("input-focus");
      currentText = e.target.value;
      console.log(currentText);
      updateTodo(currentText, currentCategory, createdDate);
    }
    
  })
 
}

async function deleteTodo(event) {
  const clickedDelButtonElem = event.target;
  const todoElement = clickedDelButtonElem.parentElement.parentElement;
  const todoId = todoElement.dataset.todoid;

  let reqres;
  try {
      reqres = await fetch("http://localhost:3000/todos/" + todoId, {
        method: "DELETE",
      });
  } catch (error) {
      alert("Something went wrong!");
      return;
  }

  if (!reqres.ok) {
    alert("Something went wrong!");
    return;
  }

  todoElement.remove();
};

function saveTodo(event) {
  event.preventDefault();

  const inputDate = new Date().getTime();
  inputDateElem.value = inputDate;

  const formInput = new FormData(event.target);
  const enteredTodoText = formInput.get("text");
  const enteredCategory = formInput.get("category");
  const createdDate = formInput.get("createdDate");

  if (!enteredTodoText || !enteredCategory || !createdDate) {
    alert("Please, add some text and pick a category!");
    return;
  }
  
  createTodo(enteredTodoText, enteredCategory, createdDate);
}


todoFormElem.addEventListener("submit", saveTodo);

loadTodos();