import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import FilterPanel from '@/components/FilterPanel';
import RecipeCard from '@/components/RecipeCard';
import { SlidersHorizontal, Loader2, UtensilsCrossed } from 'lucide-react';

const DEFAULT_FILTERS = {
  dietary: [], protein: '', nutrient: '', calorieRange: [200, 1200], mealType: '', cookingTime: '',
};

function buildPrompt(ingredients, filters) {
  let prompt = `You are a creative and practical home chef. The user has these ingredients available: ${ingredients.join(', ')}.\n\n`;
  prompt += `Assume common pantry staples are available (salt, pepper, oil, water, basic spices).\n\n`;
  prompt += `Generate 6 delicious recipes the user can make. Each recipe should primarily use the listed ingredients.\n\n`;

  const constraints = [];
  if (filters.dietary.length) constraints.push(`Dietary restrictions: ${filters.dietary.join(', ')}`);
  if (filters.protein) constraints.push(`Preferred protein: ${filters.protein}`);
  if (filters.nutrient) constraints.push(`Nutritional focus: ${filters.nutrient}`);
  if (filters.mealType) constraints.push(`Meal type: ${filters.mealType}`);
  if (filters.cookingTime) constraints.push(`Max cooking time: under ${filters.cookingTime} minutes`);
  constraints.push(`Calories per serving should be between ${filters.calorieRange[0]} and ${filters.calorieRange[1]} kcal`);

  if (constraints.length) {
    prompt += `Apply these constraints:\n${constraints.map(c => '- ' + c).join('\n')}\n\n`;
  }

  prompt += `For each recipe provide:\n`;
  prompt += `- name: a catchy, appetizing name\n- description: one short sentence (max 100 chars)\n`;
  prompt += `- prep_time: total time as a string like "25 min" or "1 hr 10 min"\n`;
  prompt += `- calories: integer, calories per serving\n- protein_source: main protein\n`;
  prompt += `- meal_type: one of "Breakfast", "Lunch", "Dinner", "Snack"\n`;
  prompt += `- emoji: a single food emoji that represents the dish\n- servings: integer\n`;
  prompt += `- ingredients: full list of ingredients with quantities needed\n`;
  prompt += `- instructions: numbered step-by-step cooking instructions\n\n`;
  prompt += `Return exactly 6 recipes. Make them varied and interesting.`;

  return prompt;
}

export default function Recipes() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ingredients = [] } = location.state || {};
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const isFirstRender = useRef(true);

  const generateRecipes = useCallback(async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/invoke-llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: buildPrompt(ingredients, currentFilters),
          schema: {
            type: "object",
            properties: {
              recipes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" }, description: { type: "string" },
                    prep_time: { type: "string" }, calories: { type: "number" },
                    protein_source: { type: "string" }, meal_type: { type: "string" },
                    emoji: { type: "string" }, servings: { type: "number" },
                    ingredients: { type: "array", items: { type: "string" } },
                    instructions: { type: "array", items: { type: "string" } },
                  }
                }
              }
            }
          }
        })
      });

      if (!response.ok) throw new Error('Request failed');

      const result = await response.json();
      setRecipes(result?.recipes || []);
    } catch (err) {
      console.error(err);
      setError('We couldn\u2019t generate recipes right now. Please try again.');
      setRecipes([]);
    }
    setLoading(false);
  }, [ingredients]);

  useEffect(() => {
    if (ingredients.length === 0) { navigate('/', { replace: true }); return; }
    if (isFirstRender.current) {
      isFirstRender.current = false;
      generateRecipes(filters);
      return;
    }
    const timeout = setTimeout(() => generateRecipes(filters), 700);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleReset = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link to="/ingredients" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <SlidersHorizontal className="w-4 h-4 rotate-180" /> Edit ingredients
        </Link>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground mt-2">Your recipes</h1>
        <p className="mt-1 text-muted-foreground">
          Based on {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} — tweak the filters to personalize
        </p>
      </div>

      <button onClick={() => setShowMobileFilters(v => !v)}
        className="lg:hidden inline-flex items-center justify-center gap-2 h-11 w-full rounded-2xl bg-card border border-border font-medium text-sm mb-4">
        <SlidersHorizontal className="w-4 h-4" /> {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
        <aside className={`${showMobileFilters ? 'block' : 'hidden'} lg:block lg:sticky lg:top-20 lg:self-start`}>
          <FilterPanel filters={filters} onChange={setFilters} onReset={handleReset} />
        </aside>

        <div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="font-heading font-semibold text-lg text-foreground">Cooking up ideas…</p>
              <p className="text-sm text-muted-foreground mt-1">Personalizing recipes to your ingredients</p>
            </div>
          ) : error ? (
            <div className="text-center py-24">
              <p className="text-muted-foreground mb-4">{error}</p>
              <button onClick={() => generateRecipes(filters)}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                Try again
              </button>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-24">
              <UtensilsCrossed className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No recipes found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {recipes.map((recipe, idx) => (
                <RecipeCard key={idx} recipe={recipe}
                  onClick={() => navigate('/recipe/' + idx, { state: { recipe, ingredients } })} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
