import React, { useState, useEffect } from "react";

export default function MoodTracker() {
  const [mood, setMood] = useState("");
  const [color, setColor] = useState("#0f172a"); // default: dark navy
  const [playlist, setPlaylist] = useState("");
  const [habits, setHabits] = useState({});
  const [newHabit, setNewHabit] = useState("");

  const moods = [
    { name: "Happy 😊", color: "#FDE68A", playlist: "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC" },
    { name: "Sad 😢", color: "#2563EB", playlist: "https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634" },
    { name: "Calm 🧘‍♀️", color: "#34D399", playlist: "https://open.spotify.com/playlist/37i9dQZF1DX0FOF1IUWK1W" },
    { name: "Energetic ⚡", color: "#F97316", playlist: "https://open.spotify.com/playlist/37i9dQZF1DX70RN3TfWWJh" },
    { name: "Romantic 💖", color: "#EC4899", playlist: "https://open.spotify.com/playlist/37i9dQZF1DWXb9I5xoXLjp" },
  ];

  // ✅ Load habits from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("habits"));
    if (saved) setHabits(saved);
    else {
      const defaults = { water: false, walk: false, meditate: false, read: false };
      setHabits(defaults);
      localStorage.setItem("habits", JSON.stringify(defaults));
    }
  }, []);

  // ✅ Save habits whenever updated
  useEffect(() => {
    if (Object.keys(habits).length > 0) {
      localStorage.setItem("habits", JSON.stringify(habits));
    }
  }, [habits]);

  const handleMoodSelect = (m) => {
    setMood(m.name);
    setColor(m.color);
    setPlaylist(m.playlist);

    // save mood + streak
    const today = new Date().toLocaleDateString();
    const savedMoods = JSON.parse(localStorage.getItem("moodHistory")) || [];
    const updated = [...savedMoods.filter((x) => x.date !== today), { mood: m.name, date: today }];
    localStorage.setItem("moodHistory", JSON.stringify(updated));

    const last = localStorage.getItem("lastMoodDate");
    let streak = parseInt(localStorage.getItem("streak")) || 0;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (last === yesterday.toLocaleDateString()) streak++;
    else if (last !== today) streak = 1;
    localStorage.setItem("lastMoodDate", today);
    localStorage.setItem("streak", streak);
  };

  const toggleHabit = (habit) => setHabits({ ...habits, [habit]: !habits[habit] });

  const addHabit = () => {
    if (newHabit.trim() === "") return;
    if (habits[newHabit]) return alert("This habit already exists!");
    const updated = { ...habits, [newHabit.trim()]: false };
    setHabits(updated);
    setNewHabit("");
  };

  const removeHabit = (habit) => {
    const updated = { ...habits };
    delete updated[habit];
    setHabits(updated);
  };

  // ✅ Decide if background is light or dark for contrast
  const isLightColor = () => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 180;
  };

  const textColor = isLightColor() ? "text-gray-900" : "text-white";
  const cardBg = isLightColor() ? "bg-white/90 text-gray-800" : "bg-gray-800/80 text-white";

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-all duration-700 px-4 ${textColor}`}
      style={{ backgroundColor: color }}
    >
      <h1 className="text-4xl font-bold mb-8 text-center drop-shadow-md">
        How are you feeling today?
      </h1>

      {/* 🎭 Mood Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {moods.map((m, i) => (
          <button
            key={i}
            onClick={() => handleMoodSelect(m)}
            className="px-6 py-3 rounded-2xl font-medium text-lg bg-white/70 hover:scale-105 transition shadow-md"
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* ✅ Customizable Habits */}
      <div className={`rounded-2xl p-6 shadow-lg max-w-md w-full mb-6 ${cardBg}`}>
        <h2 className="text-2xl font-semibold mb-4 text-center">🗓️ Today's Habits</h2>

        {/* Add new habit */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Add new habit..."
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
          />
          <button
            onClick={addHabit}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>

        {/* Habit List */}
        {Object.keys(habits).length === 0 ? (
          <p className="text-center opacity-80">No habits added yet.</p>
        ) : (
          <div className="space-y-2">
            {Object.keys(habits).map((key) => (
              <div
                key={key}
                className="flex justify-between items-center bg-white/10 px-3 py-2 rounded-lg"
              >
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={habits[key]}
                    onChange={() => toggleHabit(key)}
                    className="w-5 h-5 accent-indigo-500"
                  />
                  <span className="capitalize text-lg">{key}</span>
                </label>
                <button
                  onClick={() => removeHabit(key)}
                  className="text-red-400 hover:text-red-600 font-bold text-lg"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🎧 Playlist */}
      {mood && (
        <div className={`text-center mt-6 rounded-2xl p-6 shadow-lg max-w-lg ${cardBg}`}>
          <h2 className="text-2xl font-semibold mb-3">Mood: {mood}</h2>
          <p className="opacity-90 mb-4">Here's a playlist that matches your vibe 🎶</p>
          <a
            href={playlist}
            target="_blank"
            rel="noreferrer"
            className="bg-indigo-600 text-white px-5 py-3 rounded-xl shadow hover:bg-indigo-700"
          >
            Listen on Spotify
          </a>
        </div>
      )}
    </div>
  );
}
