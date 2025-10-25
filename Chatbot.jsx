import React, { useState, useRef, useEffect } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("vibra_chat");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            sender: "bot",
            text: "👋 Hey there! I'm Vibra, your mood & wellness buddy. How are you feeling today?",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const msgsRef = useRef(null);

  const quickReplies = [
    "I'm feeling happy 😊",
    "I'm stressed 😩",
    "I'm tired 😴",
    "I'm sad 😢",
    "Motivate me 💪",
    "Suggest a habit 🌱",
  ];

  const playlists = {
    happy: "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC",
    sad: "https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634",
    calm: "https://open.spotify.com/playlist/37i9dQZF1DX0FOF1IUWK1W",
    energetic: "https://open.spotify.com/playlist/37i9dQZF1DX70RN3TfWWJh",
    romantic: "https://open.spotify.com/playlist/37i9dQZF1DWXb9I5xoXLjp",
    focus: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ",
  };

  const habitSuggestions = [
    "Drink a glass of water 💧",
    "Take 5 deep breaths 🌬️",
    "Stretch for 2 minutes 🧘",
    "Go for a short walk 🚶‍♀️",
    "Write down 3 good things 📝",
    "Listen to calming music 🎵",
    "Avoid your phone for 10 minutes 📵",
    "Say something kind to yourself 💜",
  ];

  // Scroll + Save
  useEffect(() => {
    msgsRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("vibra_chat", JSON.stringify(messages));
  }, [messages]);

  const sendUserMessage = (text) => {
    if (!text.trim()) return;
    const newMessage = {
      id: Date.now(),
      sender: "you",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    handleBotReply(text);
  };

  const handleBotReply = (userMsg) => {
    setIsTyping(true);
    setTimeout(() => {
      let reply = "I'm listening 👂 Tell me more.";
      let meta = {};
      const msg = userMsg.toLowerCase();

      if (msg.includes("happy") || msg.includes("great")) {
        reply = "That’s awesome! 🌞 Keep smiling — maybe some upbeat tunes to match your vibe?";
        meta.playlist = playlists.happy;
      } else if (msg.includes("sad") || msg.includes("down")) {
        reply = "I’m sorry you’re feeling low 💙. Music can really help. Want to try something soothing?";
        meta.playlist = playlists.sad;
      } else if (msg.includes("calm") || msg.includes("relaxed")) {
        reply = "Perfect. Peaceful mind, peaceful day 🌿 Here’s a playlist to stay in that zone.";
        meta.playlist = playlists.calm;
      } else if (msg.includes("energetic") || msg.includes("excited")) {
        reply = "Nice! ⚡ Let’s keep that energy going with something powerful!";
        meta.playlist = playlists.energetic;
      } else if (msg.includes("romantic") || msg.includes("love")) {
        reply = "Awww 💖 Love is beautiful! Here’s something soft and romantic for you.";
        meta.playlist = playlists.romantic;
      } else if (msg.includes("focus") || msg.includes("study")) {
        reply = "Let’s get productive 🧠 Try this focus playlist to stay in the zone.";
        meta.playlist = playlists.focus;
      } else if (msg.includes("stress") || msg.includes("anxious")) {
        reply =
          "Breathe with me 🫁 Inhale… Exhale… You’re doing great. Try taking a short break or a walk outside 🌿.";
      } else if (msg.includes("tired")) {
        reply =
          "You sound tired 😴 Maybe you need a short nap or stretch break. Hydrate and rest your eyes for a bit 👀.";
      } else if (msg.includes("lonely")) {
        reply =
          "You’re not alone 💜 It’s okay to feel lonely sometimes. Try calling a friend or journaling your thoughts.";
      } else if (msg.includes("bored")) {
        reply =
          "Feeling bored? Try learning a small skill, doodling, or stepping outside for fresh air 🌞.";
      } else if (msg.includes("habit")) {
        const habit = habitSuggestions[Math.floor(Math.random() * habitSuggestions.length)];
        reply = `Here’s a healthy habit to try today: ${habit}`;
      } else if (msg.includes("motivate") || msg.includes("motivation")) {
        reply =
          "You’ve got this 💪 Every small effort matters! Want me to give you one small action you can do now?";
      } else if (msg.includes("yes")) {
        const habit = habitSuggestions[Math.floor(Math.random() * habitSuggestions.length)];
        reply = `Awesome! Try this: ${habit}`;
      } else if (msg.includes("hello") || msg.includes("hi")) {
        reply = "Hey there 👋 How are you feeling today?";
      } else if (msg.includes("who are you")) {
        reply = "I’m Vibra 🤖, your personal wellness companion — here to track your mood, habits & keep you positive 💫.";
      } else if (msg.includes("thank")) {
        reply = "You’re very welcome 💜 Always here to help!";
      } else if (msg.includes("bye")) {
        reply = "Bye for now 👋 Remember — your well-being matters!";
      } else if (msg.includes("time")) {
        reply = `Right now it's ${new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} ⏰`;
      } else if (msg.includes("date")) {
        reply = `Today is ${new Date().toLocaleDateString()} 📅`;
      } else {
        reply =
          "Hmm 🤔 I didn’t quite get that. Try saying ‘I’m stressed’, ‘Motivate me’, or ‘Suggest a habit’.";
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: reply,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        meta,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  // 🔄 Refresh chat function
  const refreshChat = () => {
    localStorage.removeItem("vibra_chat");
    setMessages([
      {
        id: 1,
        sender: "bot",
        text: "🔄 Chat refreshed! 👋 Hey there again, how are you feeling today?",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 text-white">
      <div className="w-full max-w-3xl bg-white/10 rounded-2xl shadow-xl backdrop-blur flex flex-col h-[85vh] p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-xl font-bold">
              🤖
            </div>
            <div>
              <h2 className="text-lg font-semibold">Vibra Chat</h2>
              <p className="text-sm text-gray-300">Your wellness companion</p>
            </div>
          </div>
          <button
            onClick={refreshChat}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded-full text-sm"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Quick replies */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-thin scrollbar-thumb-white/20">
          {quickReplies.map((q) => (
            <button
              key={q}
              onClick={() => sendUserMessage(q)}
              className="whitespace-nowrap bg-white/10 px-3 py-1 rounded-full text-sm hover:bg-white/20"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-black/20 rounded-md scrollbar-thin scrollbar-thumb-white/20">
          {messages.map((m) => (
            <div key={m.id} className={`max-w-[80%] ${m.sender === "you" ? "ml-auto text-right" : ""}`}>
              <div
                className={`inline-block px-4 py-2 rounded-xl ${
                  m.sender === "you" ? "bg-indigo-500 text-white" : "bg-white/10 text-white"
                }`}
              >
                <div className="text-sm whitespace-pre-line">{m.text}</div>
                <div className="text-[10px] opacity-70 mt-1">{m.time}</div>
                {m.meta?.playlist && (
                  <a
                    href={m.meta.playlist}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-xs mt-1 underline text-indigo-200"
                  >
                    🎧 Open playlist
                  </a>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">🤖</div>
              <div className="bg-white/10 px-4 py-2 rounded-xl flex gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-pulse delay-100"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></span>
              </div>
            </div>
          )}
          <div ref={msgsRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendUserMessage(input);
          }}
          className="mt-3 flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-full bg-white/10 text-white placeholder:text-gray-300 focus:outline-none"
          />
          <button type="submit" className="bg-indigo-500 px-4 py-2 rounded-full hover:bg-indigo-600">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
