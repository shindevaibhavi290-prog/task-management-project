import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const loadTasks = async () => {
    const response = await fetch("/api/tasks");
    const data = await response.json();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    loadTasks();
  };

  const toggleTask = async (task) => {
    await fetch(`/api/tasks/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !task.completed,
      }),
    });

    loadTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    loadTasks();
  };

  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.length - completed;

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>TaskFlow</h1>

        <nav>
          <a className="active">Dashboard</a>
          <a>My Tasks</a>
          <a>Completed</a>
        </nav>

        <div className="profile">
          <div className="avatar">V</div>
          <div>
            <strong>Vaibhavi</strong>
            <span>Developer</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header>
          <div>
            <p className="welcome">Welcome back 👋</p>
            <h2>Task Dashboard</h2>
          </div>
        </header>

        <section className="cards">
          <div className="card">
            <span>Total Tasks</span>
            <strong>{tasks.length}</strong>
          </div>

          <div className="card">
            <span>Completed</span>
            <strong>{completed}</strong>
          </div>

          <div className="card">
            <span>Pending</span>
            <strong>{pending}</strong>
          </div>
        </section>

        <section className="task-panel">
          <div className="panel-header">
            <h3>My Tasks</h3>
          </div>

          <form onSubmit={addTask} className="add-form">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a new task..."
            />

            <button type="submit">Add Task</button>
          </form>

          <div className="task-list">
            {tasks.length === 0 ? (
              <p className="empty">No tasks yet. Add your first task.</p>
            ) : (
              tasks.map((task) => (
                <div className="task" key={task._id}>
                  <div className="task-info">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task)}
                    />

                    <span className={task.completed ? "done" : ""}>
                      {task.title}
                    </span>
                  </div>

                  <button
                    className="delete"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
