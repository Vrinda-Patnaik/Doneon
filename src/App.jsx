import { useLayoutEffect, useEffect, useState } from "react";
import MoodSelector from "./components/MoodSelector";
import Tasks from "./components/Tasks";
import ThemeToggle from "./components/ThemeToggle";

const DEFAULT_ACCENT = "#e3decf";

const App = () => {
  const [currentMood, setCurrentMood] = useState(() => {
    const savedMoodId = localStorage.getItem("currentMoodId");
    const savedMoods = localStorage.getItem("moods");

    if (!savedMoodId || !savedMoods) return null;

    const moods = JSON.parse(savedMoods);
    return moods.find(m => m.id === Number(savedMoodId)) || null;
  });

  // Apply glow color to the app
  useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      "--accent",
      currentMood?.glowColor || DEFAULT_ACCENT
    );
  }, [currentMood]);

  // ✅ Persist selected mood
  useEffect(() => {
    if (currentMood) {
      localStorage.setItem("currentMoodId", currentMood.id);
    } else {
      localStorage.removeItem("currentMoodId");
    }
  }, [currentMood]);

  const [isDreamMode, setIsDreamMode] = useState(() => {
    return localStorage.getItem("dreamMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("dreamMode", isDreamMode);
  }, [isDreamMode]);

  return (
    <div className={`min-h-screen neon-bg p-6 ${isDreamMode ? "dream" : ""}`}>
      <h1 className="text-4xl font-semibold tracking-tight text-center mb-8 text-amber-100/80">
        Mood Neon Todo
      </h1>

      <div className="flex justify-center mb-6">
        <ThemeToggle
          isDream={isDreamMode}
          toggle={() => setIsDreamMode(prev => !prev)}
        />
      </div>

      <p className="text-center text-amber-100/80 mb-6">
        Organize tasks by how you feel
      </p>
      <MoodSelector
        currentMood={currentMood}
        setCurrentMood={setCurrentMood}
      />

      <Tasks currentMood={currentMood} />
    </div>
  );
};

export default App;
