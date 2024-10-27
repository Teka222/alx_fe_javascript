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
