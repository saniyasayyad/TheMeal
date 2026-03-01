const searchBtn = document.getElementById("serchbtn");
const resultDiv = document.getElementById("results");
const modal = document.getElementById("mealModal");
const closemodal = document.getElementById("closeModal");
const mealDetails = document.getElementById("mealDetail");

// search button logic
searchBtn.addEventListener("click", () => {
    const ingredient = document.getElementById("ingredientInput").value.trim();

    if(ingredient == "" ) {
        alert("Please enter an ingredient!");
        return;
    }

    searchMeals(ingredient);

});

// now fetch meal by ingradient

async function searchMeals(ingredient) {
    resultDiv.innerHTML = "Loading...";

    try {
        const response = await fetch(
             `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
        );

        const data = await response.json();

        if (!data.meals) {
            resultDiv.innerHTML = "No meals Found!..";
            return;
        }
        displayMeals(data.meals);
    } catch (error) {
        resultDiv.innerHTML = "Error while fetching the data!";
        console.error(error);
    }
}

// Fetch 10 random meals
async function getRandomMeals() {
    resultDiv.innerHTML = "Loading...";
    const mealPromises = [];
    
    // The randomselection.php is premium, so we fetch 10 random meals individually
    for (let i = 0; i < 10; i++) {
        mealPromises.push(
            fetch('https://www.themealdb.com/api/json/v1/1/random.php')
                .then(res => res.json())
                .then(data => data.meals[0])
        );
    }

    try {
        const meals = await Promise.all(mealPromises);
        displayMeals(meals);
    } catch (error) {
        resultDiv.innerHTML = "Error while fetching random meals!";
        console.error(error);
    }
}

// Load random meals on startup
window.addEventListener("DOMContentLoaded", getRandomMeals);


// display
function displayMeals(meals) {
    resultDiv.innerHTML = "";

    meals.forEach(meal => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"> 
        <h3>${meal.strMeal}</h3>
        `;

        card.addEventListener("click", () => {
            getMealDetails(meal.idMeal);
        });

        resultDiv.appendChild(card);
        
    });
}

// full meal details

async function getMealDetails(id) {
    try {
        const response = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await response.json();
        displayMealDetails(data.meals[0]);

    } catch (error) {
        console.error(error);
    }
}

// dispaly in model
function displayMealDetails(meal) {
    let ingredients = "";

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`
        }
    }

   mealDetails.innerHTML = `
<h2>${meal.strMeal}</h2>

<img src="${meal.strMealThumb}" class="modal-img">

<div class="recipe-content">

    <div class="ingredients">
        <h3>Ingredients</h3>
        <ul>${ingredients}</ul>
    </div>

    <div class="instructions">
        <h3>Instructions</h3>
        <p>${meal.strInstructions}</p>
    </div>

</div>

${
    meal.strYoutube
        ? `<a href="${meal.strYoutube}" target="_blank" class="yt-btn">▶ Watch on YouTube</a>`
        : ""
}
`;

    modal.style.display = "block";
}

// close

closemodal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    } 
});