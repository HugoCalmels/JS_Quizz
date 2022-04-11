// declaration des variables 
const selectElement = document.querySelector('#select-element')
const selectWrapper = document.querySelector('.select-wrapper')
const sectionQuestions = document.querySelector('.questions-section')
let storageData = JSON.parse(localStorage.getItem('quizz')) || []
let howMuchQuestion = 0

// url
const url = 'https://opentdb.com/api.php?amount='

// ------------
// début de la séquence
// ------------

startGame()

function startGame() {

  askForName().then((nameResponse) => {
    let speCount = 0
    initializeSelectOptions() 
    selectElement.addEventListener('change', (event) => {
      event.preventDefault()

      if (event.target.value !== '-') { // je veux pas fetch sur '-'
      speCount += 1 // else the select goes crazy
        if (speCount === 1) {
          moveToRight(selectWrapper)
          setTimeout(() => {
            hideSelect()
            getNumberOfQuestions(event.target.value)
              .then((data) => {
            createNumberQuestion(event.target.value, data)
          })
          // selectionner la 1ere equestion
          .then(() => {
            undisplayAllButOne()
            let nextQuestion = document.querySelectorAll('.question-element')[0]
            moveFromLeft(nextQuestion)
            play(nameResponse)
          })
          },1000) 
      }
 
         
    }
  })
})
}

// ------------
// fin de la séquence
// ------------

// ------------
// fonctions 
// ------------

function askForName() {

  let nameElement = document.createElement('div')
  nameElement.className = 'name-element'
  nameElement.innerHTML = `
  <h2>Questions for a dev</h2>
    <form class="name-form">

    <input type="text" name="name" placeholder="Enter your name"/> 
    <label for="name">Name must be 4 characters min</label>
    <input type="submit" value="Play"/>
    </form>
  `
  sectionQuestions.appendChild(nameElement) 
  validate()
  return new Promise((resolve, reject) => {
    let nameInput = document.querySelector(".name-form")
    let removeNameElement = document.querySelector('.name-element')

    nameInput.addEventListener("submit", (e) => {
      e.preventDefault()
      let inputValue = document.querySelector('[name=name]').value
      if (inputValue.length >= 4) {
        moveToRight(removeNameElement)
        setTimeout(() => {
          moveFromLeft(selectWrapper)
          removeNameElement.remove() // removing the whole div
          resolve(inputValue)
        }, 1000)
      } else {
        var el = document.querySelector('.name-element');
        animateName1(el)
        throw new Error('Name must be 3 characters lenght min')
      }
    })
  })
}


function validate() {
  let inputElem = document.querySelector('[name=name]')
  inputElem.addEventListener('keyup', (event) => {
    event.preventDefault()
    let input = document.querySelector('[name=name]').value
    if (input.length <= 3) {
      inputElem.style.border = '2px solid #ff2121';
    } else if (input.length > 3) {
      inputElem.style.border = '2px solid #16db54'
    }
  })
}

function moveToRight(elem) {
  anime({
    targets: elem,
    easing: 'easeInOutQuart',
    keyframes: [
      {translateX: 3000},
    ],
    duration: 1000,
  });
}

function moveFromLeft(elem) {
  anime({
    targets: elem,
    easing: 'easeInOutQuart',
    keyframes: [
      {translateX: 1500},
    ],
    duration: 1000,
  });
}

function animateName1(elem) {
  anime({
    targets: elem,
    easing: 'easeInOutQuart',
    keyframes: [
      {translateX: -10},
      {translateX: 20},
      {translateX: -20},
      {translateX: 20},
      {translateX: -20},
      {translateX: 20},
      {translateX: -20},
      {translateX: 20},
      {translateX: -20},
      {translateX: 20},
      {translateX: -20},
      {translateX: 20},
      {translateX: -20},
      {translateX: 0},
    ],
    duration: 900,
  });
}

function animateName2(elem) {
  anime({
    targets: elem,
    easing: 'easeInOutQuart',
    keyframes: [
      {translateX: 1490},
      {translateX: 1510},
      {translateX: 1490},
      {translateX: 1510},
      {translateX: 1490},
      {translateX: 1510},
      {translateX: 1490},
      {translateX: 1510},
      {translateX: 1490},
      {translateX: 1510},
      {translateX: 1490},
      {translateX: 1510},
      {translateX: 1510},
      {translateX: 1490},
      {translateX: 1500},
    ], 
    duration: 900,
  });
}

function initializeSelectOptions() {
  // added a first blank option 
  let blankOption = document.createElement('option')
    blankOption.innerHTML = '-'
    blankOption.clasName += 'select-option'
    selectElement.appendChild(blankOption)
  // loop 1-20 options
  for (let i = 1; i < 21; i++){
    let newOption = document.createElement('option')
    newOption.innerHTML = i
    newOption.clasName += 'select-option'
    selectElement.appendChild(newOption)
  }
  selectWrapper.style.display = "flex"
}


