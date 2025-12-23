// Base URL for the DummyJSON API
const API_BASE_URL = 'https://dummyjson.com';

// These are used to extract the food type from the recipe's tags array
const VALID_FOOD_TYPES = [
  "Bibimbap", "Biryani", "Borscht", "Bruschetta", "Caipirinha",
  "Chicken", "Cookies", "Curry", "Dessert", "Dosa", "Elote", "Falafel",
  "Karahi", "Kebabs", "Keema", "Lassi", "Moussaka", "Pasta",
  "Pizza", "Ramen", "Roti", "Saag", "Salad", "Smoothie",
  "Soup", "Stir-fry", "Tagine", "Tiramisu", "Wrap"
];


 // Extracts the food type from a recipe's tags array
function extractFoodType(tags) {
  // Check if tags exists and is an array
  if (!tags || !Array.isArray(tags)) {
    return undefined;
  }

  // Find the first tag that matches one of our valid food types
  const matchedFoodType = tags.find(tag => 
    VALID_FOOD_TYPES.includes(tag)
  );
  
  return matchedFoodType; 
}


// Fetches all recipes from the DummyJSON API
export async function fetchAllRecipes() {
  // Make GET request to fetch all recipes
  const response = await fetch(`${API_BASE_URL}/recipes`);
  
  // Check if the response was successful
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  
  // Parse the JSON response body
  const data = await response.json();
  
  // Transform each recipe by extracting foodType from tags
  return data.recipes.map(recipe => ({
    ...recipe,
    foodType: extractFoodType(recipe.tags)
  }));
}

// Adds a new recipe to the API
export async function addRecipe(newRecipe) {
  // Make POST request to add a new recipe
  const response = await fetch(`${API_BASE_URL}/recipes/add`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(newRecipe) // Convert JavaScript object to JSON string
  });
  
  // Check if the response was successful
  if (!response.ok) {
    throw new Error('Failed to add recipe');
  }
  
  // Parse the JSON response
  const data = await response.json();
  
  // Return the recipe data with extracted foodType
  return {
    ...data,
    foodType: extractFoodType(data.tags)
  };
}


// Updates an existing recipe by ID
export async function updateRecipe(id, updatedRecipe) {
  // Make PUT request to update an existing recipe
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedRecipe) // Convert JavaScript object to JSON string
  });

  // Check if the response was successful
  if (!response.ok) {
    throw new Error('Failed to update recipe');
  }

  // Parse the JSON response
  const data = await response.json();
  
  // Return the updated recipe with extracted foodType
  return {
    ...data,
    foodType: extractFoodType(data.tags)
  };
}


// Deletes a recipe by ID
export async function deleteRecipe(id) {
  // Make DELETE request to remove a recipe
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'DELETE', 
  });

  // Check if the response was successful
  if (!response.ok) {
    throw new Error('Failed to delete recipe');
  }

  // Parse and return the JSON response
  const data = await response.json();
  return data;
}



