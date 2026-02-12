import { useEffect, useState } from "react";
import { defaultMoods } from "../data/moods";

const MoodSelector = ({ currentMood, setCurrentMood }) => {
  const [moods, setMoods] = useState(() => {
    const saved = localStorage.getItem("moods");
    return saved ? JSON.parse(saved) : defaultMoods;
  });

  const [showEditor, setShowEditor] = useState(false);
  const [editingMood, setEditingMood] = useState(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#e3decf");

  // ✅ Save moods list
  useEffect(() => {
    localStorage.setItem("moods", JSON.stringify(moods));
  }, [moods]);

  // ✅ Restore selected mood on reload
  useEffect(() => {
    const savedMoodId = localStorage.getItem("currentMoodId");
    if (!savedMoodId) return;

    const found = moods.find(
      (m) => m.id === Number(savedMoodId)
    );

    if (found) {
      setCurrentMood(found);
    }
  }, [moods, setCurrentMood]);

  const resetEditor = () => {
    setShowEditor(false);
    setEditingMood(null);
    setName("");
    setColor("#e3decf");
  };

  const saveMood = () => {
    if (!name.trim()) return;

    if (editingMood) {
      setMoods((prev) =>
        prev.map((m) =>
          m.id === editingMood.id
            ? { ...m, name, glowColor: color }
            : m
        )
      );
    } else {
      setMoods((prev) => [
        ...prev,
        {
          id: Date.now(),
          name,
          glowColor: color,
        },
      ]);
    }

    resetEditor();
  };

  const deleteMood = (id) => {
    setMoods((prev) => prev.filter((m) => m.id !== id));

    if (currentMood?.id === id) {
      setCurrentMood(null);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex gap-4 flex-wrap justify-center p-4 rounded-2xl  bg-white/5 backdrop-blur  border border-white/10">
        {moods.map((mood) => (
          <div key={mood.id} className="relative group">
            <button
              onClick={() => setCurrentMood(mood)}
              style={{ boxShadow: `0 0 15px ${mood.glowColor}` }}
              className={`
                mood-button
                relative px-5 py-2 rounded-xl font-medium
                transition-all duration-300
                ${currentMood?.id === mood.id
                  ? "active scale-110"
                  : "opacity-60 hover:opacity-100 hover:scale-105"}
              `}
            >
              {mood.name}
            </button>

            <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => {
                  setEditingMood(mood);
                  setName(mood.name);
                  setColor(mood.glowColor);
                  setShowEditor(true);
                }}
                className="text-xs"
              >
                ✎
              </button>

              <button
                onClick={() => deleteMood(mood.id)}
                className="text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowEditor(true)}
          className="px-4 py-2 rounded-xl border border-amber-100/80"
        >
          +
        </button>
      </div>

      {showEditor && (
        <div
          className="
            mt-6 p-6 rounded-2xl
            bg-black/60 backdrop-blur
            border border-white/10
            max-w-sm mx-auto
            space-y-4
          "
          style={{ boxShadow: `0 0 10px ${color}` }}
        >
          <input
            placeholder="Mood name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              w-full px-4 py-3 rounded-xl
              bg-black border border-white/10
              focus:outline-none focus:border-white/30
            "
          />

          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 rounded-xl cursor-pointer"
          />

          <div className="flex gap-3 justify-end">
            <button onClick={saveMood} className="px-5 py-2 rounded-xl border border-white/10 hover:bg-white/5" >
              Save
            </button>
            <button onClick={resetEditor} className="px-5 py-2 rounded-xl border border-white/10 hover:bg-white/5">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodSelector;
