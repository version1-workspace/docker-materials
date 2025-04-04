(function () {
  function renderItem(todo, props) {
    const todoElement = document.createElement("li");
    todoElement.setAttribute("class", "todo__item");

    const containerElement = document.createElement("div");
    containerElement.setAttribute("class", "todo__item-container");

    const idElement = document.createElement("div");
    idElement.setAttribute("class", "todo__item-id");
    idElement.textContent = todo.id;

    const titleElement = document.createElement("div");
    titleElement.setAttribute("class", "todo__item-title");
    const spanElement = document.createElement("span");
    spanElement.textContent = todo.title;
    spanElement.setAttribute("class", "todo__item-title-text");
    spanElement.addEventListener("click", async () => {
      spanElement.classList.add("todo__item-title-text--editing");
      inputElement.classList.add("todo__item-input--editing");
      inputElement.focus();
    });
    titleElement.appendChild(spanElement);

    const inputElement = document.createElement("input");
    inputElement.setAttribute("class", "todo__item-input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("name", "title");
    inputElement.setAttribute("value", todo.title);
    inputElement.addEventListener("blur", async (e) => {
      titleElement.classList.remove("todo__item-title-text--editing");
      inputElement.classList.remove("todo__item-input--editing");
      await props.onUpdateItem?.({
        id: todo.id,
        title: e.target.value,
      });
    });

    titleElement.appendChild(inputElement);

    const actionElement = document.createElement("div");
    actionElement.setAttribute("class", "todo__item-action");
    const button = document.createElement("button");
    button.setAttribute("class", "button button--danger todo__item-delete");
    button.textContent = "DELETE";
    button.addEventListener("click", async () => {
      props.onDeleteItem?.(todo.id);
    });
    actionElement.appendChild(button);

    containerElement.appendChild(idElement);
    containerElement.appendChild(titleElement);
    containerElement.appendChild(actionElement);

    todoElement.appendChild(containerElement);

    return todoElement;
  }

  async function renderTodos(onDeleteItem, onUpdateItem) {
    const list = await fetchTodos();

    const listElement = document.createElement("ul");
    listElement.setAttribute("class", "todo__list");

    list.forEach((todo) => {
      const itemElemnt = renderItem(todo, {
        onDeleteItem,
        onUpdateItem,
      });
      listElement.appendChild(itemElemnt);
    });

    return listElement;
  }

  function renderForm(onSubmit) {
    const containerElement = document.createElement("div");
    containerElement.setAttribute("class", "todo__form-container");

    const titleElement = document.createElement("h2");
    titleElement.textContent = "TODO App";

    const formElement = document.createElement("form");
    formElement.setAttribute("class", "todo__form");
    formElement.setAttribute("id", "todo-form");
    formElement.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(formElement);
      const id = formData.get("id");
      const title = formData.get("title");
      onSubmit?.({
        id,
        title,
      });
    });

    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("name", "title");
    inputElement.setAttribute("placeholder", "TODOを入力してください");
    inputElement.setAttribute("class", "todo__form-input");

    const buttonElement = document.createElement("button");
    buttonElement.setAttribute("type", "submit");
    buttonElement.setAttribute(
      "class",
      "button button--primary todo__form-button",
    );
    buttonElement.textContent = "ADD";

    formElement.appendChild(inputElement);
    formElement.appendChild(buttonElement);
    containerElement.appendChild(titleElement);
    containerElement.appendChild(formElement);

    return containerElement;
  }

  async function render() {
    const rootElement = document.getElementById("root");
    rootElement.innerHTML = "";

    const onSubmit = async (todo) => {
      await postTodo(todo);
      render();
    };

    const onDeleteItem = async (id) => {
      await deleteTodo(id);
      render();
    };

    const onUpdateItem = async (todo) => {
      await updateTodo(todo.id, todo);
      render();
    };

    rootElement.appendChild(renderForm(onSubmit));

    const todosElement = await renderTodos(onDeleteItem, onUpdateItem);
    rootElement.appendChild(todosElement);
  }

  async function fetchTodos() {
    const res = await fetch("/api/v1/todos");
    const json = await res.json();
    return json;
  }

  async function updateTodo(id, body) {
    const res = await fetch(`/api/v1/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    return json;
  }

  async function postTodo(body) {
    const res = await fetch("/api/v1/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    return json;
  }

  async function deleteTodo(id) {
    const res = await fetch(`/api/v1/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    return json;
  }

  render();
})();
