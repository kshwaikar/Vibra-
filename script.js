// ============================================
// GLOBAL STATE
// ============================================
let currentUser = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    age: '24',
    location: 'San Francisco, CA',
    bio: '✨ Wellness enthusiast | 🧘‍♀️ Meditation lover | 📚 Avid reader | Living my best life one mood at a time 🌈',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&size=150&background=A3D9B1&color=fff&bold=true'
};
let currentMood = null;
let currentPlaylistUrl = "https://open.spotify.com/playlist/37i9dQZF1DX0FOF1IUWK1W"; // Default to calm

// --- HABIT STATE ---
const defaultHabits = [
    { text: 'Drink 8 glasses of water', icon: '💧' },
    { text: 'Read for 30 minutes', icon: '📚' },
    { text: 'Meditate for 10 minutes', icon: '🧘' },
    { text: 'Exercise for 20 minutes', icon: '🏃' }
];
let userHabits = [];
let todaysCompletions = {};
// --- END HABIT STATE ---

// --- CONNECT CHAT STATE ---
let isConnected = false;
let currentPartner = "";
let connectMessages = [];
const randomNames = [ "Arya", "Ravi", "Nia", "Mira", "Kian", "Tara", "Leo", "Isha", "Aarav", "Sana" ];
const partnerReplies = [ "That’s interesting! Tell me more 😊", "I totally get that 💬", "Haha that’s funny 😂", "I’ve felt that way too sometimes 🌸", "Music always helps me relax 🎵", "Same here! What kind of songs do you like?", "Aww that’s sweet 💖", "That sounds amazing! 🌟", "Yeah, taking a walk really clears my mind 🚶‍♀️", "Self-care is so important 💜", "Sometimes just breathing helps 🫁", "You sound like a really positive person 😄", "I love that mindset 💪", "I’m having fun chatting with you 🫶", "Do you like coffee or tea more? ☕", "That’s a great hobby! I should try that too 👀", "Ooo that sounds cozy 🌙", "I think balance is key, right? ⚖️", "Let’s both stay positive 🌈", "You’ve got a great vibe ✨" ];
// --- END CONNECT CHAT STATE ---

// ============================================
// INITIALIZATION
// ============================================
function init() {
    loadUserData();
    if (localStorage.getItem('isLoggedIn') === 'true') {
        handleLogin();
    }
}

// ============================================
// LOGIN FUNCTIONALITY
// ============================================
function handleLogin() {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) currentUser = JSON.parse(savedUser);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify(currentUser));
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    // START: REMOVED OLD TOGGLE BUTTON SHOW
    // document.getElementById('chatbotToggle').classList.remove('hidden');
    // END: REMOVED OLD TOGGLE BUTTON SHOW
    updateProfileDisplay();
    loadCompletionData();
    loadHabitsFromStorage();
    renderHabitList();
    applySavedMood();
    playSound('login');
}

// ============================================
// NAVIGATION
// ============================================
function showScreen(screenName) {
    // Hide all screens
    const screens = ['dashboard', 'profile', 'moodCheck', 'music', 'connect', 'chatbot']; // Added chatbot
    screens.forEach(screen => {
        const element = document.getElementById(screen + 'Screen');
        if (element) element.classList.add('hidden');
    });

    // Show selected screen
    const selectedScreen = document.getElementById(screenName + 'Screen');
    if (selectedScreen) selectedScreen.classList.remove('hidden');

    // Update nav active state
    document.querySelectorAll('.nav-menu li').forEach(li => li.classList.remove('active'));
    const activeNavItem = document.querySelector(`.nav-menu li[onclick="showScreen('${screenName}')"]`);
    if (activeNavItem) activeNavItem.classList.add('active');

    // Optional: Focus input field when switching to chatbot screen
    if (screenName === 'chatbot') {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
           setTimeout(() => chatInput.focus(), 100); // Small delay for animation/rendering
        }
    }
}

// ============================================
// PROFILE EDIT FUNCTIONALITY
// ============================================
function openEditProfile() {
    const modal = document.getElementById('editProfileModal');
    modal.classList.remove('hidden');
    document.getElementById('editName').value = currentUser.name;
    document.getElementById('editAge').value = currentUser.age;
    document.getElementById('editLocation').value = currentUser.location;
    document.getElementById('editBio').value = currentUser.bio;
    playSound('click');
 }
function closeEditProfile() {
    document.getElementById('editProfileModal').classList.add('hidden');
 }
