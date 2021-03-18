/**
 * ELEMENTS TO MANIPULATE
 */

// FORM
const hwForm = document.querySelector("[data-hw-calculator]")
const hwInput = document.querySelector("[data-hw-input]")

// DISPLAY
// Error message
const error = document.querySelector("[data-error]")

// TEMPLATE
// (i) target the template content
const templateContent = document.querySelector("[data-template]").content

// (ii) clone the template
const templateClone = document.importNode(templateContent, true)

// (iii) insert data into elements

// container
const qqPercentageOutput = templateClone.querySelector(
  "[data-output-container]"
)

// initial qq input
const qqInitialInput = templateClone.querySelector("[data-initial-qq-input]")

// a) Genotype frequencies
const PPfrequency = templateClone.querySelector("[data-pp-frequency]")
const PqFrequency = templateClone.querySelector("[data-pq-frequency]")
const qqFrequency = templateClone.querySelector("[data-qq-frequency]")
const genotypeFrequenciesTotal = templateClone.querySelector(
  "[data-genotype-frequencies-total]"
)
const alleleFrequenciesTotal = templateClone.querySelector(
  "[data-allele-frequencies-total]"
)

// b) Allele frequencies
const Pfrequency = templateClone.querySelector("[data-p-frequency]")
const qFrequency = templateClone.querySelector("[data-q-frequency]")

// c) Genotype circles container
const frequencyGenotypeCircles = templateClone.querySelector(
  "[data-frequency-genotype-circles]"
)

// c) Allele circles container
const frequencyAlleleCircles = templateClone.querySelector(
  "[data-frequency-allele-circles]"
)

// d) Circles
// pp circles
const pCircle = document.createElement("span")
pCircle.classList.add("circle-p", "circle")

// pq circles
// - outer circle
const pCircleBg = document.createElement("span")
pCircleBg.classList.add("circle-pq-bg", "circle")

// - inner overlay
const pSquareOverlay = document.createElement("span")
pSquareOverlay.classList.add("circle-pq-overlay")

// put inner overlay inside outer circle
pCircleBg.appendChild(pSquareOverlay)

// qq circles
const qCircle = document.createElement("span")
qCircle.classList.add("circle-q", "circle")

// e) Genotype frequency results in percent
// brown eyes
const brownEyesResults = templateClone.querySelector("[data-result-brown-eyes]")
// blue eyes
const blueEyesResults = templateClone.querySelector("[data-result-blue-eyes]")

// (iiii) print template clone to screen
document.querySelector("[data-template-output]").appendChild(templateClone)

/*GLOSSARY */
const glossaryBtn = document.querySelector("[data-glossary-toggle-btn]")

/**
 * THE FORM
 */
hwForm.addEventListener("submit", e => {
  e.preventDefault()

  // Convert input to integer
  const hwValueRaw = parseInt(hwInput.value)

  // Check to see if value entered is within range
  if (hwValueRaw >= 1 && hwValueRaw <= 100) {
    error.classList.remove("show")
    error.classList.add("hide")

    qqPercentageOutput.classList.remove("hide")
    qqPercentageOutput.classList.add("show")
  } else {
    const errorMsg = "Please enter a number between 1 and 100."
    if (isNaN(hwValueRaw)) {
      error.innerText = `${errorMsg}`
    } else {
      error.innerText = `Invalid entry: ${hwInput.value}. ${errorMsg}`
    }
    error.classList.remove("hide")
    error.classList.add("show")

    qqPercentageOutput.classList.remove("show")
    qqPercentageOutput.classList.add("hide")
  }

  // Converted to decimal to use as hwCalculator function parameter
  const hwInputValue = parseFloat(hwInput.value) / 100

  // Call calculator function
  hwCalculator(hwInputValue)

  hwInput.addEventListener("focus", () => {
    // hide container when focussed
    qqPercentageOutput.classList.remove("show")
    qqPercentageOutput.classList.add("hide")

    // clear input value when focussed
    hwInput.value = ""

    // clear template values when focussed
    clearTemplateValuesOnFocus()
  })
})

/**
 * THE CALCULATOR
 */
