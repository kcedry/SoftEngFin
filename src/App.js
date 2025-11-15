import React from 'react';
import './App.css';
import Navbar from './Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <div className="Dashboard">
          <h1>Hello!</h1>
         
            <h1>$100</h1>

            <div className='Dashboard-container'>

              {/* Column 1 */}
              <div className="Dashboard-column">
                <div className="Funds">Hi</div>
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
