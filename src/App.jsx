import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Ingredients from '@/pages/Ingredients';
import Recipes from '@/pages/Recipes';
import RecipeDetail from '@/pages/RecipeDetail';

// NOTE: The original base44 AuthProvider / useAuth / UserNotRegisteredError
// logic has been removed since that was tied to the base44 platform.
// If you need login/auth for this app, you'll need to add your own
// auth solution (e.g. Firebase Auth, Clerk, Auth0, or a custom backend).
// Right now the app is fully open / no login required.

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