function saveProfile() {
    const newName = document.getElementById('editName').value.trim();
    const newAge = document.getElementById('editAge').value.trim();
    const newLocation = document.getElementById('editLocation').value.trim();
    const newBio = document.getElementById('editBio').value.trim();
    if (!newName) return alert('Name is required!');
    currentUser.name = newName;
    currentUser.age = newAge;
    currentUser.location = newLocation;
    currentUser.bio = newBio;
    if (currentUser.avatar && currentUser.avatar.includes('ui-avatars.com')) {
         currentUser.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&size=150&background=A3D9B1&color=fff&bold=true`;
    }
    localStorage.setItem('userData', JSON.stringify(currentUser));
    updateProfileDisplay();
    closeEditProfile();
    alert('✨ Profile updated successfully!');
    playSound('success');
 }
function updateProfileDisplay() {
    const photoElement = document.getElementById('profilePhoto');
    if (photoElement) photoElement.src = currentUser.avatar || `https://ui-avatars.com/api/?name=?&size=150&background=E0E0E0&color=fff`;
    const nameElement = document.getElementById('userName');
    if (nameElement) nameElement.textContent = currentUser.name;
    const detailsElement = document.getElementById('userDetails');
    if (detailsElement) detailsElement.textContent = `🎂 Age: ${currentUser.age} | 📍 ${currentUser.location}`;
    const bioElement = document.getElementById('userBio');
    if (bioElement) bioElement.textContent = currentUser.bio;
    const greetingElement = document.querySelector('#dashboardScreen h2');
    if (greetingElement) greetingElement.textContent = `Welcome back, ${currentUser.name.split(' ')[0]}! 👋`;
 }
function triggerPhotoUpload() {
    document.getElementById('photoUploadInput').click();
 }
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentUser.avatar = e.target.result;
            localStorage.setItem('userData', JSON.stringify(currentUser));
            updateProfileDisplay();
            playSound('success');
        }
        reader.readAsDataURL(file);
    } else {
        alert('Please select a valid image file (jpg, png, gif, etc.).');
    }
 }
function changeProfilePhoto() {
    triggerPhotoUpload();
 }
