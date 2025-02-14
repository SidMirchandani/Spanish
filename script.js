document.addEventListener("scroll", function () {
  let navbar = document.getElementById("navbar");
  let dropdown = document.querySelector(".header");

  if (window.scrollY > dropdown.clientHeight) {
    navbar.style.display = "block";
  } else {
    navbar.style.display = "none";
  }
});

// Data: Spanish terms & English definitions (swapped)
const terms = {
  "Money & Banking": {
    "ahorrar": "to save (money)",
    "el banco": "bank",
    "el cajero automático": "ATM",
    "el cheque (de viajero)": "(traveler’s) check",
    "cobrar": "to cash (a check)",
    "la cuenta corriente": "checking account",
    "la cuenta de ahorros": "savings account",
    "depositar": "to deposit",
    "firmar": "to sign",
    "pagar a plazos": "to pay in installments",
    "pagar al contado/en efectivo": "to pay in cash",
    "pedir prestado/a": "to borrow",
    "pedir un préstamo": "to apply for a loan",
    "ser gratis": "to be free of charge"
  },
  "Getting Around": {
    "cruzar": "to cross",
    "derecho": "straight (ahead)",
    "doblar": "to turn",
    "enfrente de": "opposite; facing",
    "la dirección": "address",
    "la esquina": "corner",
    "el estacionamiento": "parking lot",
    "estar perdido/a": "to be lost",
    "hacia": "toward",
    "indicar cómo llegar": "to give directions",
    "la cuadra": "(city) block"
  },
  "Mail & Correspondence": {
    "el cartero": "mail carrier",
    "el correo": "mail; post office",
    "echar (una carta) al buzón": "to mail",
    "enviar, mandar": "to send; to mail",
    "el sobre": "envelope",
    "el paquete": "package"
  },
  "Running Errands": {
    "hacer diligencias": "to run errands",
    "hacer cola": "to stand in line",
    "llenar (un formulario)": "to fill out (a form)"
  },
  "Stores & Shops": {
    "la carnicería": "butcher shop",
    "la floristería": "florist’s shop",
    "la frutería": "fruit store",
    "la heladería": "ice cream shop",
    "la joyería": "jewelry store",
    "la lavandería": "laundromat",
    "la panadería": "bakery",
    "la pastelería": "pastry shop",
    "la peluquería": "beauty salon",
    "la pescadería": "fish market",
    "el supermercado": "supermarket",
    "la zapatería": "shoe store"
  }
};

// Function to get all possible answers from all categories
function getAllAnswers() {
  return Object.values(terms).flatMap(category => Object.values(category));
}

// Function to load question
function loadQuestion() {
  let category = document.getElementById("categorySelect").value;
  let questionBox = document.getElementById("questionBox");

  if (!category) return; // Prevents loading if no category is selected

  let keys = Object.keys(terms[category]);
  let correctTerm = keys[Math.floor(Math.random() * keys.length)];
  let correctAnswer = terms[category][correctTerm];

  // Get all possible answers from all categories and remove the correct answer before selecting others
  let allAnswers = getAllAnswers().filter(answer => answer !== correctAnswer);

  // Shuffle and select 3 unique incorrect answers
  let incorrectAnswers = allAnswers.sort(() => Math.random() - 0.5).slice(0, 3);

  // Combine the correct answer with incorrect ones and shuffle
  let options = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5);

  questionBox.innerHTML = `
        <div class="question">${correctTerm}</div>
        <div class="options">
            ${options.map(answer => `<button onclick="checkAnswer(this, '${correctAnswer}')">${answer}</button>`).join("")}
        </div>
        <button id="nextButton" class="next-button" onclick="loadQuestion()" style="display: none;">Siguiente</button>
    `;

  loadFlashcards(category);
}

// Function to check answer
function checkAnswer(button, correctAnswer) {
  let allButtons = document.querySelectorAll(".options button");
  allButtons.forEach(btn => btn.classList.remove("correct", "incorrect"));

  if (button.innerText === correctAnswer) {
    button.classList.add("correct");
  } else {
    button.classList.add("incorrect");
    allButtons.forEach(btn => {
      if (btn.innerText === correctAnswer) {
        btn.classList.add("correct");
      }
    });
  }

  // Show "Next" button
  document.getElementById("nextButton").style.display = "block";

  // Disable all options after selection
  allButtons.forEach(btn => btn.disabled = true);
}

// Function to load flashcards (Now Spanish → English)
function loadFlashcards(category) {
  let flashcardTable = document.getElementById("flashcardTable");

  // Clear existing content (removes headers)
  flashcardTable.innerHTML = "";

  // Populate table with flashcards
  Object.entries(terms[category]).forEach(([spanish, english]) => {
    let row = document.createElement("tr");
    row.innerHTML = `
            <td>${spanish}</td>
            <td>${english}</td>
        `;
    flashcardTable.appendChild(row);
  });
}

// Load initial question when the category is selected
document.getElementById("categorySelect").addEventListener("change", loadQuestion);
