import React from 'react';
import { useState, useEffect } from 'react';


const date = (new Date()).toLocaleDateString();

const SpendingTracker = () => {
  const [formData, setFormData] = useState({ total: 0, budget: 0 });
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ name: "", amount: "" });
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const total = formData.total || 0;
  const initialBudget = formData.budget || 0;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetRemaining = initialBudget - totalExpenses;
    const totalRemaining = total - initialBudget;
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/data`)
      .then((res) => res.json())
      .then((data) => {
        setFormData(data.formData || { total: 0, budget: 0 });
        setExpenses(data.expenses || []);
        if (data.formData?.total) {
        }
      });
  }, []);

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    const total = parseFloat(formData.total);
    const budget = parseFloat(formData.budget);
    if (isNaN(total) || isNaN(budget)) return;

    const newFormData = { total, budget };

    fetch(`${import.meta.env.VITE_API_BASE_URL}/formData`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFormData),
    });

    setFormData(newFormData);
    setShowBudgetForm(false);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const amount = parseFloat(newExpense.amount);
    if (!newExpense.name || isNaN(amount) || amount <= 0) return;

    const newEntry = { ...newExpense, amount };

    fetch(`${import.meta.env.VITE_API_BASE_URL}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry),
    });

    setExpenses([...expenses, newEntry]);
    setNewExpense({ name: "", amount: "" });
    setShowExpenseForm(false);
  };

  return (
    <div className="container">
      <h1 className="heading">Spending Tracker</h1>
      <h2>Current Month: {date}</h2>
      <div className="field-expenses">
        <div className="fields-container">
          <h2 className="label">Tracking</h2>
          <button className="button" onClick={() => setShowBudgetForm(!showBudgetForm)}>
            {showBudgetForm ? "Hide Budget Form" : "Show Budget Form"}
          </button>
          {showBudgetForm && (
            <form onSubmit={handleBudgetSubmit} className="section">
              <div>
                <label className="label">Total Amount:</label>
                <input
                  type="number"
                  value={formData.total.toString()}
                  onChange={(e) => setFormData({ ...formData, total: parseFloat(e.target.value) || 0 })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Budget:</label>
                <input
                  type="number"
                  value={formData.budget.toString()}
                  onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                  className="input"
                />
              </div>

              <button type="submit" className="button">
                Save Budget
              </button>
            </form>
          )}
          <div className="text-left section">
            <div className="box">
              <p className="label"><strong>Balance:</strong> ${total.toFixed(2)}</p>
              <p className="label"><strong>New Balance:</strong> ${totalRemaining.toFixed(2)}</p>
            </div>
            <div className="box">
              <p className="label"><strong>Initial Budget:</strong> ${initialBudget.toFixed(2)}</p>
              <p className="label"><strong>Remaining Budget:</strong> ${budgetRemaining.toFixed(2)}</p>
            </div>
          </div>

          <button className={`button ${initialBudget ? '' : 'disabled'}`} disabled={!initialBudget} onClick={() => setShowExpenseForm(!showExpenseForm)}>
            {showExpenseForm ? "Hide Expense Form" : "Add Expense"}
          </button>

          {showExpenseForm && (
            <form onSubmit={handleAddExpense} className="section">
              <h2 className="label">Add Expense</h2>
              <input
                type="text"
                placeholder="Expense name"
                value={newExpense.name}
                onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                className="input"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="input"
              />
              <button type="submit" className="button">
                Add Expense
              </button>
            </form>
          )}
        </div>
        <div className="expenses">
          <h2 className="label">Expenses:</h2>
          <ul className="expense-list">
            {!expenses.length && <p style={{
              fontSize: '1rem',
              textAlign: 'center',
              padding: '30px',
              fontWeight: '600',
            }}>
                No expenses yet!
              </p>}
            {expenses.map((exp, index) => (
              <li key={index} className="expense-item">
                <span className="expense-name">{exp.name}</span>
                <span className="expense-amount">${exp.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="total-expense">Total Expense Amount: ${totalExpenses.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default SpendingTracker
