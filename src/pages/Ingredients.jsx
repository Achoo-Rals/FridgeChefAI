import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Plus, X, ArrowRight, ArrowLeft, ShoppingBasket } from 'lucide-react';

export default function Ingredients() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ingredients: initial = [], imageUrl } = location.state || {};
  const [ingredients, setIngredients] = useState(initial);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    if (!location.state) navigate('/', { replace: true });
  }, [location.state, navigate]);

  const removeItem = (idx) => setIngredients(prev => prev.filter((_, i) => i !== idx));

  const addItem = () => {
    const trimmed = newItem.trim();
    if (trimmed) { setIngredients(prev => [...prev, trimmed]); setNewItem(''); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addItem(); }
  };

  const findRecipes = () => navigate('/recipes', { state: { ingredients } });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to upload
      </Link>

      <div className="text-center mb-8">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground">Nice haul! Here's what we found 🥦</h1>
        <p className="mt-2 text-muted-foreground">Review the ingredients below — add anything we missed or remove what's wrong.</p>
      </div>

      {imageUrl && (
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-2 border-border shadow-sm">
            <img src={imageUrl} alt="Your fridge" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {ingredients.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-3xl border border-border/60">
          <ShoppingBasket className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">We didn't spot any ingredients. Add them manually below!</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2.5 justify-center">
          {ingredients.map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 pl-3.5 pr-2 py-2 rounded-full bg-card border border-border text-sm font-medium text-foreground shadow-sm">
              {item}
              <button onClick={() => removeItem(idx)} className="w-5 h-5 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground text-muted-foreground flex items-center justify-center transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 max-w-md mx-auto">
        <div className="flex gap-2">
          <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Add an ingredient (e.g. olive oil)"
            className="flex-1 h-12 px-4 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all" />
          <button onClick={addItem} className="w-12 h-12 shrink-0 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mt-10 text-center">
        <button onClick={findRecipes} disabled={ingredients.length === 0}
          className="inline-flex items-center gap-2 h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-heading font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          Find Recipes <ArrowRight className="w-5 h-5" />
        </button>
        <p className="mt-3 text-sm text-muted-foreground">
          {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} ready to cook with
        </p>
      </div>
    </div>
  );
}