function hwCalculator(qq) {
  const q = roundTwoPlaces(Math.sqrt(qq))
  const P = roundTwoPlaces(1 - q)
  const PplusQ = Math.round(P * 1 + q * 1)
  const PP = roundTwoPlaces(P * P)
  const TwoPq = roundTwoPlaces(2 * (P * q))
  const equationTotal = Math.round(PP + TwoPq + qq)

  /* 
  Check to see whether it adds up exactly to 1 or there are rounding errors (expected).
  If there are, add a ~ before the number
*/
  const checkEquationTotal = PP + TwoPq + qq
  const approx = document.querySelector("[data-approx]")

  checkEquationTotal !== 1.0
    ? (approx.innerText = "~")
    : (approx.innerText = "")

  // 0.09 displays as ~ 1 - but it adds up to 100%
  // must be some unique rounding error - this is a HACK to fix it:
  if (checkEquationTotal !== 1.0 && qq === 0.09) {
    approx.innerText = ""
  }

  // display initial qq input
  qqInitialInput.innerText = Math.round(qq * 100)

  // Display genotype frequencies
  PPfrequency.innerText = PP
  PqFrequency.innerText = TwoPq
  qqFrequency.innerText = qq
  genotypeFrequenciesTotal.innerText = equationTotal

  // Display allele frequencies
  Pfrequency.innerText = P
  qFrequency.innerText = q
  alleleFrequenciesTotal.innerText = PplusQ

  // circles values vars
  const ppFreqNum = Math.round(PP * 100)
  const pqFreqNum = Math.round(TwoPq * 100)
  const qqFreqNum = Math.round(qq * 100)
  const pFreqNum = Math.round(P * 100)
  const qFreqNum = Math.round(q * 100)

  // Display genotype frequency circles
  circleFrequencies(ppFreqNum, frequencyGenotypeCircles, pCircle)
  // pq
  circleFrequencies(pqFreqNum, frequencyGenotypeCircles, pCircleBg)
  // qq
  circleFrequencies(qqFreqNum, frequencyGenotypeCircles, qCircle)

  // Display allele frequency circles
  // p
  circleFrequencies(pFreqNum, frequencyAlleleCircles, pCircle)
  // q
  circleFrequencies(qFreqNum, frequencyAlleleCircles, qCircle)

  // Display phenotype results in percent
  const blueEyes = Math.round(qq * 100)
  const brownEyes = Math.round(PP * 100 + TwoPq * 100)

  // Phenotypes outputs
  // total
  const phenotypes = blueEyes + brownEyes
  const phenotypesTotal = document.querySelector("[data-phenotypes-total]")
  phenotypesTotal.innerText = phenotypes

  // brown eyes / blue eyes
  blueEyesResults.innerHTML = blueEyes

  if (phenotypes !== 100) {
    // Indicate if total phenotype percentage is not exactly 100%
    phenotypesTotal.classList.add("rounding-error")

    // Brown eyes will always be the innacurate ones:
    brownEyesResults.innerHTML = '<span class="approx">~</span> ' + brownEyes
  } else {
    phenotypesTotal.classList.remove("rounding-error")
    brownEyesResults.innerText = brownEyes
  }
}

/**
 * GLOSSARY
 */

glossaryBtn.addEventListener("click", e => {
  toggleGlossary(e)
  toggleGlossaryText(e)
})

function toggleGlossary(e) {
  const getGlossary = e.target.closest(".glossary")
  const getGlossaryBody = getGlossary.querySelector("[data-glossary-more]")
  getGlossaryBody.classList.toggle("show")
}

function toggleGlossaryText(e) {
  if (e.target.innerText === "Expand glossary") {
    e.target.innerText = "Close glossary"
  } else if (e.target.innerText === "Close glossary") {
    e.target.innerText = "Expand glossary"
  }
}

/**
 * HELPER FUNCTIONS
 */
function clearTemplateValuesOnFocus() {
  qqInitialInput.innerText = ""
  PPfrequency.innerText = ""
  PqFrequency.innerText = ""
  qqFrequency.innerText = ""
  genotypeFrequenciesTotal.innerText = ""
  alleleFrequenciesTotal.innerText = ""
  Pfrequency.innerText = ""
  qFrequency.innerText = ""
  frequencyGenotypeCircles.innerHTML = ""
  frequencyAlleleCircles.innerHTML = ""
  brownEyesResults.innerHTML = ""
  blueEyesResults.innerHTML = ""
}

function circleFrequencies(freqNum, freqContainer, circleType) {
  for (let i = 0; i < freqNum; i++) {
    freqContainer.appendChild(circleType.cloneNode(true))
  }
}

/* generic rounding function - two decimal places */
function roundTwoPlaces(value) {
  return Math.round(value * 100) / 100
}
