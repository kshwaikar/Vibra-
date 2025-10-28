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
// START: MODIFIED showScreen FUNCTION
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
// END: MODIFIED showScreen FUNCTION

// ============================================
// PROFILE EDIT FUNCTIONALITY
// ============================================
function openEditProfile() { /* ... function code ... */ }
function closeEditProfile() { /* ... function code ... */ }
function saveProfile() { /* ... function code ... */ }
function updateProfileDisplay() { /* ... function code ... */ }
function triggerPhotoUpload() { /* ... function code ... */ }
function handlePhotoUpload(event) { /* ... function code ... */ }
function changeProfilePhoto() { /* ... function code ... */ }
function removeProfilePhoto() { /* ... function code ... */ }

// ============================================
// MOOD SELECTION & THEME CHANGE
// ============================================
function selectMood(button) { /* ... function code ... */ }
function changeTheme(primaryColor) { /* ... function code ... */ }
function applySavedMood() { /* ... function code ... */ }

// ============================================
// HABIT TRACKING
// ============================================
function loadCompletionData() { /* ... function code ... */ }
function saveCompletionData() { /* ... function code ... */ }
function loadHabitsFromStorage() { /* ... function code ... */ }
function saveHabitsToStorage() { /* ... function code ... */ }
function renderHabitList() { /* ... function code ... */ }
function addHabit() { /* ... function code ... */ }
function deleteHabit(event, habitText) { /* ... function code ... */ }
function toggleHabit(habitItem) { /* ... function code ... */ }
function updateHabitProgress() { /* ... function code ... */ }
function saveMoodAndHabits() { /* ... function code ... */ }

// ============================================
// MUSIC SUGGESTIONS
// ============================================
const musicSuggestions = { /* ... music data ... */ };
function updateMusicSuggestion(mood) { /* ... function code ... */ }
function refreshMusic() { /* ... function code ... */ }
function openSpotify() { /* ... function code ... */ }

// ============================================
// PROFILE FUNCTIONALITY (Share only)
// ============================================
function shareProfile() { /* ... function code ... */ }

// ============================================
// CHATBOT FUNCTIONALITY
// ============================================

// START: REMOVED toggleChatbot FUNCTION
/*
function toggleChatbot() {
    // This function is no longer needed
}
*/
// END: REMOVED toggleChatbot FUNCTION

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;
    addMessage(message, 'user');
    input.value = ''; 
    addTypingIndicator(); 
    fetch('http://127.0.0.1:8000/generate', {
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
function generateSmartReply(message) { /* ... function code ... */ }
function connectNewPerson() { /* ... function code ... */ }
function handleConnectSend(event) { /* ... function code ... */ }
function addConnectMessage(text, sender) { /* ... function code ... */ }
function renderConnectMessages() { /* ... function code ... */ }
function disconnectAndFindNew() { /* ... function code ... */ }

// ============================================
// DATA PERSISTENCE
// ============================================
function loadUserData() { /* ... function code ... */ }

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
function createMoodBubbles() { /* ... function code ... */ }
createMoodBubbles(); // Enable floating bubbles
