let mealData = [];
let filteredMealData = [];

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
    const { strMeal, strInstructions, strMealThumb, idMeal } = meal;
    const div = document.createElement("div");

    div.innerHTML = `
   <div class="flex gap-6">
            
            <img class='w-1/5' src=${strMealThumb} alt="" />
            <div class="space-y-4 py-6">
              <h4 class="text-2xl font-bold">${strMeal}</h4>
              <p class="font-medium multi-line-ellipsis text-gray-500">
                ${strInstructions ? strInstructions : `Not available`}
              </p>
              <button onclick='showDetails(${idMeal})' class="underline text-yellow-400">View Details</button>
            </div>
          </div>
   
   `;
    mealsContainer.appendChild(div);
  });
};

const showAll = () => {
  if (filteredMealData.length > 0) {
    // Display all meals for the current category if it's filtered
    displayMeals(true, filteredMealData);
  } else {
    // Display all meals if no category is selected
    displayMeals(true, mealData);
  }
};

const handleSearch = () => {
  const searchBox = document.getElementById("search-box");
  const searchBoxVal = searchBox.value;
  loadData(searchBoxVal);
};

const showDetails = async (id) => {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await res.json();
  displayModal(data.meals);
};
const displayModal = (data) => {
  console.log(data);
  const modalContainer = document.getElementById("modal-container");
  const {
    strCategory,
    strArea,
    strInstructions,
    strYoutube,
    strMeal,
    strMealThumb,
  } = data[0];
  modalContainer.innerHTML = `
    <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
          <div class="modal-box">
            <form method="dialog">
              <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
            </form>
            <h3 class="text-2xl border-b-2 pb-2 mb-2 font-bold">
              ${strMeal}
            </h3>
            <img src=${strMealThumb} alt="" />
            <p class="py-2">
              <span class="font-bold">Category : </span>${strCategory}
            </p>
            <p class="py-2"><span class="font-bold">Area : </span>${strArea}</p>
            <p class="py-2">
              <span class="font-bold">Instructions : </span>${strInstructions}
            </p>
            <p class="py-2">
              <span class="font-bold">Youtube : </span
              >${strYoutube}
            </p>

            <div class="modal-action">
              <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
    
    `;
  my_modal_5.showModal();
};

const loadCategories = async () => {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?c=list`
  );
  const data = await res.json();
  displayCategories(data.meals);
};

const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("category-container");
  categories.forEach((category) => {
    const div = document.createElement("strCategory");
    div.innerHTML = `
    <button onclick='handleCategory("${category.strCategory}")' class="font-bold border-2 h-20 w-40">${category.strCategory}
    </button>
    
    `;
    categoryContainer.appendChild(div);
  });
};

const handleCategory = async (category) => {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  const data = await res.json();
  filteredMealData = [];

  // Fetch full details of each meal by id using Promise.all
  const mealDetailsPromises = data.meals.map(async (meal) => {
    const mealDetailsRes = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
    );
    const mealDetails = await mealDetailsRes.json();
    return mealDetails.meals[0]; // Return the full meal data (with instructions)
  });

  // Wait for all meal details to be fetched
  filteredMealData = await Promise.all(mealDetailsPromises);
  document.getElementById("spinner").classList.remove("hidden");
  document.getElementById("meals-container").classList.add("hidden");
  setTimeout(() => {
    displayMeals(false, filteredMealData); // Display the meals with full details
  }, 2000);
};

loadData();
loadCategories();
