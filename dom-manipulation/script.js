// Quote array
let quotes = [
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Success" }
];

// Show random quote function
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  
  // Use innerHTML to display the quote and category
  document.getElementById("quoteDisplay").innerHTML = `${quote.text} - <strong>${quote.category}</strong>`;
}

// Function to dynamically create the "Add Quote" form
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  
  // Create text input for new quote
  const quoteInput = document.createElement('input');
  quoteInput.setAttribute('id', 'newQuoteText');
  quoteInput.setAttribute('type', 'text');
  quoteInput.setAttribute('placeholder', 'Enter a new quote');
  
  // Create text input for quote category
  const categoryInput = document.createElement('input');
  categoryInput.setAttribute('id', 'newQuoteCategory');
  categoryInput.setAttribute('type', 'text');
  categoryInput.setAttribute('placeholder', 'Enter quote category');
  
  // Create Add Quote button
  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote;

  // Append inputs and button to the form container
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  // Add the form container to the body
  document.body.appendChild(formContainer);
}

// Add quote function
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    alert("New quote added!");
  } else {
    alert("Please fill in both fields.");
  }
}

// Add event listener to the button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Dynamically create the Add Quote form when the page loads
window.onload = createAddQuoteForm;
