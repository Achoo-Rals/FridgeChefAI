import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
              <ChefHat className="w-5 h-5 text-primary" />
            </div>
            <span className="font-heading font-bold text-lg text-foreground tracking-tight">FridgeChef</span>
          </Link>
          {!isHome && (
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ChefHat className="w-4 h-4" />
              New Scan
            </Link>
          )}
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            FridgeChef — Snap your fridge. Get recipes instantly. 🥦
          </p>
        </div>
      </footer>
    </div>
  );
}
