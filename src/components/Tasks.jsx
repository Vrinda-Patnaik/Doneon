import { useState, useEffect } from "react";
import DeleteIcon from "./DeleteIcon";  

const Tasks = ({ currentMood }) => {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text: input,
      mood: currentMood?.name || "Neutral",
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]); // newest on top
    setInput("");
  };

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">

      <div className="flex flex-col gap-4">
        <h2 className="tasks-subheading text-xl font-semibold text-amber-100/80">
          Add a Task
        </h2>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a task..."
          className="px-4 py-3 rounded-xl bg-black border border-white/20
                    text-white outline-none mood-glow"
        />

        <button
          onClick={addTask}
          className="tasks-subheading self-end px-4 py-2 text-sm rounded-lg font-medium mood-glow text-amber-100/80"
        >
          Add
        </button>
      </div>

      <div className="space-y-4 p-5 rounded-2xl border border-white/10 mood-glow transition-all">
        <h2 className="tasks-subheading text-xl font-semibold mb-4 text-amber-100/80">
          Your Tasks
        </h2>

        {tasks.length === 0 && (
          <p className="tasks-subheading text-white/40">
            No tasks yet. 
          </p>
        )}

        {tasks.map((task) => (
          <div
            key={task.id}
            className="fade-in px-4 py-3 rounded-xl
              task-card
              border border-white/10
              flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  setTasks(prev =>
                    prev.map(t =>
                      t.id === task.id
                        ? { ...t, completed: !t.completed }
                        : t
                    )
                  )
                }
              />
              <div className="flex flex-col">
                <p className={`text-white ${
                  task.completed ? "line-through text-white/40" : ""
                }`}>
                  {task.text}
                </p>
                <span className="text-xs text-white/40 mt-1">
                  {task.mood}
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                setTasks((prev) => prev.filter((t) => t.id !== task.id))
              }
              className="delete-icon text-white/40 hover:text-red-400 transition"
              label="Delete task"
            >
              <DeleteIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div> 

    </div>
  );

};

export default Tasks;