async function getNumberOfQuestions(number) {
    const response = await fetch(`${url}${number}`)
    const data = await response.json()
    return data
}


function createNumberQuestion(number, data) {
  let index = 1

  data.results.forEach((e) => {
    console.log('2222222222222222')
    console.log(e)
    console.log('2222222222222222')
    let newQuestionElement = document.createElement('div')
    newQuestionElement.className += `question-element id-${index}`
    newQuestionElement.innerHTML = `
    <h2> Question ${index}/${number}</h2>
    <div class="question-content">
      <p class="question-question">${e.question}</p>
      <div class="question-grid id-${index}" id="${index}">
      </div>
      <div class="btn-wrapper">
      <button class="question-pagination id-${index}">NEXT</button >
      </div>
    </div>
    `
    sectionQuestions.appendChild(newQuestionElement)

    // iteration sur une nested array pour les 3 réponses fausses + 1 bonne réponse 
    // de plus la bonne réponse ne peut pas être au meme endroit a chaque tour
    let questionsAnswersChoices = document.querySelector(`.question-grid.id-${index}`) // parent 
    let randomOrder = Math.floor(Math.random() * e.incorrect_answers.length);
    let indexOrder = 0 // second itérateur de la boucle ci dessous

    for (let z = 0; z < e.incorrect_answers.length + 1; z++){
      if (z !== randomOrder) {
        newAnswer = document.createElement('div');
        newAnswer.className += 'answer-choice'
        newAnswer.innerHTML = `
        <div class="answer-button red" id="${index}">${e.incorrect_answers[indexOrder]}</div>
        `
        indexOrder++ // cet itérateur monte moins vite que z
      } else {
        newAnswer = document.createElement('div');
        newAnswer.className += 'answer-choice'
        newAnswer.innerHTML = `
        <div class="answer-button green id-${index}"id="${index}">${e.correct_answer}</div>
        `
      }
      questionsAnswersChoices.appendChild(newAnswer)
    }
    index++
  })
}

function play(userName) {
  
  let results = []
  let lastGivenResponse
  let currentIndex 
  let lastCorrectAnswer
  // listening chaque div-réponse possible, return value
  let questionsGridsArray = document.querySelectorAll('.question-grid')
  questionsGridsArray.forEach((possibleAnswer) => {
    
    let answersPack = possibleAnswer.querySelectorAll('.answer-choice')
    answersPack.forEach((answerGridElement) => {
      answerGridElement.addEventListener('mousemove', (j) => {
        j.target.style.background = "rgb(207, 207, 207)";
      })
      answerGridElement.addEventListener('mouseout', (j) => {
        j.target.style.background = "rgb(235, 235, 235)";
      })
      answerGridElement.addEventListener('click', (event2) => {
        // reset all red color backgrounds
        let nextButton = document.querySelectorAll('.question-pagination')[0]
        let buttonColorReset = document.querySelectorAll('.answer-button')
        nextButton.style.border= '2px solid #16db54'
        buttonColorReset.forEach((e) => {
          e.style.border = "2px solid black";
        })
        currentIndex = event2.target.id
        let correctAsnwer = document.querySelector(`.answer-button.green.id-${currentIndex}`).innerHTML
        console.log(event2.target.innerHTML)
        lastCorrectAnswer = correctAsnwer
        lastGivenResponse = event2.target.innerHTML
        event2.target.style.border = "2px solid #16db54"  
        })
      })
    })

    // listening button next pour confimer la réponse 
    let confirmButtonsArray = document.querySelectorAll('.question-pagination')
    confirmButtonsArray.forEach((button) => {
      button.addEventListener('click', (event) => {
        if (event.target.style.border !== "2px solid rgb(22, 219, 84)") {
          let currentQuestion = document.querySelectorAll('.question-element')[0]
          animateName2(currentQuestion)
        } else if (event.target.style.border === "2px solid rgb(22, 219, 84)") {
          let newObject = {
            index: currentIndex,
            you: lastGivenResponse,
            correct: lastCorrectAnswer
          }
          results.push(newObject)
          moveLastQuestion()
          setTimeout(() => {
            destroyLastQuestion()
          },900)        
          if (results.length === questionsGridsArray.length) {
              isFinished(results, userName)
          }
        }  
      })
  })
}

function undisplayAllButOne() {
  let questionsElems = document.querySelectorAll('.question-element')
  questionsElems.forEach((e, index) => {
    if (index === 0)
      e.style.display = "flex"
  })
}

async function moveLastQuestion() {
    let questionsElementsArray = document.querySelectorAll('.question-element')
  questionsElementsArray.forEach((questionElem, index) => {
    if (index === 0) {
        moveToRight(questionElem)
      }
  })
}

