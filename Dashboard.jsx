import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [moodHistory, setMoodHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [habits, setHabits] = useState({});
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const moods = JSON.parse(localStorage.getItem("moodHistory")) || [];
    const streakCount = localStorage.getItem("streak") || 0;
    const savedHabits = JSON.parse(localStorage.getItem("habits")) || {};

    setMoodHistory(moods);
    setStreak(streakCount);
    setHabits(savedHabits);

    const total = Object.keys(savedHabits).length;
    const completed = Object.values(savedHabits).filter(Boolean).length;
    setCompletion(total ? Math.round((completed / total) * 100) : 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-6">🌟 Your Dashboard</h1>

      {/* Streak Section */}
      <div className="bg-white/10 p-6 rounded-2xl shadow-lg text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">🔥 Mood Streak</h2>
        <p className="text-4xl font-bold text-yellow-400">{streak} Days</p>
      </div>

      {/* Habit Completion */}
      <div className="bg-white/10 p-6 rounded-2xl shadow-lg text-center mb-6">
        <h2 className="text-2xl font-semibold mb-3">✅ Habit Completion</h2>
        <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-700"
            style={{ width: `${completion}%` }}
          ></div>
        </div>
        <p className="text-lg">{completion}% completed</p>
      </div>

      {/* Mood History */}
      <div className="bg-white/10 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">🧠 Mood History</h2>
        {moodHistory.length === 0 ? (
          <p className="text-gray-300 text-center">No moods tracked yet.</p>
        ) : (
          <ul className="space-y-3">
            {moodHistory.map((m, i) => (
              <li
                key={i}
                className="flex justify-between bg-white/20 p-3 rounded-xl text-sm"
              >
                <span>{m.emoji} {m.mood}</span>
                <span className="text-gray-300">{m.date}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
