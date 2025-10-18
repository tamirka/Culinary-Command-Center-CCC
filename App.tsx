
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { RestaurantProvider } from './context/RestaurantContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Kitchen from './pages/Kitchen';
import Management from './pages/Management';

function App() {
  return (
    <RestaurantProvider>
      <HashRouter>
        <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pos" element={<POS />} />
                <Route path="/kitchen" element={<Kitchen />} />
                <Route path="/management" element={<Management />} />
              </Routes>
            </div>
          </main>
        </div>
      </HashRouter>
    </RestaurantProvider>
  );
}

export default App;