function destroyLastQuestion() {
  let questionsElementsArray = document.querySelectorAll('.question-element')
  questionsElementsArray.forEach((questionElem, index) => {
    if (index === 0) {
      questionElem.remove()
    }
  })
  //document.querySelectorAll('.question-element')[0].remove()
  undisplayAllButOne()
  let nextQuestion = document.querySelectorAll('.question-element')[0]
  moveFromLeft(nextQuestion)
}


function isFinished(resultArray, userName) {
  saveData(resultArray, userName)
  displayShowScore()
  // THOSE RESULTS ARE ONLY RELATED TO THE LAST ROUND
  let resultElement = document.createElement('div')
  resultElement.className = 'display-results'
  resultElement.innerHTML = `
    <h2> Results : ${calculateResult(resultArray)}</h2>
  `
  // adding our result as a table in innerHTML
  let displayContent = document.createElement('div')
  displayContent.className = 'display-results-content'
  displayContent.innerHTML += `
  <div class="row">
  <p> Question </p>
  <p> Your answer </p>
  <p> Correct answer </p>
  </div>
  `
  resultArray.forEach((result, index) => {
    if (result.you === result.correct) {
      displayContent.innerHTML += `
      <div class="row">
      <p> ${result.index}/${resultArray.length}</p>
      <p class="green-result"> ${result.you} </p>
      <p> ${result.correct} </p>
      </div>
      `
    } else {
      displayContent.innerHTML += `
      <div class="row">
      <p> ${result.index}/${resultArray.length}</p>
      <p class="red-result"> ${result.you} </p>
      <p> ${result.correct} </p>
      </div>
      `
    }
    resultElement.appendChild(displayContent)
    sectionQuestions.appendChild(resultElement)
    slowlyShow()
  })

}

function slowlyShow() {
  setTimeout(() => {
    let firstElem = document.querySelector('.display-results')
    firstElem.style.opacity = 1
    let thirdElem = document.querySelector('.score-show')
    thirdElem.style.opacity = 1
  },900)
}

function slowlyHide() {

    let elem1 = document.querySelector('.display-results')
    elem1.style.opacity = 0
    let elem2 = document.querySelector('.score-show')
    elem2.style.display = 0

}
function slowlyShowScore() {

    let secondElem = document.querySelector('.btn-play-again')
    secondElem.style.opacity = 1
    let elem3 = document.querySelector('.score')
    elem3.style.opacity = 1
    removeResults() 

}

function calculateResult(array) {
  let i = 0
  array.forEach((e) => {
    if (e.you === e.correct)
      i++
  })
  let res = `${i}/${array.length}`
  return res
} 


function displaySelect() {
  selectElement.selectedIndex = 0
  selectElement.value = "-"
  selectWrapper.style.display = "flex"
}
function hideSelect() {
  selectWrapper.style.display = "none"
}

function displayButtonPlayAgain() {
  let newButton = document.createElement('div')
  let btnHallOfFame = document.querySelector('.score-show')
  btnHallOfFame.style.display = "none"
  newButton.className = 'btn-play-again'
  newButton.innerHTML = "Play again"
  newButton.addEventListener('click', () => { 
    displaySelect()
    newButton.style.display = "none"
    resetGame()
    
   })
  sectionQuestions.appendChild(newButton)
}

function displayShowScore() {
  let button = document.createElement('div')
  button.className = "score-show"
  button.innerHTML += `
    Hall of Fame
  `
  sectionQuestions.appendChild(button)
  button.addEventListener('click', () => {
    displayButtonPlayAgain()
    slowlyHide()
    let score = document.createElement('div')
    score.className = 'score'
    score.innerHTML += `
    <h2>HALL OF FAME</h2>
    </div>
      `
    sectionQuestions.appendChild(score)
    let scoreContent = document.querySelector('.score')
    let scoreRow = document.createElement('div')
    scoreRow.className = 'score-content'
    scoreRow.innerHTML += `
    <div class="row">
      <p>Name</p>
      <p>Score</p>
      </div>
    `
    storageData.forEach((e) => {
       scoreRow.innerHTML += `
       <div class="row">
        <p>${e.name}</p>
        <p>${e.score}</p>
        </div>
   
      `
      scoreContent.appendChild(scoreRow)
    })
    slowlyShowScore()
  })
}

function removeResults() {
  document.querySelector('.display-results').remove()
}

function saveData(array, userName) {
  let newStorage = {
    name: userName,
    score: calculateResult(array)
  }
  storageData.push(newStorage)
  localStorage.setItem('quizz', JSON.stringify(storageData))
}

function resetGame() {
  let btnRemove = document.querySelector('.score-show')
  btnRemove.remove()
  let btnRemove2 = document.querySelector('.btn-play-again')
  btnRemove2.remove()
  let divResults = document.querySelector('.score')
  divResults.remove()
  let oldQuestions = document.querySelectorAll('.question-element')
  oldQuestions.forEach((e) => e.remove())
  moveBack(selectWrapper)
  startGame()
}

function moveBack(elem) {
  anime({
    targets: elem,
    keyframes: [
      {translateX: -3000},
    ],
  });
}