function removeProfilePhoto() {
    if (!confirm('Are you sure you want to remove your profile photo?')) return;
    currentUser.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&size=150&background=E0E0E0&color=fff`;
    localStorage.setItem('userData', JSON.stringify(currentUser));
    updateProfileDisplay();
    playSound('click');
 }

// ============================================
// MOOD SELECTION & THEME CHANGE
// ============================================
function selectMood(button) {
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    const mood = button.dataset.mood;
    const color = button.dataset.color;
    currentMood = mood;
    localStorage.setItem('lastMood', mood);
    changeTheme(color);
    updateMusicSuggestion(mood);
    playSound('mood');
 }
function changeTheme(primaryColor) {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primaryColor);
    document.body.style.transition = 'background 0.8s ease';
    const colors = {'#4A90E2': ['#4A90E2', '#7EB6E8'], '#F5D76E': ['#F5D76E', '#F9E79F'], '#A3D9B1': ['#A3D9B1', '#C8E6C9'], '#F2994A': ['#F2994A', '#F5A962'], '#F28BBD': ['#F28BBD', '#F5A9D0']};
    const gradient = colors[primaryColor] || [primaryColor, '#FFFFFF'];
    document.body.style.background = `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`;
 }
function applySavedMood() {
    if (currentMood) {
        const savedMoodButton = document.querySelector(`.mood-btn[data-mood="${currentMood}"]`);
        if (savedMoodButton) {
            savedMoodButton.classList.add('selected');
            changeTheme(savedMoodButton.dataset.color);
            updateMusicSuggestion(currentMood);
        }
    }
 }

// ============================================
// HABIT TRACKING
// ============================================
function loadCompletionData() {
    const today = new Date().toISOString().split('T')[0];
    const savedData = JSON.parse(localStorage.getItem('completedHabitsToday'));
    todaysCompletions = (savedData && savedData.date === today) ? savedData.habits : {};
    if (!savedData || savedData.date !== today) localStorage.removeItem('completedHabitsToday');
 }
function saveCompletionData() {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('completedHabitsToday', JSON.stringify({ date: today, habits: todaysCompletions }));
 }
function loadHabitsFromStorage() {
    const savedHabits = localStorage.getItem('userHabitsList');
    userHabits = savedHabits ? JSON.parse(savedHabits) : [...defaultHabits];
 }
function saveHabitsToStorage() {
    localStorage.setItem('userHabitsList', JSON.stringify(userHabits));
 }
function renderHabitList() {
    const container = document.getElementById('habitListContainer');
    if (!container) return;
    container.innerHTML = '';
    if (!userHabits || userHabits.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light);">No habits added yet. Add one above!</p>';
    } else {
        userHabits.forEach(habit => {
            const isCompleted = todaysCompletions[habit.text] === true;
            const completedClass = isCompleted ? 'completed' : '';
            const habitHTML = `
                <div class="habit-item ${completedClass}" onclick="toggleHabit(this)">
                    <div class="habit-checkbox"><i class="fas fa-check"></i></div>
                    <span class="habit-icon">${habit.icon || '🎯'}</span>
                    <span class="habit-label">${habit.text}</span>
                    <button class="delete-habit-btn" onclick="deleteHabit(event, '${habit.text}')"><i class="fas fa-trash-alt"></i></button>
                </div>`;
            container.innerHTML += habitHTML;
        });
    }
    updateHabitProgress();
 }
function addHabit() {
    const input = document.getElementById('newHabitInput');
    if (!input) return;
    const habitText = input.value.trim();
    if (habitText === "") return alert('Please enter a habit!');
    if (userHabits.some(h => h.text.toLowerCase() === habitText.toLowerCase())) return alert('That habit already exists!');
    const icons = ['🎯', '🧠', '💪', '🚶', '🌱', '☀️', '🌙', '✍️'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    userHabits.push({ text: habitText, icon: randomIcon });
    saveHabitsToStorage();
    renderHabitList();
    input.value = '';
    playSound('success');
 }
function deleteHabit(event, habitText) {
    event.stopPropagation();
    if (!confirm(`Are you sure you want to delete this habit:\n"${habitText}"?`)) return;
    userHabits = userHabits.filter(h => h.text !== habitText);
    delete todaysCompletions[habitText];
    saveCompletionData();
    saveHabitsToStorage();
    renderHabitList();
    playSound('click');
 }
function toggleHabit(habitItem) {
    const labelElement = habitItem.querySelector('.habit-label');
    if (!labelElement) return;
    const habitText = labelElement.textContent;
    habitItem.classList.toggle('completed');
    todaysCompletions[habitText] = habitItem.classList.contains('completed');
    saveCompletionData();
    updateHabitProgress();
    playSound('check');
 }
function updateHabitProgress() {
    const totalHabits = userHabits.length;
    const completedCount = Object.values(todaysCompletions).filter(val => val === true).length;
    const percentage = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
    const circle = document.getElementById('habitProgress');
    const percentageText = document.getElementById('habitPercentage');
    if (circle && percentageText) {
        const circumference = 2 * Math.PI * 65;
        const offset = circumference - (percentage / 100) * circumference || circumference;
        circle.style.strokeDashoffset = offset;
        percentageText.textContent = percentage + '%';
    }
 }
function saveMoodAndHabits() {
    if (!currentMood) return alert('Please select your mood first! 💭');
    const today = new Date().toISOString().split('T')[0];
    const completedHabitsArray = Object.keys(todaysCompletions).filter(key => todaysCompletions[key] === true);
    const checkIn = { date: today, mood: currentMood, habits: completedHabitsArray };
    let checkIns = JSON.parse(localStorage.getItem('checkIns') || '[]');
    checkIns = checkIns.filter(ci => ci.date !== today);
    checkIns.push(checkIn);
    localStorage.setItem('checkIns', JSON.stringify(checkIns));
    alert('✨ Check-in saved! Keep up the great work! 🎉');
    playSound('success');
 }

// ============================================
// MUSIC SUGGESTIONS
// ============================================
const musicSuggestions = {
    sad: { title: 'Comfort & Healing', artist: 'Relaxing Piano Music', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&h=300&fit=crop', playlist: 'https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634' },
    happy: { title: 'Feel Good Vibes', artist: 'Happy Pop Hits', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop', playlist: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC' },
    calm: { title: 'Peaceful Piano', artist: 'Ambient & Chill', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=300&fit=crop', playlist: 'https://open.spotify.com/playlist/37i9dQZF1DX0FOF1IUWK1W' },
    energetic: { title: 'Power Workout', artist: 'High Energy Mix', image: 'https://images.unsplash.com/photo-1571609370705-6caa50d1c1b4?w=500&h=300&fit=crop', playlist: 'https://open.spotify.com/playlist/37i9dQZF1DX70RN3TfWWJh' },
    romantic: { title: 'Love Songs', artist: 'Romantic Ballads', image: 'https://images.unsplash.com/photo-1518972734183-c5e7b08e4d62?w=500&h=300&fit=crop', playlist: 'https://open.spotify.com/playlist/37i9dQZF1DWXb9I5xoXLjp' }
};
function updateMusicSuggestion(mood) {
    const suggestion = musicSuggestions[mood] || musicSuggestions.calm;
    document.getElementById('songTitle').textContent = suggestion.title;
    document.getElementById('songArtist').textContent = suggestion.artist + ' • Perfect for your ' + mood + ' mood';
    document.getElementById('albumArt').src = suggestion.image;
    currentPlaylistUrl = suggestion.playlist;
 }
function refreshMusic() {
    const moods = ['sad', 'happy', 'calm', 'energetic', 'romantic'];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    updateMusicSuggestion(randomMood);
    playSound('refresh');
 }
function openSpotify() {
    if (currentPlaylistUrl) { window.open(currentPlaylistUrl, '_blank'); }
    else { alert('Please select a mood from the Mood tab first! 💭'); }
    playSound('click');
 }

// ============================================
// PROFILE FUNCTIONALITY (Share only)
// ============================================
function shareProfile() {
    const url = 'https://vibra.app/profile/' + currentUser.name.replace(/\s+/g, '').toLowerCase();
    navigator.clipboard.writeText(url).then(() => {
        alert('✨ Profile link copied to clipboard!\n' + url); playSound('success');
    }).catch(() => alert('Profile link: ' + url));
 }

// ============================================
// CHATBOT FUNCTIONALITY
// ============================================
// REMOVED old toggleChatbot function

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;
    addMessage(message, 'user');
    input.value = '';
    addTypingIndicator();
    fetch('https://vibra-j5e1.onrender.com/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ prompt: message })
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        removeTypingIndicator();
        if (data && data.reply) {
            addMessage(data.reply, 'bot');
            playSound('message');
        } else {
            addMessage("Sorry, I received an unexpected response. Please try again.", 'bot');
        }
    })
    .catch(error => {
        removeTypingIndicator();
        console.error('Error fetching AI response:', error);
        addMessage("Sorry, I couldn't connect to the AI assistant right now. Please try again later.", 'bot');
    });
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + sender;
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer.querySelector('.typing-indicator')) return;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-indicator';
    typingDiv.innerHTML = `
        <div style="display: flex; gap: 4px; align-items: center; padding: 5px 0;">
            <span style="width: 8px; height: 8px; background-color: #ccc; border-radius: 50%; animation: pulse-dot 1.2s infinite ease-in-out;"></span>
            <span style="width: 8px; height: 8px; background-color: #ccc; border-radius: 50%; animation: pulse-dot 1.2s infinite ease-in-out; animation-delay: 0.2s;"></span>
            <span style="width: 8px; height: 8px; background-color: #ccc; border-radius: 50%; animation: pulse-dot 1.2s infinite ease-in-out; animation-delay: 0.4s;"></span>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const indicator = messagesContainer.querySelector('.typing-indicator');
    if (indicator) messagesContainer.removeChild(indicator);
}

