import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Clock, Flame, Users, ArrowLeft, ListChecks, Salad } from 'lucide-react';

export default function RecipeDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.recipe) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🍽️</div>
        <h1 className="font-heading font-bold text-2xl text-foreground">Recipe not found</h1>
        <p className="mt-2 text-muted-foreground">This recipe may have expired. Try generating new ones!</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
          Start over
        </Link>
      </div>
    );
  }

  const { recipe } = state;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <button onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to recipes
      </button>

      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/12 via-accent/10 to-accent/15 p-8 sm:p-12 text-center mb-8">
        <div className="text-7xl sm:text-8xl mb-3 select-none">{recipe.emoji || '🍽️'}</div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground leading-tight">{recipe.name}</h1>
        {recipe.description && <p className="mt-2 text-muted-foreground max-w-lg mx-auto">{recipe.description}</p>}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {recipe.prep_time && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-card/80 text-sm font-medium text-foreground">
              <Clock className="w-4 h-4 text-primary" /> {recipe.prep_time}
            </span>
          )}
          {recipe.calories != null && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-card/80 text-sm font-medium text-foreground">
              <Flame className="w-4 h-4 text-accent" /> {recipe.calories} cal
            </span>
          )}
          {recipe.servings && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-card/80 text-sm font-medium text-foreground">
              <Users className="w-4 h-4 text-primary" /> {recipe.servings} servings
            </span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-heading font-bold text-xl text-foreground flex items-center gap-2 mb-4">
            <Salad className="w-5 h-5 text-primary" /> Ingredients
          </h2>
          <ul className="space-y-2.5">
            {recipe.ingredients?.map((ing, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-foreground text-sm sm:text-base">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" /> {ing}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-heading font-bold text-xl text-foreground flex items-center gap-2 mb-4">
            <ListChecks className="w-5 h-5 text-primary" /> Instructions
          </h2>
          <ol className="space-y-4">
            {recipe.instructions?.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-heading font-bold flex items-center justify-center">{idx + 1}</span>
                <p className="text-foreground leading-relaxed text-sm sm:text-base pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
