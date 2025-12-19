// Shared logic for Vote It

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'index.html';
    }
    return JSON.parse(user);
}

// Generate unique ID
function generateId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'PL-';
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Mock Data Store (in localStorage)
const Store = {
    getPolls: () => {
        return JSON.parse(localStorage.getItem('polls') || '[]');
    },
    savePoll: (poll) => {
        const polls = Store.getPolls();
        polls.push(poll);
        localStorage.setItem('polls', JSON.stringify(polls));
    },
    getPoll: (id) => {
        const polls = Store.getPolls();
        return polls.find(p => p.id === id);
    },
    vote: (pollId, optionIndex) => {
        const polls = Store.getPolls();
        const pollIndex = polls.findIndex(p => p.id === pollId);
        if (pollIndex > -1) {
            polls[pollIndex].options[optionIndex].votes++;
            polls[pollIndex].totalVotes++;
            localStorage.setItem('polls', JSON.stringify(polls));
            return true;
        }
        return false;
    },
    deletePoll: (id) => {
        const polls = Store.getPolls();
        const newPolls = polls.filter(p => p.id !== id);
        localStorage.setItem('polls', JSON.stringify(newPolls));
    }
};

// Initialize with demo data if empty
if (!localStorage.getItem('polls') || JSON.parse(localStorage.getItem('polls')).length === 0) {
    const demoPolls = [
        {
            id: 'PL-DEMO1',
            title: 'Best Programming Language 2025',
            description: 'Which language do you think will dominate the industry in 2025? Vote for your favorite!',
            type: 'single',
            options: [
                { text: 'JavaScript/TypeScript', votes: 150 },
                { text: 'Python', votes: 120 },
                { text: 'Rust', votes: 85 },
                { text: 'Go', votes: 60 }
            ],
            totalVotes: 415,
            expiry: new Date(Date.now() + 86400000 * 7).toISOString(), // +7 days
            createdAt: new Date().toISOString()
        },
        {
            id: 'PL-DEMO2',
            title: 'Team Lunch Venue',
            description: 'Where should we go for the team lunch this Friday? You can pick multiple options.',
            type: 'multiple',
            options: [
                { text: 'Pizza Palace', votes: 12 },
                { text: 'Sushi Spot', votes: 15 },
                { text: 'Burger Joint', votes: 8 },
                { text: 'Salad Bar', votes: 5 }
            ],
            totalVotes: 40,
            expiry: new Date(Date.now() + 86400000 * 2).toISOString(), // +2 days
            createdAt: new Date().toISOString()
        },
        {
            id: 'PL-DEMO3',
            title: 'Product Design Feedback',
            description: 'How would you rate the new dashboard design? 5 stars being the best.',
            type: 'rating',
            options: [
                { text: '1 Star', votes: 2 },
                { text: '2 Stars', votes: 5 },
                { text: '3 Stars', votes: 10 },
                { text: '4 Stars', votes: 25 },
                { text: '5 Stars', votes: 40 }
            ],
            totalVotes: 82,
            expiry: new Date(Date.now() - 86400000).toISOString(), // Ended 1 day ago
            createdAt: new Date().toISOString()
        }
    ];
    localStorage.setItem('polls', JSON.stringify(demoPolls));
}

// Theme Handling
function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon();
}

function updateThemeIcon() {
    const btn = document.getElementById('themeBtn');
    if (btn) {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        btn.innerHTML = isLight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    }
}

// Initialize Theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
window.addEventListener('DOMContentLoaded', updateThemeIcon);

// Global Join Poll
function joinPollGlobal() {
    const input = document.getElementById('pollIdInput');
    if (input && input.value) {
        window.location.href = `poll.html?id=${input.value}`;
    }
}
