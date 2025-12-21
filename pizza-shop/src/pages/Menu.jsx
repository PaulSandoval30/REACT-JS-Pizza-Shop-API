import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchAllRecipes, addRecipe, updateRecipe, deleteRecipe } from "../api/recipes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import CardRecipe from "../components/CardRecipe";
import RecipeForm from "../components/RecipeForm";
import FilterForm from "../components/FilterForm";
import DeleteModal from "../components/DeleteModal";

const Menu = () => {
  // Hook to programmatically navigate to different routes
  const navigate = useNavigate();
  
  // Get the query client instance to manually interact with the cache
  const queryClient = useQueryClient();

  // Modal visibility states
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); 
  const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [isEditing, setIsEditing] = useState(false); 
  
  // Recipe operation states
  const [recipeToEdit, setRecipeToEdit] = useState(null); 
  const [recipeToDelete, setRecipeToDelete] = useState(null); 
  const [isDeletingLocal, setIsDeletingLocal] = useState(false);
  
  // Persistent state - Stored in sessionStorage to survive page reloads
  const [addedRecipes, setAddedRecipes] = useState(() => {
    const saved = sessionStorage.getItem("addedRecipes");
    return saved ? JSON.parse(saved) : []; // Parse JSON or return empty array
  });
  const [deletedRecipeIds, setDeletedRecipeIds] = useState(() => {
    const saved = sessionStorage.getItem("deletedRecipeIds");
    return saved ? JSON.parse(saved) : []; // Array of IDs that have been deleted
  });
  const [editedRecipes, setEditedRecipes] = useState(() => {
    const saved = sessionStorage.getItem("editedRecipes");
    return saved ? JSON.parse(saved) : {}; // Object mapping recipe IDs to their edited data
  });

  const [searchTerm, setSearchTerm] = useState(""); 

  // Active filters state
  const [activeFilters, setActiveFilters] = useState({
    difficulties: [],
    cuisines: [],
    foodTypes: [],
  });

  // Sync addedRecipes to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("addedRecipes", JSON.stringify(addedRecipes));
  }, [addedRecipes]);

  // Sync deletedRecipeIds to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("deletedRecipeIds", JSON.stringify(deletedRecipeIds));
  }, [deletedRecipeIds]);

  // Sync editedRecipes to sessionStorage whenever it changes
  // This ensures edited API recipes persist across window focus changes
  useEffect(() => {
    sessionStorage.setItem("editedRecipes", JSON.stringify(editedRecipes));
  }, [editedRecipes]);


  // Fetching recipes from the API using TanStack Query
  const {
    data: fetchedRecipes, 
    isLoading, 
    isError,
    error,
  } = useQuery({
    queryKey: ["recipes"], 
    queryFn: fetchAllRecipes, 
    refetchOnWindowFocus: false, // prevents overwriting manual cache updates
  });


  // Merge local recipes with API recipes and apply all transformations
  const recipes = (() => {
    // Merge: Put locally added recipes first, then API recipes
    const merged = [...addedRecipes, ...(fetchedRecipes || [])];

    // Deduplicate: Use a Set to track seen IDs and avoid duplicates
    const seen = new Set();
    const unique = [];
    
    // Filter and transform each recipe
    for (const recipe of merged) {
      // Skip deleted recipes and duplicates
      if (!deletedRecipeIds.includes(recipe.id) && !seen.has(recipe.id)) {
        seen.add(recipe.id); // Mark this ID as seen
        
        // Apply any edits from editedRecipes for API recipes
        const edited = editedRecipes[recipe.id];
        unique.push(edited || recipe);
      }
    }
    return unique;
  })();

  // Apply search and filters to recipes
  const normalizedTerm = searchTerm.trim().toLowerCase();
  const filteredRecipes = recipes.filter((recipe) => {
    // Search filter: Check if recipe name matches search term
    const matchesSearch = normalizedTerm
      ? ((recipe.name || recipe.title || "").toLowerCase()).includes(normalizedTerm)
      : true;

    // Difficulty filter: If difficulties selected, recipe must match one
    const matchesDifficulty = activeFilters.difficulties.length > 0
      ? activeFilters.difficulties.includes(recipe.difficulty)
      : true;

    // Cuisine filter: If cuisines selected, recipe must match one
    const matchesCuisine = activeFilters.cuisines.length > 0
      ? activeFilters.cuisines.includes(recipe.cuisine)
      : true;

    // Food type filter: If food types selected, recipe must match one
    const matchesFoodType = activeFilters.foodTypes.length > 0
      ? activeFilters.foodTypes.includes(recipe.foodType)
      : true;

    // Recipe pass all active filters
    return matchesSearch && matchesDifficulty && matchesCuisine && matchesFoodType;
  });

  // useMutation hook for adding new recipes
  // DummyJSON doesn't persist changes, so I track locally added recipes in state
  const addRecipeMutation = useMutation({
    mutationFn: addRecipe, 
    onSuccess: (newRecipe) => {
      // Generate a unique client-side ID using timestamp
      const recipeWithId = {
        ...newRecipe,
        // Always assign a local unique ID for added recipes
        id: `added-${Date.now()}`,
      };
      // Add to the front of the addedRecipes array
      setAddedRecipes((prev) => [recipeWithId, ...prev]);
      // Close the modal
      setIsAddRecipeModalOpen(false);
    },
  });

  // useMutation hook for editing/updating existing recipes
  // Handles both local recipes (ID starts with "added-") and API recipes differently
  const editRecipeMutation = useMutation({
    mutationFn: ({ id, data }) => updateRecipe(id, data), 
    onSuccess: (updatedRecipe) => {
      // Check if this is a locally added recipe (ID starts with "added-")
      const isLocalRecipe = typeof recipeToEdit.id === "string" && recipeToEdit.id.startsWith("added-");
      
      if (isLocalRecipe) {
        // For local recipes: Update the addedRecipes state directly
        setAddedRecipes((prev) => {
          const updated = prev.map((recipe) => {
            if (recipe.id === recipeToEdit.id) {
              // Keep the local ID 
              return { ...updatedRecipe, id: recipe.id };
            }
            return recipe;
          });
          return updated;
        });
      } else {
        // For API recipes: Manually update the query cache
        queryClient.setQueryData(["recipes"], (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((recipe) => {
            if (recipe.id === recipeToEdit.id) {
              return updatedRecipe; // Replace with updated version
            }
            return recipe;
          });
        });
        
        // Track the edit in editedRecipes so it persists across window focus
        setEditedRecipes((prev) => ({
          ...prev,
          [recipeToEdit.id]: updatedRecipe, // Store by ID for easy lookup
        }));
      }
      setIsEditing(false);
      setRecipeToEdit(null);
    },
    onError: (error) => {
      window.alert("Failed to update recipe. Please try again.");
    }
  });

  // useMutation hook for deleting recipes
  // Tracks deleted IDs in state to filter them from the display
  const deleteRecipeMutation = useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => {
      // Remove from addedRecipes if it's a local recipe
      setAddedRecipes((prev) => prev.filter((r) => r.id !== recipeToDelete?.id));
      
      // Add ID to deletedRecipeIds array to remember it's deleted
      setDeletedRecipeIds((prev) => [...prev, recipeToDelete?.id]);

      // If this recipe had an edited override, clear it out
      setEditedRecipes((prev) => {
        if (!prev) return prev;
        const next = { ...prev };
        delete next[recipeToDelete?.id];
        return next;
      });
      
      // Invalidate the recipes query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["recipes"] });

      setIsDeleteModalOpen(false);
      setRecipeToDelete(null);
    },
    onError: () => {
      window.alert("Failed to delete recipe. Please try again.");
    }
  });

  // Handler function for confirming recipe deletion
  // Checks if it's a local or API recipe and handles accordingly
  const handleConfirmDelete = () => {
    if (!recipeToDelete) return; // Exit if no recipe selected

    // Check if this is a locally added recipe (ID starts with "added-")
    if (typeof recipeToDelete.id === "string" && recipeToDelete.id.startsWith("added-")) {
      // For local recipes: Delete immediately without API call
      setIsDeletingLocal(true); 
      
      // A brief delay to simulate loading state
      setTimeout(() => {
        setAddedRecipes((prev) => prev.filter((r) => r.id !== recipeToDelete.id));
        setIsDeletingLocal(false);
        setIsDeleteModalOpen(false);
        setRecipeToDelete(null);
      }, 500);
      return;
    }

    // For API recipes: Call the delete mutation
    deleteRecipeMutation.mutate(recipeToDelete.id);
  };

  return (
    <>
      {/* Background Image */}
      <div className="bg-[url('./assets/pizza-bg-2.jpg')] bg-cover bg-center relative min-h-screen">
        {/* Dark Overlay */}
        <div className="absolute w-full h-full bg-black/60"></div>
        {/* Main Content Container */}
        <div className="p-[3em] pb-0 grid relative ">
          <div>
            <button
              className="flex items-center justify-center gap-[.3em] text-black text-start outline-none text-[1rem] px-[1.2em] py-[.5em] bg-[#ffae00] rounded-lg cursor-pointer shadow-[0_2px_25px_rgba(255,174,0,0.4)] hover:translate-x-1 hover:shadow-none hover:bg-[#e69c00] transition-all duration-250 ease"
              onClick={() => {
                navigate("/");
              }}
            >
              <ion-icon name="caret-back-outline"></ion-icon> Back
            </button>
          </div>

          {/* Backdrop Blur Container */}
          <div className="relative bg-transparent backdrop-blur-[5px] h-240 flex-1 rounded-2xl p-[1.5em] mt-[1em] shadow-[0_0_50px_rgba(255,255,255,0.6)]">
            {/* Plain White Container */}
            <div className="bg-white h-full rounded-2xl p-[1em]">
              {/* Navigation Top Bar Container */}
              <div className="flex items-center justify-between gap-[1em] p-[0.5em] h-17.5 pb-[1em] [border-bottom:1px_solid_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-[1em]">
                  <div className="text-[1.3rem] font-semibold text-black">
                    🍕 Crust & Code
                  </div>
                </div>
                {/* Search Input Container */}
                <div className="w-230 h-full relative rounded-[1px] [border-bottom:1px_solid_rgba(0,0,0,0.2)]">
                  <input
                    type="search"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-[.9rem] w-full h-full border-none outline-none pl-[3.5em] pr-[2em] placeholder:text-[rgba(0,0,0,0.6)] "
                  />
                  <span className="absolute top-0 left-0 w-12.5 h-full grid place-items-center text-[2rem] text-[rgba(0,0,0,0.6)]">
                    <ion-icon name="search-outline"></ion-icon>
                  </span>
                </div>

                {/* Filter Button */}
                <div className="flex gap-[.5em] h-full">
                  <button
                    className="bg-[#ffc444] hover:bg-[#ffae00] active:bg-[#ffc444] flex items-center gap-[.5em] font-medium outline-none cursor-pointer rounded-[5px] h-full px-[.9em] shadow-[0_1px_6px_rgba(0,0,0,0.5)]"
                    onClick={() => setIsFilterModalOpen(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                      <path d="M10 3.75a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM17.25 4.5a.75.75 0 0 0 0-1.5h-5.5a.75.75 0 0 0 0 1.5h5.5ZM5 3.75a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75ZM4.25 17a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5h1.5ZM17.25 17a.75.75 0 0 0 0-1.5h-5.5a.75.75 0 0 0 0 1.5h5.5ZM9 10a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1 0-1.5h5.5A.75.75 0 0 1 9 10ZM17.25 10.75a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5h1.5ZM14 10a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM10 16.25a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" />
                    </svg>
                    Add Filters
                  </button>
                  {/* ADD Recipe Button */}
                  <button
                    className="bg-[#ffc444] flex items-center gap-[.5em] hover:bg-[#ffae00] active:bg-[#ffc444] font-medium outline-none cursor-pointer rounded-[5px] h-full px-[.9em] shadow-[0_1px_6px_rgba(0,0,0,0.5)]"
                    onClick={() => setIsAddRecipeModalOpen(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                    </svg>
                    Add New Recipe
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-[.8em] w-full bg-[rgba(0,0,0,0.01)] [border-bottom:1px_solid_rgba(0,0,0,0.2)] p-[.4em]">
                <div className="flex items-center gap-[.3em] px-[1.1em] py-[0.7em] rounded-[5px] bg-[#ffba24] text-black font-semibold text-[0.85rem] shrink-0">
                  <span className="font-medium">Total Recipes:</span>
                  <span className="font-600]">{filteredRecipes.length}</span>
                </div>

                {/* Active Filters Display */}
                <div className="flex items-center gap-[.5em] flex-1 min-w-0">
                  <span className="text-[0.85rem] font-medium text-black/90 shrink-0 [border-left:1px_solid_rgba(0,0,0,0.2)] pl-[.9em]">Active Filters:</span>

                  <div className="flex flex-wrap gap-[.4em] max-h-[2.1em] overflow-y-auto pr-[.3em]">
                    {activeFilters.difficulties.length === 0 &&
                      activeFilters.cuisines.length === 0 &&
                      activeFilters.foodTypes.length === 0 && (
                        <div className="px-[0.8em] py-[0.4em] rounded-md bg-[#e5e7eb] text-[#374151] text-[0.8rem] font-medium border border-[#d1d5db]">
                          None
                        </div>
                      )}

                    {/* Difficulty Filters */}
                    {activeFilters.difficulties.map((difficulty) => (
                      <div
                        key={difficulty}
                        className="flex items-center gap-[.3em] px-[0.8em] py-[0.4em] rounded-[999px] bg-[#312e81] text-white text-[0.8rem] font-medium shadow-[0_4px_12px_rgba(49,46,129,0.22)] border border-white/10 shrink-0"
                      >
                        <span className="font-semibold">Difficulty</span>
                        <span className="text-white/80">{difficulty}</span>
                      </div>
                    ))}

                    {/* Cuisine Filters */}
                    {activeFilters.cuisines.map((cuisine) => (
                      <div
                        key={cuisine}
                        className="flex items-center gap-[.3em] px-[0.8em] py-[0.4em] rounded-[999px] bg-[#1f2937] text-white text-[0.8rem] font-medium shadow-[0_4px_10px_rgba(0,0,0,0.18)] border border-white/10 shrink-0"
                      >
                        <span className="font-semibold">Cuisine</span>
                        <span className="text-white/80">{cuisine}</span>
                      </div>
                    ))}

                    {/* Food Type Filters */}
                    {activeFilters.foodTypes.map((foodType) => (
                      <div
                        key={foodType}
                        className="flex items-center gap-[.3em] px-[0.8em] py-[0.4em] rounded-[999px] bg-[#0f766e] text-white text-[0.8rem] font-medium shadow-[0_4px_10px_rgba(15,118,110,0.22)] border border-white/10 shrink-0"
                      >
                        <span className="font-semibold">Type</span>
                        <span className="text-white/80">{foodType}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Grid Recipes Container */}
              <div className="relative mt-[1em] pb-[1em] max-h-[85%] flex gap-[1em] flex-wrap w-full overflow-auto">
                {isLoading && (
                  <div className="text-[1.2rem] text-center text-black/70 w-full">
                    🍕 Loading recipes...
                  </div>
                )}
                {isError && (
                  <div className="text-[1.2rem] text-center text-red-600 w-full">
                    ⚠️ Error: {error.message}
                  </div>
                )}
                {!isLoading && !isError && filteredRecipes.length === 0 && (
                  <div className="text-[1.2rem] text-center text-black/70 w-full">
                    {searchTerm
                      ? `🔍 No matches for "${searchTerm}".`
                      : "📭 No recipes found."}
                  </div>
                )}
                {!isLoading && !isError && filteredRecipes.length > 0 && filteredRecipes.map((recipe) => (
                    <CardRecipe
                      key={recipe.id}
                      {...recipe}
                      onEdit={() => {
                        setRecipeToEdit(recipe);
                        setIsEditing(true);
                      }}
                      onDelete={() => {
                        setRecipeToDelete(recipe);
                        setIsDeleteModalOpen(true);
                      }}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Recipe Modal */}
      <div
        className={`fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-150 ease ${
          isAddRecipeModalOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`transition-all duration-150 ease ${
            isAddRecipeModalOpen ? "scale-100" : "scale-98"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <RecipeForm
            mode="add"
            onSubmit={(formData) => {
              addRecipeMutation.mutate(formData);
            }}
            onClose={() => setIsAddRecipeModalOpen(false)}
            addRecipeMutation={addRecipeMutation}
          />
        </div>
      </div>

      {/* Edit Recipe Modal */}
      <div
        className={`fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-150 ease ${
          isEditing
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`transition-all duration-150 ease ${
            isEditing ? "scale-100" : "scale-98"
          }`}
          onClick={(e) => e.stopPropagation()}
        > 
          <RecipeForm
            mode="edit"
            initialValues={recipeToEdit || {}}
            onSubmit={(formData) => {
              // Check if this is a local recipe (ID starts with "added-")
              const isLocalRecipe = typeof recipeToEdit.id === "string" && recipeToEdit.id.startsWith("added-");
              
              if (isLocalRecipe) {
                // For local recipes, just update the state directly
                const updatedRecipe = {
                  ...formData,
                  id: recipeToEdit.id,
                  foodType: formData.tags?.[0] || recipeToEdit.foodType
                };
                setAddedRecipes((prev) => {
                  const updated = prev.map((recipe) => {
                    if (recipe.id === recipeToEdit.id) {
                      return updatedRecipe;
                    }
                    return recipe;
                  });
                  return updated;
                });
                setIsEditing(false);
                setRecipeToEdit(null);
              } else {
                // For API recipes, Call the edit mutation
                editRecipeMutation.mutate({ id: recipeToEdit.id, data: formData });
              }
            }}
            onClose={() => {
              setIsEditing(false);
              setRecipeToEdit(null);
            }}
            editRecipeMutation={editRecipeMutation}
          />
        </div>
      </div>

      {/* Filter Modal */}
      <div
        className={`fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-150 ease ${
          isFilterModalOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`transition-all duration-150 ease ${
            isFilterModalOpen ? "scale-100" : "scale-98"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <FilterForm 
            onClose={() => setIsFilterModalOpen(false)}
            onApplyFilters={(filters) => {
              setActiveFilters(filters);
              setIsFilterModalOpen(false);
            }}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div
        className={`fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-150 ease ${
          isDeleteModalOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`transition-all duration-150 ease ${
            isDeleteModalOpen ? "scale-100" : "scale-98"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <DeleteModal
            onClose={() => {
              setIsDeleteModalOpen(false);
              setRecipeToDelete(null);
            }}
            onConfirm={handleConfirmDelete}
            isLoading={deleteRecipeMutation.isPending || isDeletingLocal}
          />
        </div>
      </div>
    </>
  );
};

export default Menu;
