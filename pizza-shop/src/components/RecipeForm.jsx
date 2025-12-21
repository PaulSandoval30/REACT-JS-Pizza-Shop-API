import { useState, useRef, useEffect } from "react";

const RecipeForm = ({
  mode = "add", // Default to "add" mode
  initialValues = {}, // Default to empty object
  onClose,
  onSubmit,
  addRecipeMutation,
  editRecipeMutation,
}) => {
  // Fallback to empty object if initialValues is null or undefined
  const values = initialValues || {};

  // Convert arrays to strings for editing
  const ingredientsStr = Array.isArray(values.ingredients) 
    ? values.ingredients.join(", ") 
    : values.ingredients || "";
  
  const instructionsStr = Array.isArray(values.instructions)
    ? values.instructions.join("\n")
    : values.instructions || "";


  // Text input states
  const [recipeName, setRecipeName] = useState(values.name || "");
  const [ingredients, setIngredients] = useState(ingredientsStr); 
  const [instructions, setInstructions] = useState(instructionsStr); 
  const [cookingTime, setCookingTime] = useState(values.cookTimeMinutes || "");
  const [formError, setFormError] = useState(""); 

  // Dropdown open/close states
  const [isDropdownCuisineOpen, setIsDropdownCuisineOpen] = useState(false);
  const [isDropdownDifficultyOpen, setIsDropdownDifficultyOpen] = useState(false);
  const [isDropdownFoodTypeOpen, setIsDropdownFoodTypeOpen] = useState(false);

  // Selected dropdown values
  const [selectedCuisine, setSelectedCuisine] = useState(
    values.cuisine || "Select Cuisine Type" // Default placeholder text
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    values.difficulty || "Select Difficulty Type"
  );
  const [selectedFoodType, setSelectedFoodType] = useState(
    values.foodType || "Select Food Type"
  );

  // Refs to detect clicks outside dropdowns for closing them
  const dropdownCuisineRef = useRef(null);
  const dropdownDifficultyRef = useRef(null);
  const dropdownFoodTypeRef = useRef(null);


  // Array of cuisine options sorted alphabetically
  const cuisineOptions = [
    "American",
    "Asian",
    "Brazilian",
    "Greek",
    "Indian",
    "Italian",
    "Japanese",
    "Korean",
    "Lebanese",
    "Mediterranean",
    "Mexican",
    "Moroccan",
    "Pakistani",
    "Russian",
    "Thai",
    "Turkish",
  ];

  // Array of food type options sorted alphabetically
  const foodTypeOptions = [
    "Bibimbap",
    "Biryani",
    "Borscht",
    "Bruschetta",
    "Caipirinha",
    "Chicken",
    "Cookies",
    "Curry",
    "Dessert",
    "Dosa",
    "Elote",
    "Falafel",
    "Karahi",
    "Kebabs",
    "Keema",
    "Lassi",
    "Moussaka",
    "Pasta",
    "Pizza",
    "Ramen",
    "Roti",
    "Saag",
    "Salad",
    "Smoothie",
    "Soup",
    "Stir-fry",
    "Tagine",
    "Tiramisu",
    "Wrap",
  ];

  // Array of difficulty options
  const difficultyOptions = ["Easy", "Medium", "Hard"];

  // Sync form state when initialValues change especially in edit mode
  useEffect(() => {
    if (mode === "edit" && Object.keys(initialValues).length > 0) {
      // Update all form fields with the initial values
      setRecipeName(initialValues.name || "");
      
      // Convert array ingredients to comma-separated string
      const ingredientsStr = Array.isArray(initialValues.ingredients) 
        ? initialValues.ingredients.join(", ") 
        : initialValues.ingredients || "";
      setIngredients(ingredientsStr);
      
      // Convert array instructions to newline-separated string
      const instructionsStr = Array.isArray(initialValues.instructions)
        ? initialValues.instructions.join("\n")
        : initialValues.instructions || "";
      setInstructions(instructionsStr);
      
      // Update remaining fields
      setCookingTime(initialValues.cookTimeMinutes || "");
      setSelectedCuisine(initialValues.cuisine || "Select Cuisine Type");
      setSelectedDifficulty(initialValues.difficulty || "Select Difficulty Type");
      setSelectedFoodType(initialValues.foodType || "Select Food Type");
    }
  }, [initialValues, mode]); 

  // Click outside detection for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check each dropdown ref to see if click was outside
      if (
        dropdownCuisineRef.current &&
        !dropdownCuisineRef.current.contains(event.target)
      ) {
        setIsDropdownCuisineOpen(false);
      }
      if (
        dropdownDifficultyRef.current &&
        !dropdownDifficultyRef.current.contains(event.target)
      ) {
        setIsDropdownDifficultyOpen(false);
      }
      if (
        dropdownFoodTypeRef.current &&
        !dropdownFoodTypeRef.current.contains(event.target)
      ) {
        setIsDropdownFoodTypeOpen(false);
      }
    };

    // Only add event listener if at least one dropdown is open
    if (
      isDropdownCuisineOpen ||
      isDropdownDifficultyOpen ||
      isDropdownFoodTypeOpen
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownCuisineOpen, isDropdownDifficultyOpen, isDropdownFoodTypeOpen]);

  // Auto-hide error message after 3 seconds
  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => {
        setFormError("");
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [formError]);

  // Resets all form fields and closes the modal
  const handleCancel = () => {
    setRecipeName("");
    setIngredients("");
    setInstructions("");
    setCookingTime("");
    setSelectedCuisine("Select Cuisine Type");
    setSelectedDifficulty("Select Difficulty Type");
    setSelectedFoodType("Select Food Type");
    setFormError(""); 
    onClose(); 
  };


  // Validates and submits the form data
  const handleSubmit = () => {
    // Check if all required fields are filled
    if (
      !recipeName.trim() || 
      selectedCuisine === "Select Cuisine Type" ||
      selectedDifficulty === "Select Difficulty Type" || 
      selectedFoodType === "Select Food Type" 
    ) {
      setFormError("Please fill out all form information");
      return; 
    }

    setFormError(""); // Clear any previous error

    // Construct the form data object
    const formData = {
      name: recipeName,
      // Split comma-separated string into array, trim whitespace, remove empty strings
      ingredients: ingredients.split(",").map((i) => i.trim()).filter(i => i),
      // Split newline-separated string into array, trim whitespace, remove empty strings
      instructions: instructions.split("\n").map((i) => i.trim()).filter(i => i),
      cookTimeMinutes: Number(cookingTime) || 0, // Convert to number, default to 0
      cuisine: selectedCuisine,
      difficulty: selectedDifficulty,
      tags: [selectedFoodType], // API expects an array of tags
    };
    
    onSubmit(formData);
    
    // Reset all form fields after successful submission
    setRecipeName("");
    setIngredients("");
    setInstructions("");
    setCookingTime("");
    setSelectedCuisine("Select Cuisine Type");
    setSelectedDifficulty("Select Difficulty Type");
    setSelectedFoodType("Select Food Type");
  };

  // Dynamic UI text based on mode
  const title = mode === "add" ? "🍕 Add New Recipe" : "✏️ Edit Recipe";

  // Check which mutation is currently loading
  const isLoading = mode === 'add' ? addRecipeMutation?.isPending : editRecipeMutation?.isPending;
  
  // Dynamic button label based on mode and loading state
  const submitBtnLabel = isLoading
                        ? (mode === 'add' ? 'Adding...' : 'Updating...') // Show loading text
                        : (mode === 'add' ? 'Add Recipe' : 'Update Recipe'); // Show normal text

  return (
    <>
      {/* Recipe Form Modal Container */}
      <div className="bg-white px-[2em] py-[3em] rounded-[18px] shadow-[0_4px_15px_rgba(0,0,0,0.4)] w-150 flex flex-col items-center gap-[1em] max-h-[90vh] overflow-y-auto">
        <h2 className="text-[1.7rem] font-semibold text-shadow-[0_1px_5px_rgba(0,0,0,0.2)]">
          {title}
        </h2>
        {/* Error Wrapper */}
        {formError && (
          <div className="w-full bg-[rgba(255,61,39,0.15)] text-red-900 rounded-[5px] px-[1em] py-[.8em] text-[.9rem] text-center font-normal [border:1px_solid_#ff3d27]">
            {formError}
          </div>
        )}
        {/* Form Groups Container */}
        <div className="grid place-items-center p-[.5em] gap-[.6em] w-full">
          {/* Input Group - Recipe Name */}
          <div className="grid w-full gap-[.2em]">
            <label htmlFor="recipe-name" className="text-[1rem] font-medium">
              Recipe Name: <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              id="recipe-name"
              placeholder="Recipe Name..."
              value={recipeName}
              onChange={(e) => {
                setRecipeName(e.target.value);
              }}
              className="placeholder:text-[rgba(0,0,0,0.4)] bg-[rgba(0,0,0,0.03)] px-[1em] h-10 text-[.9rem] [border:1px_solid_rgba(0,0,0,0.3)] outline-none rounded-[5px] w-full hover:[border:1px_solid_#e6a820] focus:[border:1px_solid_#e6a820] hover:bg-[rgba(255,163,57,0.1)] focus:bg-[rgba(255,163,57,0.1)] transition-all duration-50 ease"
            />
          </div>
          {/* Input Group - Ingredients */}
          <div className="grid w-full gap-[.2em]">
            <label htmlFor="ingredients" className="text-[1rem] font-medium">
              Ingredients: <span className="text-red-700">*</span>
            </label>
            <textarea
              id="ingredients"
              placeholder="List ingredients separated by commas..."
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="placeholder:text-[rgba(0,0,0,0.4)] bg-[rgba(0,0,0,0.03)] px-[1em] py-[1em] text-[.9rem] [border:1px_solid_rgba(0,0,0,0.3)] outline-none rounded-[5px] w-full h-20 resize-none hover:[border:1px_solid_#e6a820] focus:[border:1px_solid_#e6a820] hover:bg-[rgba(255,163,57,0.1)] focus:bg-[rgba(255,163,57,0.1)]"
            />
          </div>
          {/* Input Group - Instructions */}
          <div className="grid w-full gap-[.2em]">
            <label htmlFor="instructions" className="text-[1rem] font-medium">
              Instructions: <span className="text-red-700">*</span>
            </label>
            <textarea
              id="instructions"
              placeholder="Step-by-step cooking instructions... (One per line)"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="placeholder:text-[rgba(0,0,0,0.4)] bg-[rgba(0,0,0,0.03)] px-[1em] py-[1em] text-[.9rem] [border:1px_solid_rgba(0,0,0,0.3)] outline-none rounded-[5px] w-full h-25 resize-none hover:[border:1px_solid_#e6a820] focus:[border:1px_solid_#e6a820] hover:bg-[rgba(255,163,57,0.1)] focus:bg-[rgba(255,163,57,0.1)]"
            />
          </div>
          {/* Input Group - Cooking Time */}
          <div className="grid w-full gap-[.2em]">
            <label htmlFor="cooking-time" className="text-[1rem] font-medium">
              Cooking Time (minutes): <span className="text-red-700">*</span>
            </label>
            <input
              type="number"
              id="cooking-time"
              placeholder="e.g., 20"
              min="0"
              max="999"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              className="placeholder:text-[rgba(0,0,0,0.4)] bg-[rgba(0,0,0,0.03)] px-[1em] h-10 text-[.9rem] [border:1px_solid_rgba(0,0,0,0.3)] outline-none rounded-[5px] w-full hover:[border:1px_solid_#e6a820] focus:[border:1px_solid_#e6a820] hover:bg-[rgba(255,163,57,0.1)] focus:bg-[rgba(255,163,57,0.1)]"
            />
          </div>
          {/* Grid Group Dropdowns */}
          <div className="grid grid-cols-[repeat(2,1fr)] gap-[.7em] w-full">
            {/* Dropdown Cuisine */}
            <div className="grid gap-[.2em]">
              <span className="text-[.9rem] font-medium">Cuisine Type: <span className="text-red-700">*</span></span>
              <div className="w-full relative" ref={dropdownCuisineRef}>
                {/* Dropdown Header */}
                <div
                  className="bg-[rgba(0,0,0,0.03)] cursor-pointer w-full h-full rounded-[5px] flex items-center justify-between px-[1em] py-[1em] [border:1px_solid_rgba(0,0,0,0.3)] hover:[border:1px_solid_#e6a820] focus:[border:1px_solid_#e6a820] hover:bg-[rgba(255,163,57,0.1)] focus:bg-[rgba(255,163,57,0.1)]"
                  onClick={() => {
                    setIsDropdownCuisineOpen(!isDropdownCuisineOpen);
                  }}
                >
                  <span className="text-[.8rem]">{selectedCuisine}</span>
                  <span
                    className={`transition-all duration-200 ease flex item-center ${
                      isDropdownCuisineOpen ? "-rotate-90" : "rotate-90"
                    }`}
                  >
                    <ion-icon name="caret-back-outline"></ion-icon>
                  </span>
                </div>
                {/* Dropdown List */}
                <ul
                  className={`absolute top-[3.5em] left-0 w-full bg-white [border:1px_solid_rgba(0,0,0,0.4)] rounded-[5px] p-[.4em] transition-all duration-150 ease shadow-[0_3px_8px_rgba(0,0,0,0.15)] z-10 overflow-y-auto max-h-43.75 ${
                    isDropdownCuisineOpen
                      ? "opacity-[1] pointer-events-auto translate-y-0"
                      : "opacity-[0] pointer-events-none -translate-y-1.25"
                  }`}
                >
                  {cuisineOptions.map((cuisine) => (
                    <li
                      key={cuisine}
                      className="text-black py-[.8em] pl-[.8em] hover:bg-[rgba(0,0,0,0.08)] text-[.8rem] cursor-pointer rounded-[5px]"
                      onClick={() => {
                        setSelectedCuisine(cuisine);
                        setIsDropdownCuisineOpen(false);
                      }}
                    >
                      {cuisine}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Dropdown Difficulty */}
            <div className="grid gap-[.2em]">
              <span className="text-[.9rem] font-medium">Difficulty Type: <span className="text-red-700">*</span></span>
              <div className="w-full relative" ref={dropdownDifficultyRef}>
                {/* Dropdown Header */}
                <div
                  className="bg-[rgba(0,0,0,0.03)] cursor-pointer w-full h-full rounded-[5px] flex items-center justify-between px-[1em] py-[1em] [border:1px_solid_rgba(0,0,0,0.3)] hover:[border:1px_solid_#e6a820] focus:[border:1px_solid_#e6a820] hover:bg-[rgba(255,163,57,0.1)] focus:bg-[rgba(255,163,57,0.1)]"
                  onClick={() => {
                    setIsDropdownDifficultyOpen(!isDropdownDifficultyOpen);
                  }}
                >
                  <span className="text-[.8rem]">{selectedDifficulty}</span>
                  <span
                    className={`transition-all duration-200 ease flex item-center ${
                      isDropdownDifficultyOpen ? "-rotate-90" : "rotate-90"
                    }`}
                  >
                    <ion-icon name="caret-back-outline"></ion-icon>
                  </span>
                </div>
                {/* Dropdown List */}
                <ul
                  className={`absolute top-[3.5em] left-0 w-full bg-white [border:1px_solid_rgba(0,0,0,0.4)] rounded-[5px] p-[.4em] transition-all duration-150 ease shadow-[0_3px_8px_rgba(0,0,0,0.15)] z-10 ${
                    isDropdownDifficultyOpen
                      ? "opacity-[1] pointer-events-auto translate-y-0"
                      : "opacity-[0] pointer-events-none -translate-y-1.25"
                  }`}
                >
                  {difficultyOptions.map((difficulty) => (
                    <li
                      key={difficulty}
                      className="text-black py-[.8em] pl-[.8em] hover:bg-[rgba(0,0,0,0.08)] text-[.8rem] cursor-pointer rounded-[5px]"
                      onClick={() => {
                        setSelectedDifficulty(difficulty);
                        setIsDropdownDifficultyOpen(false);
                      }}
                    >
                      {difficulty}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* Dropdown Food Type */}
          <div className="grid gap-[.2em] w-full">
            <span className="text-[.9rem] font-medium">Food Type: <span className="text-red-700">*</span></span>
            <div className="w-full relative" ref={dropdownFoodTypeRef}>
              {/* Dropdown Header */}
              <div
                className="bg-[rgba(0,0,0,0.03)] cursor-pointer w-full h-full rounded-[5px] flex items-center justify-between px-[1em] py-[1em] [border:1px_solid_rgba(0,0,0,0.3)] hover:[border:1px_solid_#e6a820] focus:[border:1px_solid_#e6a820] hover:bg-[rgba(255,163,57,0.1)] focus:bg-[rgba(255,163,57,0.1)]"
                onClick={() => {
                  setIsDropdownFoodTypeOpen(!isDropdownFoodTypeOpen);
                }}
              >
                <span className="text-[.8rem]">{selectedFoodType}</span>
                <span
                  className={`transition-all duration-200 ease flex item-center ${
                    isDropdownFoodTypeOpen ? "-rotate-90" : "rotate-90"
                  }`}
                >
                  <ion-icon name="caret-back-outline"></ion-icon>
                </span>
              </div>
              {/* Dropdown List */}
              <ul
                className={`absolute top-[3.5em] left-0 w-full bg-white [border:1px_solid_rgba(0,0,0,0.4)] rounded-[5px] p-[.4em] transition-all duration-150 ease shadow-[0_3px_8px_rgba(0,0,0,0.15)] z-10 overflow-y-auto max-h-32.5 ${
                  isDropdownFoodTypeOpen
                    ? "opacity-[1] pointer-events-auto translate-y-0"
                    : "opacity-[0] pointer-events-none -translate-y-1.25"
                }`}
              >
                {foodTypeOptions.map((foodType) => (
                  <li
                    key={foodType}
                    className="text-black py-[.8em] pl-[.8em] hover:bg-[rgba(0,0,0,0.08)] text-[.8rem] cursor-pointer rounded-[5px]"
                    onClick={() => {
                      setSelectedFoodType(foodType);
                      setIsDropdownFoodTypeOpen(false);
                    }}
                  >
                    {foodType}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex gap-[1em] w-full mt-[1.5em]">
          <button
            onClick={handleCancel}
            className="flex-1 bg-[rgba(0,0,0,0.1)] hover:bg-[rgba(0,0,0,0.15)] active:bg-[rgba(0,0,0,0.1)] text-black font-medium text-[.95rem] px-[1.5em] py-[.8em] rounded-[5px] cursor-pointer outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-[#ffba24] hover:bg-[#ff9d00] active:bg-[#ffae00] text-black font-medium text-[.95rem] px-[1.5em] py-[.8em] rounded-[5px] cursor-pointer shadow-[0_2px_8px_rgba(255,174,0,0.4)] outline-none"
          >
            {submitBtnLabel}
          </button>
        </div>
      </div>
    </>
  );
};

export default RecipeForm;
