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

// Fetch quotes from the server periodically (using async/await)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    
    // Simulate server providing quotes (text is the title, category is "Server")
    const serverQuotes = data.map(post => ({
      text: post.title,
      category: "Server"
    }));

    // Add server quotes to local storage, avoiding duplicates
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

// Sync local data with the server every 30 seconds
function syncWithServer() {
  setInterval(fetchQuotesFromServer, 30000); // Fetch every 30 seconds
}

// Conflict resolution strategy: server data takes precedence
function resolveConflicts(serverData) {
  // Check if there are conflicts by comparing server data and local data
  const conflicts = serverData.filter(serverQuote => quotes.some(localQuote => localQuote.text === serverQuote.text && localQuote.category !== serverQuote.category));
  
  if (conflicts.length > 0) {
    alert('Conflict detected! Server data will take precedence.');
    // Replace local data with server data for conflicting quotes
    conflicts.forEach(conflict => {
      const localQuoteIndex = quotes.findIndex(quote => quote.text === conflict.text);
      quotes[localQuoteIndex] = conflict;
    });
    saveQuotes();
    populateCategories();
    filterQuotes();
  }
}

// Load quotes, populate categories, and set up syncing with server
window.onload = function() {
  loadQuotes();
  populateCategories();
  filterQuotes();
  syncWithServer(); // Start syncing with the server
};

// Other existing functions like populateCategories, filterQuotes, addQuote, etc.
