import React, { useState } from "react";

const FilterForm = ({ onClose, onApplyFilters }) => {
  // Arrays to track selected filter values
  const [selectedDifficulties, setSelectedDifficulties] = useState([]); 
  const [selectedCuisines, setSelectedCuisines] = useState([]); 
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]); 
  // Array of difficulty options
  const difficulties = ["Easy", "Medium", "Hard"];

  // Array of cuisine options (sorted alphabetically)
  const cuisines = [
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
    "Vegetarian",
  ];
  
  // Array of food type options (sorted alphabetically)
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

  // handleDifficultyToggle - Adds or removes a difficulty from the selected list
  const handleDifficultyToggle = (difficulty) => {
    setSelectedDifficulties((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty) // Remove if already selected
        : [...prev, difficulty] // Add if not selected
    );
  };

  
   // handleCuisineToggle - Adds or removes a cuisine from the selected list
  const handleCuisineToggle = (cuisine) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine) 
        : [...prev, cuisine] 
    );
  };

  
  // handleFoodTypeToggle - Adds or removes a food type from the selected list
  const handleFoodTypeToggle = (foodType) => {
    setSelectedFoodTypes((prev) =>
      prev.includes(foodType)
        ? prev.filter((f) => f !== foodType) 
        : [...prev, foodType] 
    );
  };

  
  // handleResetFilters - Clears all selected filters
  const handleResetFilters = () => {
    setSelectedDifficulties([]);
    setSelectedCuisines([]);
    setSelectedFoodTypes([]);
  };

  // handleApplyFilters - Applies the selected filters and closes the modal
  const handleApplyFilters = () => {
    onApplyFilters({
      difficulties: selectedDifficulties,
      cuisines: selectedCuisines,
      foodTypes: selectedFoodTypes,
    });
  };

  return (
    <>
      {/* Filter Form Modal Container */}
      <div className="relative bg-white px-[2em] py-[3em] rounded-[18px] shadow-[0_4px_15px_rgba(0,0,0,0.4)] w-200 flex flex-col items-center gap-[1.5em]">
        <span 
          className="absolute top-[1em] right-[1em] p-[.5em] cursor-pointer hover:bg-[rgba(0,0,0,0.05)] rounded-full"
          onClick={onClose}
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </span>
        <h2 className="text-[1.7rem] font-semibold text-shadow-[0_1px_5px_rgba(0,0,0,0.2)]">
          🔍 Filter Recipes
        </h2>

        {/* Form Groups Container */}
        <div className="grid place-items-center gap-[.5em] w-full ">
          {/* Difficulty Filter Group */}
          <div className="grid w-full gap-[.8em] bg-[rgba(0,0,0,0.05)] p-[.7em] rounded-lg [border:1px_solid_rgba(0,0,0,0.3)]">
            <span className="text-[1rem] font-semibold text-black bg-[#ffc341] p-[.5em] pl-[1em] rounded-[5px]">
              Difficulty Level
            </span>
            <div className="grid gap-[.6em] rounded-[5px] p-[.3em] overflow-y-auto max-h-50 ">
              {difficulties.map((difficulty) => (
                <div key={difficulty} className="flex items-center gap-[.8em]">
                  <input
                    type="checkbox"
                    id={`difficulty-${difficulty}`}
                    checked={selectedDifficulties.includes(difficulty)}
                    onChange={() => handleDifficultyToggle(difficulty)}
                    className="w-4.5 h-4.5 cursor-pointer accent-[#ffae00] rounded-[3px]"
                  />
                  <label
                    htmlFor={`difficulty-${difficulty}`}
                    className="text-[.95rem] text-black cursor-pointer font-medium"
                  >
                    {difficulty}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Cuisine and Food Type Groups Container */}
          <div className="grid gap-[.5em] w-full grid-cols-2 ">
            {/* Cuisine Type Filter Group */}
            <div className="grid w-full gap-[.8em] bg-[rgba(0,0,0,0.05)] p-[.7em] rounded-lg [border:1px_solid_rgba(0,0,0,0.3)]">
              <span className="text-[1rem] font-semibold text-black bg-[#ffc341] p-[.5em] pl-[1em] rounded-[5px]">
                Cuisine Type
              </span>
              <div className="grid gap-[.6em] overflow-y-auto max-h-50 px-[.5em]">
                {cuisines.map((cuisine) => (
                  <div key={cuisine} className="flex items-center gap-[.8em]">
                    <input
                      type="checkbox"
                      id={`cuisine-${cuisine}`}
                      checked={selectedCuisines.includes(cuisine)}
                      onChange={() => handleCuisineToggle(cuisine)}
                      className="w-4.5 h-4.5 cursor-pointer accent-[#ffae00] rounded-[3px]"
                    />
                    <label
                      htmlFor={`cuisine-${cuisine}`}
                      className="text-[.8rem] text-black cursor-pointer font-medium"
                    >
                      {cuisine}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Food Type Filter Group */}
            <div className="grid w-full gap-[.8em] bg-[rgba(0,0,0,0.05)] p-[.7em] rounded-lg [border:1px_solid_rgba(0,0,0,0.3)]">
              <span className="text-[1rem] font-semibold text-black bg-[#ffc341] p-[.5em] pl-[1em] rounded-[5px]">
                Food Type
              </span>
              <div className="grid gap-[.6em] overflow-y-auto max-h-50 ">
                {foodTypeOptions.map((foodType) => (
                  <div key={foodType} className="flex items-center gap-[.8em] px-[.5em]">
                    <input
                      type="checkbox"
                      id={`foodtype-${foodType}`}
                      checked={selectedFoodTypes.includes(foodType)}
                      onChange={() => handleFoodTypeToggle(foodType)}
                      className="w-4.5 h-4.5 cursor-pointer accent-[#ffae00] rounded-[3px]"
                    />
                    <label
                      htmlFor={`foodtype-${foodType}`}
                      className="text-[.8rem] text-black cursor-pointer font-medium"
                    >
                      {foodType}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Filter Summary */}
          {(selectedDifficulties.length > 0 || selectedCuisines.length > 0 || selectedFoodTypes.length > 0) && (
            <div className="w-full p-[1em] bg-[rgba(255,174,0,0.1)] rounded-[5px] [border:1px_solid_rgba(255,174,0,1)] mt-[1em]">
              <p className="text-[.9rem] text-black font-medium">
                Active Filters:{" "}
                {selectedDifficulties.length + selectedCuisines.length + selectedFoodTypes.length}
              </p>
              <div className="flex flex-wrap gap-[.5em] mt-[.5em] overflow-y-auto max-h-30">
                {selectedDifficulties.map((d) => (
                  <span
                    key={d}
                    className="bg-[#ffae00] text-black text-[.8rem] px-[.6em] py-[.3em] rounded-[3px] font-medium"
                  >
                    {d}
                  </span>
                ))}
                {selectedCuisines.map((c) => (
                  <span
                    key={c}
                    className="bg-[#ffbe32] text-black text-[.8rem] px-[.6em] py-[.3em] rounded-[3px] font-medium"
                  >
                    {c}
                  </span>
                ))}
                {selectedFoodTypes.map((f) => (
                  <span
                    key={f}
                    className="bg-[#ffbe32] text-black text-[.8rem] px-[.6em] py-[.3em] rounded-[3px] font-medium"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Button Group */}
        <div className="flex gap-[1em] w-full mt-[1em]">
          <button
            onClick={handleResetFilters}
            className="flex-1 bg-[rgba(0,0,0,0.1)] hover:bg-[rgba(0,0,0,0.15)] active:bg-[rgba(0,0,0,0.1)] outline-none text-black font-medium text-[.95rem] px-[1.5em] py-[.8em] rounded-[5px] cursor-pointer"
          >
            Clear Filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex-1 bg-[#ffba24] hover:bg-[#ff9d00] active:bg-[#ffae00] text-black font-medium text-[.95rem] px-[1.5em] py-[.8em] rounded-[5px] cursor-pointer shadow-[0_2px_8px_rgba(255,174,0,0.4)] outline-none"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterForm;
