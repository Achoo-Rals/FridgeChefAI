import React from 'react';
import { Clock, Flame, ChevronRight } from 'lucide-react';

export default function RecipeCard({ recipe, onClick }) {
  return (
    <button onClick={onClick}
      className="group text-left bg-card rounded-3xl border border-border/60 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-200 w-full">
      <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 via-accent/8 to-accent/15 flex items-center justify-center relative overflow-hidden">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300 select-none">
          {recipe.emoji || '🍽️'}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-heading font-bold text-lg text-foreground leading-tight line-clamp-2">{recipe.name}</h3>
        {recipe.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{recipe.description}</p>}
        <div className="flex items-center gap-4 mt-3 text-sm">
          {recipe.prep_time && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" /> {recipe.prep_time}
            </span>
          )}
          {recipe.calories != null && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Flame className="w-4 h-4 text-accent" /> {recipe.calories} cal
            </span>
          )}
        </div>
        <div className="mt-4 inline-flex items-center gap-1 text-sm font-heading font-semibold text-primary group-hover:gap-2 transition-all">
          View Recipe <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </button>
  );
}
