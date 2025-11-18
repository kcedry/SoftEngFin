import React, { useState } from "react";
import "./SavingsPage.css";

export default function SavingsPage() {
  const [totalSavings, setTotalSavings] = useState(0);
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);

  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [customAmounts, setCustomAmounts] = useState({});
  const [generalAmount, setGeneralAmount] = useState("");

  /* ---------------------------------------------------------
     GENERAL SAVINGS FUNCTIONS
  --------------------------------------------------------- */
  const handleGeneralAdd = () => {
    const amount = parseFloat(generalAmount) || 0;
    if (amount <= 0) return;

    setTotalSavings(totalSavings + amount);
    setGeneralAmount("");
  };

  const handleGeneralWithdraw = () => {
    const amount = parseFloat(generalAmount) || 0;
    if (amount <= 0) return;

    setTotalSavings(Math.max(totalSavings - amount, 0));
    setGeneralAmount("");
  };

  /* ---------------------------------------------------------
     GOAL FUNCTIONS
  --------------------------------------------------------- */
  const handleAddMoney = (goalId) => {
    const amount = parseFloat(customAmounts[goalId]) || 0;
    if (amount <= 0) return;

    setGoals(
      goals.map((goal) =>
        goal.id === goalId
          ? { ...goal, current: Math.min(goal.current + amount, goal.target) }
          : goal
      )
    );

    setTotalSavings(totalSavings + amount);
    setCustomAmounts({ ...customAmounts, [goalId]: "" });
  };

  const handleWithdrawMoney = (goalId) => {
    const amount = parseFloat(customAmounts[goalId]) || 0;
    if (amount <= 0) return;

    setGoals(
      goals.map((goal) =>
        goal.id === goalId
          ? { ...goal, current: Math.max(goal.current - amount, 0) }
          : goal
      )
    );

    setTotalSavings(Math.max(totalSavings - amount, 0));
    setCustomAmounts({ ...customAmounts, [goalId]: "" });
  };

  const handleRemoveGoal = (goalId) => {
    if (!window.confirm("Are you sure you want to remove this goal?")) return;

    const goalToRemove = goals.find((g) => g.id === goalId);
    setTotalSavings(Math.max(totalSavings - goalToRemove.current, 0));
    setGoals(goals.filter((goal) => goal.id !== goalId));
  };

  const addNewGoal = () => {
    if (!newGoalName || !newGoalTarget) return;

    const newGoal = {
      id: Date.now(),
      name: newGoalName,
      target: parseFloat(newGoalTarget),
      current: 0,
    };

    setGoals([...goals, newGoal]);
    setNewGoalName("");
    setNewGoalTarget("");
    setShowAddGoal(false);
  };

  const handleAmountChange = (goalId, value) => {
    setCustomAmounts({ ...customAmounts, [goalId]: value });
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */
  return (
    <div className="savingsPage">
      <div className="container">

        {/* ---------------------- GENERAL SAVINGS ---------------------- */}
        <div className="header">
          <div className="generalSection">
            <h2>General Savings</h2>

            <input
              type="number"
              placeholder="Enter amount"
              value={generalAmount}
              onChange={(e) => setGeneralAmount(e.target.value)}
              className="generalInput"
            />

            <div className="buttonGroup">
              <button className="button btnAdd" onClick={handleGeneralAdd}>
                Add to Savings
              </button>

              <button className="button btnWithdraw" onClick={handleGeneralWithdraw}>
                Withdraw
              </button>
            </div>
          </div>

          <div>
            <h1 className="headerTitle">Welcome, Spongebob!</h1>
            <p className="headerText">Track your savings goals</p>
          </div>

          <div className="totalSavings">
            <p className="totalLabel">Total Savings</p>
            <h2 className="totalAmount">
              ₱
              {totalSavings.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
          </div>
        </div>

        {/* ---------------------- GOALS GRID ---------------------- */}
        <div className="goalsGrid">
          {goals.map((goal) => {
            const progress = getProgressPercentage(goal.current, goal.target);

            return (
              <div key={goal.id} className="goalCard">
                <button
                  className="removeButton"
                  onClick={() => handleRemoveGoal(goal.id)}
                >
                  ×
                </button>

                <h3 className="goalTitle">{goal.name}</h3>

                <p className="goalAmount">
                  ₱{goal.current.toLocaleString("en-PH", { minimumFractionDigits: 2 })} /
                  ₱{goal.target.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </p>

                <div className="progressBar">
                  <div className="progressFill" style={{ width: `${progress}%` }} />
                </div>

                <div className="goalInfo">
                  <span>{progress.toFixed(1)}% Complete</span>
                  <span>
                    ₱
                    {(goal.target - goal.current).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    to go
                  </span>
                </div>

                <input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmounts[goal.id] || ""}
                  onChange={(e) => handleAmountChange(goal.id, e.target.value)}
                  className="amountInput"
                />

                <div className="buttonGroup">
                  <button className="button btnAdd" onClick={() => handleAddMoney(goal.id)}>
                    Add
                  </button>
                  <button className="button btnWithdraw" onClick={() => handleWithdrawMoney(goal.id)}>
                    Withdraw
                  </button>
                </div>
              </div>
            );
          })}

          {/* ---------------------- ADD GOAL CARD ---------------------- */}
          {!showAddGoal ? (
            <div className="addGoalCard" onClick={() => setShowAddGoal(true)}>
              <span className="plusIcon">+</span>
              <h3>Add New Goal</h3>
            </div>
          ) : (
            <div className="goalCard">
              <h3 className="goalTitle">Create New Goal</h3>

              <input
                type="text"
                placeholder="Goal Name"
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                className="input"
              />

              <input
                type="number"
                placeholder="Target Amount (₱)"
                value={newGoalTarget}
                onChange={(e) => setNewGoalTarget(e.target.value)}
                className="input"
              />

              <div className="buttonGroup">
                <button className="button btnCreate" onClick={addNewGoal}>
                  Create
                </button>

                <button
                  className="button btnCancel"
                  onClick={() => {
                    setShowAddGoal(false);
                    setNewGoalName("");
                    setNewGoalTarget("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ---------------------- STATS ---------------------- */}
        <div className="stats">
          <div className="statItem">
            <h2 className="statNumber">{goals.length}</h2>
            <p className="statLabel">Active Goals</p>
          </div>

          <div className="statItem">
            <h2 className="statNumber">
              ₱
              {goals
                .reduce((sum, goal) => sum + goal.current, 0)
                .toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </h2>
            <p className="statLabel">Total Saved</p>
          </div>

          <div className="statItem">
            <h2 className="statNumber">
              ₱
              {goals
                .reduce((sum, goal) => sum + goal.target, 0)
                .toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </h2>
            <p className="statLabel">Total Target</p>
          </div>
        </div>

      </div>
    </div>
  );
}
