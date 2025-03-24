"use client";
import { useState, useEffect, useRef } from "react";
import {
  createTodo,
  updateTodo,
  deleteTodo,
  fetchTodos,
} from "../services/api";
import styles from "./page.module.css";

function Item({ todo, onRefresh }) {
  const [form, setForm] = useState();
  const inputRef = useRef();
  return (
    <div className={styles.itemContainer}>
      <div className={styles.id}>{todo.id}</div>
      <div className={styles.titleContainer}>
        <span
          style={{ display: form ? "none" : "block" }}
          className={styles.itemTitle}
          onClick={() => {
            setForm({ ...todo, title: todo.title });
            inputRef.current.focus();
          }}
        >
          {todo.title}
        </span>
        <input
          type="text"
          ref={inputRef}
          defaultValue={todo.title}
          className={styles.itemInput}
          style={{ display: form ? "block" : "none" }}
          onBlur={async (e) => {
            debugger;
            await updateTodo(todo.id, {
              ...todo,
              title: e.target.value,
            });
            setForm(undefined);
            onRefresh();
          }}
        />
      </div>
      <div className={styles.actions}>
        <button
          className={styles.deleteButton}
          onClick={async () => {
            await deleteTodo(todo.id);
            onRefresh();
          }}
        >
          DELETE
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const refetch = async () => {
    const todos = await fetchTodos();
    setTodos(todos);
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>TODO App</h1>
        <form
          className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();
            if (!title.trim()) return;
            setTitle("");
            await createTodo({
              title,
            });
            await refetch();
          }}
        >
          <input
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <button className={styles.button}>ADD</button>
        </form>
        <ul className={styles.list}>
          {todos.map((todo) => (
            <li key={todo.id} className={styles.item}>
              <Item todo={todo} onRefresh={refetch} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
