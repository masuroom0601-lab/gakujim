// Configuration
const API_BASE_URL = 'https://v2.jokeapi.dev/joke';
const DEFAULT_CATEGORY = 'Any';

// DOM Elements
const getJokeBtn = document.getElementById('get-joke-btn');
const copyBtn = document.getElementById('copy-btn');
const shareBtn = document.getElementById('share-btn');
const jokeContent = document.getElementById('joke-content');
const jokeContainer = document.getElementById('joke-container');
const jokeType = document.getElementById('joke-type');
const jokeCategory = document.getElementById('joke-category');
const categoryFilter = document.getElementById('category-filter');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = document.getElementById('error-message');
const errorCloseBtn = document.getElementById('error-close-btn');

// State
let currentJoke = null;
let isLoading = false;

/**
 * Fetch a joke from the API
 * @async
 * @param {string} category - The joke category to fetch
 * @returns {Promise<Object|null>} The joke object or null if error
 */
async function fetchJoke(category = 'Any') {
    try {
        isLoading = true;
        showLoading(true);
        hideError();
        disableButtons(true);

        // Build API URL
        const url = `${API_BASE_URL}/${category}?type=single,twopart&format=json`;

        console.log(`Fetching joke from: ${url}`);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Check if joke API returned an error
        if (data.error) {
            throw new Error(data.message || 'Failed to fetch joke from API');
        }

        currentJoke = data;
        displayJoke(data);
        disableButtons(false);

    } catch (err) {
        console.error('Error fetching joke:', err);
        showError(`Failed to fetch joke: ${err.message}. Please try again.`);
        disableButtons(false);
    } finally {
        isLoading = false;
        showLoading(false);
    }
}

/**
 * Display the joke on the page
 * @param {Object} joke - The joke object from the API
 */
function displayJoke(joke) {
    jokeContainer.innerHTML = '';

    if (joke.type === 'single') {
        // Single joke
        const jokeText = document.createElement('p');
        jokeText.className = 'joke-text';
        jokeText.textContent = joke.joke;
        jokeContainer.appendChild(jokeText);
    } else if (joke.type === 'twopart') {
        // Two-part joke (setup + punchline)
        const setupDiv = document.createElement('div');
        setupDiv.className = 'joke-text setup-punchline';

        const setup = document.createElement('p');
        setup.textContent = `${joke.setup}`;
        setupDiv.appendChild(setup);

        const punchline = document.createElement('p');
        punchline.className = 'punchline';
        punchline.textContent = `${joke.delivery}`;
        setupDiv.appendChild(punchline);

        jokeContainer.appendChild(setupDiv);
    }

    // Update meta information
    jokeType.textContent = `Type: ${joke.type.charAt(0).toUpperCase() + joke.type.slice(1)}`;
    jokeCategory.textContent = `Category: ${joke.category}`;
}

/**
 * Show loading state
 * @param {boolean} show - Whether to show loading state
 */
function showLoading(show) {
    if (show) {
        loading.classList.add('active');
    } else {
        loading.classList.remove('active');
    }
}

/**
 * Show error message
 * @param {string} message - The error message to display
 */
function showError(message) {
    errorMessage.textContent = message;
    error.classList.add('active');
    jokeContent.innerHTML = '<p class="placeholder">Failed to load joke. Please try again.</p>';
}

/**
 * Hide error message
 */
function hideError() {
    error.classList.remove('active');
    errorMessage.textContent = '';
}

/**
 * Disable or enable buttons
 * @param {boolean} disabled - Whether to disable buttons
 */
function disableButtons(disabled) {
    getJokeBtn.disabled = disabled;
    if (disabled) {
        copyBtn.disabled = true;
        shareBtn.disabled = true;
    } else if (currentJoke) {
        copyBtn.disabled = false;
        shareBtn.disabled = false;
    }
}

/**
 * Copy joke to clipboard
 */
async function copyJoke() {
    if (!currentJoke) return;

    let jokeText = '';
    if (currentJoke.type === 'single') {
        jokeText = currentJoke.joke;
    } else if (currentJoke.type === 'twopart') {
        jokeText = `${currentJoke.setup}\n${currentJoke.delivery}`;
    }

    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(jokeText);
            alert('Joke copied to clipboard! 📋');
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = jokeText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Joke copied to clipboard! 📋');
        }
    } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please try again.');
    }
}

/**
 * Share joke (if Web Share API is available)
 */
async function shareJoke() {
    if (!currentJoke) return;

    let jokeText = '';
    if (currentJoke.type === 'single') {
        jokeText = currentJoke.joke;
    } else if (currentJoke.type === 'twopart') {
        jokeText = `${currentJoke.setup}\n${currentJoke.delivery}`;
    }

    if (navigator.share) {
        try {
            await navigator.share({
                title: '😂 Check out this joke!',
                text: jokeText,
                url: window.location.href
            });
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Failed to share:', err);
            }
        }
    } else {
        // Fallback: Copy to clipboard
        copyJoke();
    }
}

/**
 * Initialize event listeners
 */
function initializeEventListeners() {
    getJokeBtn.addEventListener('click', () => {
        const selectedCategory = categoryFilter.value;
        fetchJoke(selectedCategory);
    });

    copyBtn.addEventListener('click', copyJoke);
    shareBtn.addEventListener('click', shareJoke);
    errorCloseBtn.addEventListener('click', hideError);

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !isLoading) {
            getJokeBtn.click();
        }
    });

    // Fetch a joke on page load
    window.addEventListener('load', () => {
        fetchJoke(DEFAULT_CATEGORY);
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEventListeners);
} else {
    initializeEventListeners();
}
