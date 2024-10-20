let quotes = [
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Success" }
];

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Fetch quotes from the server (GET request using async/await)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    
    // Simulate server providing quotes (text is the title, category is "Server")
    const serverQuotes = data.map(post => ({
      text: post.title,
      category: "Server"
    }));

    // Check for conflicts and resolve them
    resolveConflicts(serverQuotes);

    // Update local storage with server quotes
    serverQuotes.forEach(serverQuote => {
      if (!quotes.some(quote => quote.text === serverQuote.text)) {
        quotes.push(serverQuote);
      }
    });

    saveQuotes();
    populateCategories();
    filterQuotes();
  } catch (error) {
    console.error("Error fetching quotes from the server:", error);
  }
}

// Post new quotes to the server (POST request)
async function postQuoteToServer(quote) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    });
    
    const data = await response.json();
    console.log('Quote successfully posted to server:', data);
  } catch (error) {
    console.error('Error posting quote to the server:', error);
  }
}

// Sync local data with the server and resolve conflicts
async function syncQuotes() {
  await fetchQuotesFromServer(); // Fetch latest quotes from server
  // Additional logic for syncing can be implemented here if needed
}

// Add a new quote locally and sync with server
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    
    // Add the new quote to local storage
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();

    // Post the new quote to the server
    postQuoteToServer(newQuote);
    
    // Clear input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert('Please enter both quote text and category.');
  }
}

// Sync local data with the server every 30 seconds
function syncWithServer() {
  setInterval(syncQuotes, 30000); // Sync every 30 seconds
}

// Load quotes, populate categories, and set up syncing with server
window.onload = function() {
  loadQuotes();
  populateCategories();
  filterQuotes();
  syncWithServer(); // Start syncing with the server
};

// Conflict resolution strategy: server data takes precedence
function resolveConflicts(serverData) {
  const conflicts = serverData.filter(serverQuote => quotes.some(localQuote => localQuote.text === serverQuote.text && localQuote.category !== serverQuote.category));
  
  if (conflicts.length > 0) {
    alert('Conflict detected! Server data will take precedence.');
    conflicts.forEach(conflict => {
      const localQuoteIndex = quotes.findIndex(quote => quote.text === conflict.text);
      quotes[localQuoteIndex] = conflict;
    });
    saveQuotes();
    populateCategories();
    filterQuotes();
  }
}

// Other existing functions like populateCategories, filterQuotes, etc.
