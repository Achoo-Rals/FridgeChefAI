import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const DIETARY_OPTIONS = ['Vegan', 'Vegetarian', 'Gluten-free', 'Dairy-free', 'Keto', 'Halal', 'Kosher', 'Pescatarian'];
const PROTEIN_OPTIONS = ['Chicken', 'Beef', 'Plant-based', 'Seafood', 'None'];
const NUTRIENT_OPTIONS = ['High-protein', 'Low-carb', 'Low-sugar', 'High-fiber'];
const MEAL_OPTIONS = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const TIME_OPTIONS = [
  { label: 'Under 15 min', value: '15' },
  { label: 'Under 30 min', value: '30' },
  { label: 'Under 1 hr', value: '60' },
];

function TagGroup({ label, options, selected, onSelect, multi = false }) {
  const toggle = (value) => {
    if (multi) {
      onSelect(selected.includes(value) ? selected.filter(o => o !== value) : [...selected, value]);
    } else {
      onSelect(selected === value ? '' : value);
    }
  };

  return (
    <div>
      <p className="text-xs font-heading font-semibold uppercase tracking-wide text-muted-foreground mb-2.5">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const label = typeof opt === 'string' ? opt : opt.label;
          const isSelected = multi ? selected.includes(value) : selected === value;
          return (
            <button key={value} type="button" onClick={() => toggle(value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                isSelected ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
              }`}>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function FilterPanel({ filters, onChange, onReset }) {
  const [minCal, maxCal] = filters.calorieRange;

  return (
    <div className="bg-card rounded-3xl border border-border/60 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-bold text-foreground">Filters</h3>
        </div>
        <button onClick={onReset} className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="space-y-5">
        <TagGroup label="Dietary" options={DIETARY_OPTIONS} selected={filters.dietary} onSelect={(v) => onChange({ ...filters, dietary: v })} multi />
        <TagGroup label="Protein Source" options={PROTEIN_OPTIONS} selected={filters.protein} onSelect={(v) => onChange({ ...filters, protein: v })} />
        <TagGroup label="Nutrient Focus" options={NUTRIENT_OPTIONS} selected={filters.nutrient} onSelect={(v) => onChange({ ...filters, nutrient: v })} />
        <TagGroup label="Meal Type" options={MEAL_OPTIONS} selected={filters.mealType} onSelect={(v) => onChange({ ...filters, mealType: v })} />
        <TagGroup label="Cooking Time" options={TIME_OPTIONS} selected={filters.cookingTime} onSelect={(v) => onChange({ ...filters, cookingTime: v })} />

        <div>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-xs font-heading font-semibold uppercase tracking-wide text-muted-foreground">Calories</p>
            <p className="text-xs font-medium text-foreground">{minCal}–{maxCal} kcal</p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Min: {minCal}</label>
              <input type="range" min={200} max={1200} step={50} value={minCal}
                onChange={(e) => onChange({ ...filters, calorieRange: [Math.min(Number(e.target.value), maxCal - 50), maxCal] })}
                className="w-full accent-primary cursor-pointer" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Max: {maxCal}</label>
              <input type="range" min={200} max={1200} step={50} value={maxCal}
                onChange={(e) => onChange({ ...filters, calorieRange: [minCal, Math.max(Number(e.target.value), minCal + 50)] })}
                className="w-full accent-primary cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
