const ThemeToggle = ({ isDream, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="
        px-4 py-2 rounded-xl
        border border-black/20
        text-sm text-amber-800 font-medium
        backdrop-blur
        transition-all duration-300
        hover:scale-105
      "
    >
      {isDream ? "🌙 Dream Mode" : "⚡ Neon Mode"}
    </button>
  );
};

export default ThemeToggle;
