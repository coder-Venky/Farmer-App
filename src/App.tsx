import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { Product, CartItem, User } from './types';
import { products } from './data/products';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { PaymentModal } from './components/PaymentModal';
import { AuthForm } from './components/AuthForm';
import { supabase } from './lib/supabase';

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCartItems(items => {
      const existing = items.find(item => item.product.id === product.id);
      if (existing) {
        return items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...items, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setCartItems(items => items.filter(item => item.product.id !== productId));
  };

  const handleCheckout = () => {
    if (!user) {
      alert('Please sign in to proceed with checkout');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    setShowPayment(false);
    setCartItems([]);
    alert('Order placed successfully! Thank you for supporting local farmers.');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-green-500 text-white py-4 shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <Leaf />
                <h1 className="text-2xl font-bold">FarmersMarket</h1>
              </Link>
              <div className="flex items-center gap-4">
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Sign Out
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <AuthForm type="login" />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <AuthForm type="register" />}
          />
          <Route
            path="/"
            element={
              <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-2/3">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-4">Categories</h2>
                      <div className="flex gap-2 flex-wrap">
                        {categories.map(category => (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full ${
                              selectedCategory === category
                                ? 'bg-green-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={addToCart}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="md:w-1/3">
                    <Cart
                      items={cartItems}
                      onUpdateQuantity={updateQuantity}
                      onRemoveItem={removeItem}
                      onCheckout={handleCheckout}
                    />
                  </div>
                </div>
              </main>
            }
          />
        </Routes>

        {showPayment && (
          <PaymentModal
            total={cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)}
            onClose={() => setShowPayment(false)}
            onComplete={handlePaymentComplete}
          />
        )}
      </div>
    </Router>
  );
}

export default App;