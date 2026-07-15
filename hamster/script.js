// ==============================================================================
// State Variables
// ==============================================================================
let currentIndex = 1;
const totalCards = 5;

// ==============================================================================
// DOM Element Selectors
// ==============================================================================
const cards = document.querySelectorAll('.flip-card');
const hearts = document.querySelectorAll('.progress-indicator .heart');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const sparklesBg = document.getElementById('sparkles-bg');
const letterModal = document.getElementById('letter-modal');

// ==============================================================================
// Card Deck Navigation Logic
// ==============================================================================
function updateDeck() {
    // Update card classes
    cards.forEach(card => {
        const index = parseInt(card.getAttribute('data-index'));
        if (index === currentIndex) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
            card.classList.remove('flipped'); // Reset flip state when moving away
        }
    });

    // Update heart progress indicator
    hearts.forEach((heart, idx) => {
        if (idx < currentIndex) {
            heart.classList.add('active');
        } else {
            heart.classList.remove('active');
        }
    });

    // Manage buttons disabled states
    prevBtn.disabled = (currentIndex === 1);
    nextBtn.disabled = (currentIndex === totalCards);
}

// Event Listeners for Nav Buttons
prevBtn.addEventListener('click', () => {
    if (currentIndex > 1) {
        currentIndex--;
        updateDeck();
        spawnSparklesCluster(window.innerWidth / 2, window.innerHeight / 2, 8);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < totalCards) {
        currentIndex++;
        updateDeck();
        spawnSparklesCluster(window.innerWidth / 2, window.innerHeight / 2, 8);
    }
});

// ==============================================================================
// Card Flip Interaction
// ==============================================================================
cards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Prevent flipping if they clicked the "Open Letter" button inside the card
        if (e.target.classList.contains('open-letter-btn')) {
            return;
        }
        card.classList.toggle('flipped');
        spawnSparklesCluster(e.clientX, e.clientY, 6);
    });
});

// ==============================================================================
// Sorry Letter Modal Control
// ==============================================================================
function openLetter() {
    letterModal.classList.add('open');
    spawnSparklesCluster(window.innerWidth / 2, window.innerHeight / 2, 20);
}

function closeLetter() {
    letterModal.classList.remove('open');
}

// ==============================================================================
// Y2K Interactive Sparkle Particles
// ==============================================================================
const sparkleIcons = ['⭐', '✨', '🌸', '💖', '🌼', '🩹'];

function spawnSparkle(x, y) {
    const particle = document.createElement('span');
    particle.className = 'sparkle-particle';
    
    // Choose a random icon
    particle.innerText = sparkleIcons[Math.floor(Math.random() * sparkleIcons.length)];
    
    // Randomize starting location slightly
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;
    particle.style.left = `${x + offsetX}px`;
    particle.style.top = `${y + offsetY}px`;
    
    // Randomize trajectory direction
    const travelX = (Math.random() - 0.5) * 100;
    particle.style.setProperty('--travel-x', `${travelX}px`);

    sparklesBg.appendChild(particle);

    // Remove element after animation finishes
    setTimeout(() => {
        particle.remove();
    }, 1500);
}

function spawnSparklesCluster(x, y, count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => spawnSparkle(x, y), i * 30);
    }
}

// Spawn sparkles on click
window.addEventListener('click', (e) => {
    // Only spawn if they didn't click a button (which handles its own bursts)
    if (!e.target.closest('button')) {
        spawnSparkle(e.clientX, e.clientY);
    }
});

// Initialize deck state on load
updateDeck();

// ==============================================================================
// Audio Player Controls
// ==============================================================================
const bgMusic = document.getElementById('bg-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const musicStatus = document.getElementById('music-status');

// Set volume slightly lower for pleasant background level
bgMusic.volume = 0.35;

// Function to start music playback
function startMusic() {
    bgMusic.play().then(() => {
        playPauseBtn.innerText = '⏸';
        musicStatus.innerText = '♪ Playing: Lo-Fi 24/7 Live Radio ♪';
    }).catch(err => {
        console.error("Playback blocked:", err);
        musicStatus.innerText = '♪ Audio blocked - Click Play! ♪';
    });
}

// 1. Play/Pause toggle button listener
playPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent document click listener from double-triggering
    if (bgMusic.paused) {
        startMusic();
    } else {
        bgMusic.pause();
        playPauseBtn.innerText = '▶';
        musicStatus.innerText = '♪ Lo-Fi Radio (Paused) ♪';
    }
});

// 2. Autoplay unlock: Start music automatically on the very first click anywhere on the page
window.addEventListener('click', () => {
    if (bgMusic.paused) {
        startMusic();
    }
}, { once: true }); // triggers only once


