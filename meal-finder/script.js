

const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal')


// Search meal and fetch from api
function searchMeal(e) {
  e.preventDefault()

  // Clear single meal
  single_mealEl.innerHTML = ''

  // Get Search Term
  const term = search.value
  // Check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        resultHeading.innerHTML = `<h2>Search results from '${term}':</h2>`

        if (data.meals === null) {
          resultHeading.innerHTML = `There are no search results. Try Again!`
          mealsEl.innerHTML = ''
        } else {
          mealsEl.innerHTML = data.meals.map((meal) => {
            return `<div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>`
          }).join('')
        }
      })
    // Clear search text
    search.value = ''
  } else {
    alert('Please enter a search value')
  }
}


// Fetch meal by id
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0]

      addMealToDOM(meal)
    })
}

// Fetch random meal
function getRandomMeal() {
  // clear meals and heading
  mealsEl.innerHTML = ''
  resultHeading.innerHTML = ''
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0]

      addMealToDOM(meal)
    })
}

//  Add meal to DOM

function addMealToDOM(meal) {
  //make new array out of 3 part data to structure ingredients and amounts, 20 happens to be the max amount of ingredients allowed for  recipes on this site
  const ingredients = []

  for (let i = 1; i <= 20; i++) {
    // if that ingredient exist push it, bracket notation only, dot notation won't work, because meal is a param
    if (meal[`strIngredient${i}`]) {
      // string ingred 1 will go with str measure 1, and will be it's own array
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
    } else {
      // break loop if item not there
      break
    }
  }
  // using join('') on the map below is important to make it outpur as string, so backticks don't show in html
  single_mealEl.innerHTML = `<div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')
    }
        </ul >
      </div >
    </div >
  `
}

// Event Listeners
submit.addEventListener('submit', searchMeal)

random.addEventListener('click', getRandomMeal)

mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(item => {
    // checks if has classes
    if (item.classList) {
      return item.classList.contains('meal-info')
    } else {
      return false
    }
  })

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid')
    getMealById(mealID)
  }
})