// ============================================
// CONNECT SCREEN - NEW LOGIC
// ============================================
function generateSmartReply(message) {
  const msg = message.toLowerCase();
  if (msg.includes("hi") || msg.includes("hello")) return "Hey there 👋 How’s your day going?";
  if (msg.includes("how are you")) return "I’m feeling good, thanks! How about you?";
  if (msg.includes("sad") || msg.includes("down")) return "Aww 😢 Sorry to hear that. Want to talk about it?";
  if (msg.includes("happy")) return "Yay! That makes me smile too 😄 What made you happy today?";
  if (msg.includes("tired")) return "Same 😴 Maybe a short nap or music break could help?";
  if (msg.includes("music")) return "I love music too! 🎧 What’s your favorite song right now?";
  if (msg.includes("movie")) return "I’m a big movie fan too 🍿 Any recent favorites?";
  if (msg.includes("book")) return "Books are amazing 📚 I love stories that calm the mind.";
  if (msg.includes("friend")) return "Friends make life beautiful 🫶 What’s your best memory with yours?";
  if (msg.includes("stress") || msg.includes("anxious")) return "Let’s take a deep breath together 🧘 You’ve got this.";
  if (msg.includes("hobby")) return "Ooo that’s cool! I love hearing about people’s hobbies 🎨";
  if (msg.includes("love")) return "Aww 💖 That’s beautiful — love makes everything brighter.";
  if (msg.includes("bye")) return "It was nice talking to you! Hope to chat again soon 👋";
  if (msg.includes("food")) return "Yum 😋 I could talk about food all day! What’s your favorite?";
  if (msg.includes("weather")) return "The weather totally affects the mood 🌤️ How’s it there?";
  if (msg.includes("work") || msg.includes("study")) return "That can be tiring 😅 Remember to take short breaks!";
  if (msg.includes("lol") || msg.includes("haha")) return "😂 You’ve got a fun sense of humor!";
  if (msg.includes("thank")) return "Aww that’s sweet 💕 Glad we’re chatting!";
  if (msg.includes("bored")) return "Same sometimes 😅 Try doing something creative or chill music?";
  if (msg.includes("relax")) return "Relaxing sounds perfect 🌙 Maybe some lo-fi beats?";
  return partnerReplies[Math.floor(Math.random() * partnerReplies.length)];
 }
