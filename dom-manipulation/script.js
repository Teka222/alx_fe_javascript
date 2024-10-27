// Initialize quotes array
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

// Show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerText = quotes[randomIndex].text;
}

// Add new quote and update storage
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();
    postQuoteToServer(newQuote); // Sync with server

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert('Please enter both quote text and category.');
  }
}

// Populate category dropdown for filtering
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  const categories = Array.from(new Set(quotes.map(q => q.category)));

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const quoteDisplay = document.getElementById('quoteDisplay');

  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);

  quoteDisplay.innerText = filteredQuotes.length ? filteredQuotes[randomIndex].text : 'No quotes available for this category.';
  localStorage.setItem('selectedCategory', selectedCategory);
}

// Fetch quotes from the server and resolve conflicts
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    const serverQuotes = data.map(post => ({ text: post.title, category: "Server" }));

    resolveConflicts(serverQuotes);

    serverQuotes.forEach(serverQuote => {
      if (!quotes.some(q => q.text === serverQuote.text)) {
        quotes.push(serverQuote);
      }
    });

    saveQuotes();
    populateCategories();
    filterQuotes();
    alert('Quotes synced with server!');
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}

// Post a new quote to the server
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
    console.error('Error posting quote to server:', error);
  }
}

// Sync quotes every 30 seconds
function syncWithServer() {
  setInterval(fetchQuotesFromServer, 30000);
}

// Handle conflicts with server data
function resolveConflicts(serverData) {
  const conflicts = serverData.filter(serverQuote => quotes.some(localQuote => localQuote.text === serverQuote.text && localQuote.category !== serverQuote.category));
  
  if (conflicts.length > 0) {
    alert('Conflict detected! Server data will take precedence.');
    conflicts.forEach(conflict => {
      const index = quotes.findIndex(q => q.text === conflict.text);
      quotes[index] = conflict;
    });
    saveQuotes();
  }
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'quotes.json';
  downloadLink.click();
  
  URL.revokeObjectURL(url);
}

// Load data and set up event listeners on page load
window.onload = function() {
  loadQuotes();
  populateCategories();
  filterQuotes();

  const lastCategory = localStorage.getItem('selectedCategory');
  if (lastCategory) {
    document.getElementById('categoryFilter').value = lastCategory;
    filterQuotes();
  }
  
  syncWithServer();
};

// HTML for Import/Export Buttons
document.body.insertAdjacentHTML('beforeend', `
  <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
  <button onclick="exportToJsonFile()">Export Quotes</button>
`);
