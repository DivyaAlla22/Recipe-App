const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

// Background images for slideshow (junk food)
const foodImages = [
  "images/Food1.jpg",
  "images/Food2.jpg",
  "images/Food3.jpg",
  "images/Food4.jpg",
  "images/Food5.jpg",
  "images/Food6.jpg",
  "images/Food7.jpg"
];

let bgIndex = 0;
let bgInterval;

function preloadImages(images, callback) {
  let loadedCount = 0;
  const totalImages = images.length;
  images.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loadedCount++;
      if (loadedCount === totalImages) callback();
    };
  });
}

// Function to start background slideshow
function startSlideshow() {
  document.body.style.backgroundImage = `url(${foodImages[bgIndex]})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.transition = "background-image 1s ease-in-out";

  bgInterval = setInterval(() => {
    bgIndex = (bgIndex + 1) % foodImages.length;
    document.body.style.backgroundImage = `url(${foodImages[bgIndex]})`;
  }, 5000);
}

// Function to stop slideshow and show attractive static background
function stopSlideshow() {
  clearInterval(bgInterval);
  document.body.style.backgroundImage = "none";
  document.body.style.background = "linear-gradient(135deg, #f8cdda 0%, #1d2b64 100%)";
}

// Start slideshow when page loads
startSlideshow();

// Function to get recipes
const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
  try {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

    recipeContainer.innerHTML = "";
    
    if (!response.meals) {
      recipeContainer.innerHTML = `<h2>No recipes found for "${query}". Try searching for 'Chicken' or 'Pizza'.</h2>`;
      return;
    }

    response.meals.forEach(meal => {
      const recipeDiv = document.createElement('div');
      recipeDiv.classList.add('recipe');
      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3>
        <p><span>${meal.strArea}</span> Dish</p>
        <p>Belongs to <span>${meal.strCategory}</span> Category</p>
      `;
      const button = document.createElement('button');
      button.textContent = "View Recipe";
      recipeDiv.appendChild(button);

      // Open recipe popup
      button.addEventListener('click', () => {
        openRecipePopup(meal);
      });

      recipeContainer.appendChild(recipeDiv);
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    recipeContainer.innerHTML = `<h2>Error fetching recipes. Please check your connection and try again.</h2>`;
  }
};

// Function to fetch ingredients and measurements
const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};

// Function to open recipe popup
const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
    <div class="recipeInstructions">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
  `;
  recipeDetailsContent.parentElement.style.display = "block";
};

// Close popup
recipeCloseBtn.addEventListener('click', () => {
  recipeDetailsContent.parentElement.style.display = "none";
});

// Search functionality
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  
  if (!searchInput) {
    recipeContainer.innerHTML = `<h2>Type a meal name in the search box.</h2>`;
    return;
  }

  stopSlideshow(); // 🌈 Stop slideshow when user searches
  fetchRecipes(searchInput);
});
