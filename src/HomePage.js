import React, { useState, useEffect } from 'react';
import './HomePage.css';
import Navbar from "./Navbar";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";


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

    // ---- FUNDS HISTORY ----
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem("history");
        return saved ? JSON.parse(saved) : [];
    });

    // Save to all these Data <3 localStorage
    useEffect(() => {
        localStorage.setItem('funds', funds);
    }, [funds]);

    useEffect(() => {
        localStorage.setItem("totalDeposited", totalDeposited);
    }, [totalDeposited]);

    useEffect(() => {
        localStorage.setItem("totalWithdrawn", totalWithdrawn);
    }, [totalWithdrawn]);

    // For the Graph
    const [viewType, setViewType] = useState("deposit");  // deposit | withdraw
    const [viewRange, setViewRange] = useState("daily");  // daily | monthly

    const getAllDaysOfMonth = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-indexed

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const labels = [];

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            labels.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" })); // e.g., "Nov 01"
        }

        return labels;
    };

    const xAxisLabels = getAllDaysOfMonth();

    // GRAPH HELPER FUNCTION FOR CATEGORIZATION
    const graphData = (() => {
        const filtered = history.filter(h => h.type === viewType); // Filter by deposit or withdraw
        const grouped = {}; // Group by date or month

        filtered.forEach(entry => {
            const date = new Date(entry.date);

            // Format key for grouping
            let key;
            if (viewRange === "daily") {
                key = date.toLocaleDateString("en-US", { month: "short", day: "numeric" }); // e.g., "Nov 21"
            } else {
                key = date.toLocaleDateString("en-US", { month: "short", year: "numeric" }); // e.g., "Nov 2025"
            }

            grouped[key] = (grouped[key] || 0) + entry.amount;
        });

        // --- NEW: Generate all labels for current month/day range ---
        let allKeys = [];
        if (viewRange === "daily") {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth(); // 0-indexed
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            allKeys = Array.from({ length: daysInMonth }, (_, i) => {
                const date = new Date(year, month, i + 1);
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            });
        } else {
            // For monthly, you could show all months of the year
            const now = new Date();
            const year = now.getFullYear();
            allKeys = Array.from({ length: 12 }, (_, i) => {
                const date = new Date(year, i, 1);
                return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
            });
        }

        // Map allKeys to final array with amounts, default 0
        return allKeys.map(key => ({
            date: key,
            amount: grouped[key] || 0
        }));
    })();



    /*=========================================
      BUTTON FUNCTIONS
    ===========================================*/
    // ---- DEPOSIT ----
    const handleDeposit = () => {
        const amount = parseFloat(prompt("Enter deposit amount:"));
        if (!isNaN(amount) && amount > 0) {

            setFunds(prev => prev + amount);
            setTotalDeposited(prev => prev + amount);

            setHistory(prev => {
                const updated = [...prev, {
                    type: "deposit",
                    amount,
                    date: new Date().toISOString()
                }];
                localStorage.setItem("history", JSON.stringify(updated));
                return updated;
            });

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

                setHistory(prev => {
                    const updated = [...prev, {
                        type: "withdraw",
                        amount,
                        date: new Date().toISOString()
                    }];
                    localStorage.setItem("history", JSON.stringify(updated));
                    return updated;
                });

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
        `Php ${funds.toLocaleString("en-PH", {
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
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button onClick={() => setViewType("deposit")}>Deposits</button>
                                <button onClick={() => setViewType("withdraw")}>Withdrawals</button>

                                <button onClick={() => setViewRange("daily")}>Daily</button>
                                <button onClick={() => setViewRange("monthly")}>Monthly</button>
                            </div>


                            <h1>GRAPH</h1>
                            <div style={{ width: "100%", height: 300 }}>
                                <LineChart data={graphData} width={500} height={300} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                                    <CartesianGrid strokeDasharray="3 3" />

                                    {/* X-Axis with readable dates */}
                                    <XAxis
                                        dataKey="date"
                                        angle={-45}       // rotate long labels
                                        textAnchor="end"  // align text
                                        interval={0}      // show every label
                                    />

                                    {/* Y-Axis */}
                                    <YAxis
                                        label={{ value: "₱ Amount", angle: -90, position: "insideLeft", offset: 10 }}
                                    />

                                    <Tooltip />

                                    <Line
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#8884d8"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                    />
                                </LineChart>
                            </div>

                            <div className="C2-Description">
                                <h3>Total Funds Deposited: {"Php "}
                                    {totalDeposited.toLocaleString("en-PH", {
                                        minimumFractionDigits: 2
                                    })}</h3>
                                <h3>Total Funds Withdrawn: {"Php "}
                                    {totalWithdrawn.toLocaleString("en-PH", {
                                        minimumFractionDigits: 2
                                    })}</h3>

                                {/* [DEVTOOL] COMMENT THIS BEFORE DEPLOY
                                <button onClick={handleResetTotals} style={{ marginTop: "10px" }}>
                                    RESET TOTALS
                                </button>
                                 [DEVTOOL] COMMENT THIS BEFORE DEPLOY */}

                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

export default HomePage;
