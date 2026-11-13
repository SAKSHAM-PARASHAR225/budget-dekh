import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Optimize } from './pages/Optimize';
import { History } from './pages/History';


function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="relative min-h-screen flex flex-col bg-bg">
        {/* Decorative elements */}
        <div className="deco-ring deco-ring-1" />
        <div className="deco-ring deco-ring-2" />

        <Header />
        
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/optimize" element={<Optimize />} />
              <Route path="/history" element={<History />} />

            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
