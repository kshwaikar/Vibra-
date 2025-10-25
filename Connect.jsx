import React, { useState, useEffect, useRef } from "react";

const randomNames = [
  "Arya", "Ravi", "Nia", "Mira", "Kian", "Tara", "Leo", "Isha", "Aarav", "Sana"
];

const partnerReplies = [
  "That’s interesting! Tell me more 😊",
  "I totally get that 💬",
  "Haha that’s funny 😂",
  "I’ve felt that way too sometimes 🌸",
  "Music always helps me relax 🎵",
  "Same here! What kind of songs do you like?",
  "Aww that’s sweet 💖",
  "That sounds amazing! 🌟",
  "Yeah, taking a walk really clears my mind 🚶‍♀️",
  "Self-care is so important 💜",
  "Sometimes just breathing helps 🫁",
  "You sound like a really positive person 😄",
  "I love that mindset 💪",
  "I’m having fun chatting with you 🫶",
  "Do you like coffee or tea more? ☕",
  "That’s a great hobby! I should try that too 👀",
  "Ooo that sounds cozy 🌙",
  "I think balance is key, right? ⚖️",
  "Let’s both stay positive 🌈",
  "You’ve got a great vibe ✨"
];

// 🧠 Context-aware replies
function generateSmartReply(message) {
  const msg = message.toLowerCase();

  if (msg.includes("hi") || msg.includes("hello"))
    return "Hey there 👋 How’s your day going?";
  if (msg.includes("how are you"))
    return "I’m feeling good, thanks! How about you?";
  if (msg.includes("sad") || msg.includes("down"))
    return "Aww 😢 Sorry to hear that. Want to talk about it?";
  if (msg.includes("happy"))
    return "Yay! That makes me smile too 😄 What made you happy today?";
  if (msg.includes("tired"))
    return "Same 😴 Maybe a short nap or music break could help?";
  if (msg.includes("music"))
    return "I love music too! 🎧 What’s your favorite song right now?";
  if (msg.includes("movie"))
    return "I’m a big movie fan too 🍿 Any recent favorites?";
  if (msg.includes("book"))
    return "Books are amazing 📚 I love stories that calm the mind.";
  if (msg.includes("friend"))
    return "Friends make life beautiful 🫶 What’s your best memory with yours?";
  if (msg.includes("stress") || msg.includes("anxious"))
    return "Let’s take a deep breath together 🧘 You’ve got this.";
  if (msg.includes("hobby"))
    return "Ooo that’s cool! I love hearing about people’s hobbies 🎨";
  if (msg.includes("love"))
    return "Aww 💖 That’s beautiful — love makes everything brighter.";
  if (msg.includes("bye"))
    return "It was nice talking to you! Hope to chat again soon 👋";
  if (msg.includes("food"))
    return "Yum 😋 I could talk about food all day! What’s your favorite?";
  if (msg.includes("weather"))
    return "The weather totally affects the mood 🌤️ How’s it there?";
  if (msg.includes("work") || msg.includes("study"))
    return "That can be tiring 😅 Remember to take short breaks!";
  if (msg.includes("lol") || msg.includes("haha"))
    return "😂 You’ve got a fun sense of humor!";
  if (msg.includes("thank"))
    return "Aww that’s sweet 💕 Glad we’re chatting!";
  if (msg.includes("bored"))
    return "Same sometimes 😅 Try doing something creative or chill music?";
  if (msg.includes("relax"))
    return "Relaxing sounds perfect 🌙 Maybe some lo-fi beats?";
  return partnerReplies[Math.floor(Math.random() * partnerReplies.length)];
}

export default function Connect() {
  const [connected, setConnected] = useState(false);
  const [partner, setPartner] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Connect to random person
  const connectNewPerson = () => {
    const randomPartner =
      randomNames[Math.floor(Math.random() * randomNames.length)];
    setPartner(randomPartner);
    setConnected(true);
    setMessages([
      {
        sender: "system",
        text: `✨ You are now connected with ${randomPartner}. Say hi and share good vibes! 💫`,
      },
    ]);
  };

  // Send message
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { sender: "you", text: input.trim() },
    ];

    setMessages(newMessages);
    setInput("");

    // Simulated human-like reply
    setTimeout(() => {
      const replyText = generateSmartReply(input);
      setMessages((prev) => [
        ...prev,
        { sender: partner, text: replyText },
      ]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 text-white flex flex-col items-center justify-center font-sans p-4">
      <h1 className="text-4xl font-bold mb-6">💬 Vibra Connect</h1>

      {!connected ? (
        <div className="text-center space-y-4">
          <p className="text-lg opacity-90">
            Connect with a random person and share mindful, positive chats 💫
          </p>
          <button
            onClick={connectNewPerson}
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-full font-semibold transition-all"
          >
            Connect Now
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white/10 rounded-2xl p-4 backdrop-blur-md shadow-lg flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">
              Chatting with <span className="text-amber-400">{partner}</span>
            </h2>
            <button
              onClick={() => setConnected(false)}
              className="text-sm px-3 py-1 bg-red-500 rounded-full hover:bg-red-600"
            >
              🔄 New Person
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-3 p-2 h-80 bg-black/20 rounded-lg scrollbar-thin scrollbar-thumb-white/20">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[75%] ${
                  msg.sender === "you"
                    ? "bg-indigo-500 self-end ml-auto text-right"
                    : msg.sender === "system"
                    ? "text-center text-sm opacity-80 italic"
                    : "bg-gray-600"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSend}
            className="flex items-center space-x-2 mt-auto"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 rounded-lg bg-white/20 text-white focus:outline-none placeholder:text-gray-300"
            />
            <button
              type="submit"
              className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
