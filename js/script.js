let mealData = [];
const loadData = async (searchBoxVal) => {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${
      searchBoxVal ? searchBoxVal : ""
    }`
  );
  const data = await res.json();
  mealData = data.meals;
  document.getElementById("spinner").classList.remove("hidden");
  document.getElementById("meals-container").classList.add("hidden");

  setTimeout(() => {
    displayMeals(false, data.meals);
  }, 2000);
};

const displayMeals = (status, meals) => {
  document.getElementById("spinner").classList.add("hidden");
  document.getElementById("meals-container").classList.remove("hidden");
  let slicedMeal;
  const mealsContainer = document.getElementById("meals-container");
  mealsContainer.innerHTML = "";
  if (status === true) {
    slicedMeal = meals;
  } else {
    slicedMeal = meals.slice(0, 6);
  }

  slicedMeal.forEach((meal) => {
    const { strMeal, strInstructions, strMealThumb } = meal;
    const div = document.createElement("div");

    div.innerHTML = `
   <div class="flex gap-6">
            
            <img class='w-1/5' src=${strMealThumb} alt="" />
            <div class="space-y-4 py-6">
              <h4 class="text-2xl font-bold">${strMeal}</h4>
              <p class="font-medium multi-line-ellipsis text-gray-500">
                ${strInstructions}
              </p>
              <button class="underline text-yellow-400">View Details</button>
            </div>
          </div>
   
   `;
    mealsContainer.appendChild(div);
  });
};

const showAll = () => {
  displayMeals(true, mealData);
};

const handleSearch = () => {
  const searchBox = document.getElementById("search-box");
  const searchBoxVal = searchBox.value;
  loadData(searchBoxVal);
};

loadData();
