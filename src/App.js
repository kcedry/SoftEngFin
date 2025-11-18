import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './Navbar';
import SavingsPage from './SavingsPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
          <Routes>
            <Route path="/savings" element={<SavingsPage />} />
          </Routes>
      </Router>
      <main>
        <div className="Dashboard">
          <h1>UwU</h1>

          <div className='Dashboard-container'>

            {/* Column 1 */}
            <div className="Dashboard-column">
              <div className="Funds">
                <h1 className='left'> Welcome, Spongebob</h1>
                <h1 className='right'>$100</h1>
              </div>
            </div>

            {/* Column 2 */}
            <div className="Dashboard-column">
              <h1> Hi </h1>
            </div>

          </div>
        </div>
      </main>
    </div> /* APP DIV FINISH */
  );
}

export default App;
