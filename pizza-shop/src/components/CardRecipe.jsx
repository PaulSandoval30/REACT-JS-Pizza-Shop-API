const CardRecipe = ({
  name = "Untitled Pizza", 
  ingredients = [],
  instructions = [],
  cookTimeMinutes,
  cuisine,
  difficulty,
  foodType,
  onEdit,
  onDelete,
}) => {
  
  // normalizeIngredients - Converts ingredients to array format
  // Handles both array and string (comma-separated) inputs
  function normalizeIngredients(value) {
    let result = [];
    if (Array.isArray(value)) {
      result = value;
    } else if (typeof value === "string") {
      result = value.split(",");
      result = result.map((s) => s.trim());
      result = result.filter((s) => s.length > 0);
    }
    return result;
  }


  // normalizeInstructions - Converts instructions to array format
  // Handles both array and string (newline-separated) inputs
  function normalizeInstructions(value) {
    let result = [];
    if (Array.isArray(value)) {
      result = value;
    } else if (typeof value === "string") {
      result = value.split("\n");
      result = result.map((s) => s.trim());
      result = result.filter((s) => s.length > 0);
    }
    return result;
  }

  // Convert ingredients and instructions to normalized array format
  const parsedIngredients = normalizeIngredients(ingredients);
  const parsedInstructions = normalizeInstructions(instructions);

  return (
    <>
      <div className="w-140 bg-white rounded-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.18)] [border:1px_solid_rgba(0,0,0,0.08)] p-[1.2em] flex flex-col gap-[0.8em]">
        {/* Header */}
        <div className="flex items-start justify-between gap-[0.6em]">
          <div className="flex flex-col gap-[0.25em]">
            <h3 className="text-[1.3rem] font-bold text-black/90 leading-tight">
              {name}
            </h3>
            <div className="flex flex-wrap items-center gap-[0.4em] text-[0.75rem] ">
              {foodType && (
                <span className="px-[0.6em] py-[0.35em] rounded-md bg-[rgba(0,183,255,0.12)] text-[rgb(0,79,110)] [border:1px_solid_rgba(0,183,255,0.4)]">
                  {foodType}
                </span>
              )}
              {cuisine && (
                <span className="px-[0.6em] py-[0.35em] rounded-md bg-[rgba(34,197,94,0.12)] text-[rgb(21,128,61)] [border:1px_solid_rgba(34,197,94,0.4)]">
                  {cuisine}
                </span>
              )}
              {difficulty && (
                <span className="px-[0.6em] py-[0.35em] rounded-md bg-[rgba(139,92,246,0.12)] text-[rgb(88,28,135)] [border:1px_solid_rgba(139,92,246,0.4)]">
                  {difficulty}
                </span>
              )}
              {cookTimeMinutes !== undefined && cookTimeMinutes !== null && (
                <span className="px-[0.6em] py-[0.35em] rounded-md bg-[rgba(249,115,22,0.12)] text-[rgb(154,52,18)] [border:1px_solid_rgba(249,115,22,0.4)]">
                  ⏱ {cookTimeMinutes} min
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-[0.5em]">
            <button
              className="px-[0.85em] outline-none cursor-pointer py-[0.45em] rounded-[7px] bg-[rgba(255,157,44,0.19)] hover:bg-[rgba(209,129,37,0.27)] active:bg-[rgba(255,168,70,0.12)] [border:1px_solid_rgba(255,168,70,0.4)] text-[0.85rem] font-semibold text-[rgb(136,72,0)] transition-all duration-150 ease"
              onClick={onEdit}
            >
              Edit
            </button>
            <button
              className="px-[0.85em] outline-none cursor-pointer py-[0.45em] rounded-[7px] bg-[rgba(255,82,82,0.1)] hover:bg-[rgba(255,82,82,0.18)] active:bg-[rgba(255,82,82,0.12)] text-[0.85rem] font-semibold text-[#b00020] [border:1px_solid_rgba(255,82,82,0.35)] transition-all duration-150 ease"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Ingredients as grid chips */}
        <div className="grid gap-[0.45em]">
          <h4 className="text-[0.95rem] font-semibold text-black/80">
            Ingredients:
          </h4>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-[0.4em] text-[0.9rem] text-black/75 max-h-30 overflow-y-auto pr-[.3em]">
            {parsedIngredients.length > 0 ? (
              parsedIngredients.map((item, index) => (
                <div
                  key={index}
                  className="px-[0.75em] py-[0.5em] rounded-lg bg-[rgba(0,0,0,0.04)] [border:1px_solid_rgba(0,0,0,0.08)]"
                >
                  {item}
                </div>
              ))
            ) : (
              <div className="text-black/50">No ingredients listed.</div>
            )}
          </div>
        </div>

        {/* Instructions as grid steps */}
        <div className="grid gap-[0.45em]">
          <h4 className="text-[0.95rem] font-semibold text-black/80">
            Instructions:
          </h4>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[0.5em] overflow-y-auto max-h-50 pr-[0.3em]">
            {parsedInstructions.length > 0 ? (
              parsedInstructions.map((step, index) => (
                <div
                  key={index}
                  className="rounded-[10px] bg-[rgba(0,0,0,0.03)] [border:1px_solid_rgba(0,0,0,0.07)] p-[0.75em] flex gap-[0.6em] items-start"
                >
                  <span className="min-w-7 h-7 rounded-full bg-[#ffba24] text-black font-bold text-[0.85rem] grid place-items-center">
                    {index + 1}
                  </span>
                  <p className="text-[0.9rem] text-black/75 leading-[1.35]">
                    {step}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-black/50">No instructions provided.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CardRecipe;
