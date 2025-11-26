import React, { useState, useEffect } from 'react';
import './HomePage.css';
import Navbar from "./Navbar";

function HomePage() {

    /*=========================================
      DASHBOARD STATES & VALUES
    ===========================================*/

    // ---- FUNDS (MAIN BALANCE) ----
    const [funds, setFunds] = useState(() => {
        const saved = localStorage.getItem('funds');
        return saved ? Number(saved) : 100;
    });

    // ---- TOTAL DEPOSITED ----
    const [totalDeposited, setTotalDeposited] = useState(() => {
        const saved = localStorage.getItem("totalDeposited");
        return saved ? Number(saved) : 0;
    });

    // ---- TOTAL WITHDRAWN ----
    const [totalWithdrawn, setTotalWithdrawn] = useState(() => {
        const saved = localStorage.getItem("totalWithdrawn");
        return saved ? Number(saved) : 0;
    });

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('funds', funds);
    }, [funds]);

    useEffect(() => {
        localStorage.setItem("totalDeposited", totalDeposited);
    }, [totalDeposited]);

    useEffect(() => {
        localStorage.setItem("totalWithdrawn", totalWithdrawn);
    }, [totalWithdrawn]);


    /*=========================================
      BUTTON FUNCTIONS
    ===========================================*/
    // ---- DEPOSIT ----
    const handleDeposit = () => {
        const amount = parseFloat(prompt("Enter deposit amount:"));
        if (!isNaN(amount) && amount > 0) {

            setFunds(prev => prev + amount);
            setTotalDeposited(prev => prev + amount);

        } else {
            alert("Enter a valid number");
        }
    };


    // ---- WITHDRAW ----
    const handleWithdraw = () => {
        const amount = parseFloat(prompt("Enter withdraw amount:"));
        if (!isNaN(amount) && amount > 0) {
            if (amount <= funds) {

                setFunds(prev => prev - amount);
                setTotalWithdrawn(prev => prev + amount);

            } else {
                alert("Insufficient funds");
            }
        } else {
            alert("Enter a valid number");
        }
    };


    // ---- Move To Savings [MTS] ---- [Saves amount in `pendingAdd` so SavingsPage can add it to totalSavings]
    const handleMTS = () => {
        const amount = parseFloat(prompt("Enter amount to move to savings:"));
        if (!isNaN(amount) && amount > 0) {
            if (amount <= funds) {

                // Subtract from funds
                setFunds(prev => prev - amount);

                // Add to pendingAdd (SavingsPage will process it)
                const pending = Number(localStorage.getItem("pendingAdd")) || 0;
                localStorage.setItem("pendingAdd", pending + amount);

                alert(`₱${amount} moved to Savings!`);
            } else {
                alert("Insufficient funds");
            }
        } else {
            alert("Enter a valid number");
        }
    };

    // [DEVTOOL!! REMOVE BEFORE DEPLOY] Resets the totals ahahahaha
    const handleResetTotals = () => {
        if (window.confirm("Reset TOTAL Deposits and Withdrawals to 0?")) {
            setTotalDeposited(0);
            setTotalWithdrawn(0);

            localStorage.setItem("totalDeposited", 0);
            localStorage.setItem("totalWithdrawn", 0);
        }
    };


    /*=========================================
      ACTUAL DASHBOARD
    ===========================================*/

    // ---- DISPLAY FUNDS ----
    const formattedFunds =
        `₱${funds.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;


    return (
        <div className="App">
            <main>
                <div className="Dashboard">
                    <h1 style={{ fontSize: "50px" }}>Percents</h1>
                    <br />

                    <div className="Dashboard-container">

                        {/* COLUMN 1 */}
                        <div className="Dashboard-column">
                            <div className="Funds">
                                <h2 className="Funds-name">Welcome, Spongebob</h2>
                                <h2 className="Funds-value">{formattedFunds}</h2>
                            </div>

                            <div className="Dashbuttons" style={{ display: "flex", gap: "10px" }}>
                                <button style={{ flex: 1 }} onClick={handleMTS}>MTS</button>
                                <button onClick={handleDeposit}>DEPOSIT</button>
                                <button onClick={handleWithdraw}>WITHDRAW</button>
                            </div>

                            <div>
                                <h1>Savings Plans Display</h1>
                            </div>
                        </div>


                        {/* COLUMN 2 */}
                        <div className="Dashboard-column">
                            <h1>GRAPH</h1>
                            <div className="C2-Description">
                                <h3>Total Funds Deposited: {"Php "}
                                    {totalDeposited.toLocaleString("en-PH", {
                                        minimumFractionDigits: 2
                                    })}</h3>
                                <h3>Total Funds Withdrawn: {"Php "}
                                    {totalWithdrawn.toLocaleString("en-PH", {
                                        minimumFractionDigits: 2
                                    })}</h3>

                                <button onClick={handleResetTotals} style={{ marginTop: "10px" }}>
                                    RESET TOTALS
                                </button>

                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

export default HomePage;