function connectNewPerson() {
    currentPartner = randomNames[Math.floor(Math.random() * randomNames.length)];
    isConnected = true;
    connectMessages = [{ sender: "system", text: `✨ You are now connected with ${currentPartner}. Say hi and share good vibes! 💫` }];
    document.getElementById('connectInitialView').classList.add('hidden');
    document.getElementById('connectChatView').classList.remove('hidden');
    document.getElementById('partnerName').textContent = currentPartner;
    renderConnectMessages();
 }
function handleConnectSend(event) {
    event.preventDefault();
    const inputElement = document.getElementById('connectInput');
    const messageText = inputElement.value.trim();
    if (!messageText) return;
    addConnectMessage(messageText, 'you');
    inputElement.value = '';
    setTimeout(() => { const replyText = generateSmartReply(messageText); addConnectMessage(replyText, currentPartner); }, 1200);
 }
function addConnectMessage(text, sender) {
    connectMessages.push({ sender, text });
    renderConnectMessages();
 }
function renderConnectMessages() {
    const messagesContainer = document.getElementById('connectMessages');
    messagesContainer.innerHTML = '';
    connectMessages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = msg.text;
        messageDiv.classList.add('connect-message');
        if (msg.sender === 'you') messageDiv.classList.add('you');
        else if (msg.sender === 'system') messageDiv.classList.add('system');
        else messageDiv.classList.add('partner');
        messagesContainer.appendChild(messageDiv);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
 }
function disconnectAndFindNew() {
    isConnected = false;
    currentPartner = "";
    connectMessages = [];
    document.getElementById('connectChatView').classList.add('hidden');
    document.getElementById('connectInitialView').classList.remove('hidden');
    document.getElementById('connectMessages').innerHTML = '';
 }

// ============================================
// DATA PERSISTENCE
// ============================================
function loadUserData() {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) currentUser = JSON.parse(savedUser);
    const lastMood = localStorage.getItem('lastMood');
    if (lastMood) currentMood = lastMood;
 }

// ============================================
// SOUND EFFECTS (Optional)
// ============================================
function playSound(soundType) { console.log('🔊 Playing sound: ' + soundType); }

// ============================================
// DASHBOARD UPDATES
// ============================================
function updateDashboard() { /* Update dashboard charts based on localStorage data */ setTimeout(updateHabitProgress, 100); }

// ============================================
// INITIALIZE APP ON LOAD
// ============================================
window.addEventListener('DOMContentLoaded', () => {
    init();
    document.querySelectorAll('.card').forEach((card, index) => card.style.animationDelay = (index * 0.1) + 's');
});

// ============================================
// BONUS: Background mood bubbles animation
// ============================================
function createMoodBubbles() {
    const colors = ['#4A90E2', '#F5D76E', '#A3D9B1', '#F2994A', '#F28BBD'];
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const bubble = document.createElement('div');
            Object.assign(bubble.style, {
                position: 'fixed', width: `${Math.random() * 100 + 50}px`,
                height: bubble.style.width, borderRadius: '50%',
                background: colors[Math.floor(Math.random() * colors.length)],
                opacity: '0.1', left: `${Math.random() * 100}%`, top: '100%',
                pointerEvents: 'none', zIndex: '0',
                animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`
            });
            document.body.appendChild(bubble);
        }, i * 1000);
    }
 }
createMoodBubbles(); // Enable floating bubbles
