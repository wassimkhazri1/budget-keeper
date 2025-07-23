import React, { useEffect, useState } from 'react';
import api from "../axiosConfig"; // 👈 Remplace axios
// const Summary = ({ budget, expenses }) => {
  const Summary = ({ expenses }) => {
  const totalSpent = expenses.reduce((acc, item) => acc + item.amount, 0);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBudgetByCategory = async (category) => {
  try {
    const token = localStorage.getItem('token');
    
    //  const response = await api.get(`/budgets/${category}`, {
     const response = await api.get('/budgets/Total', {

      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching budget by category:', error);
    throw error;
  }
};



  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const budgetData = await getBudgetByCategory('Total');
        console.log('Fetched budget data:', budgetData); // Vérifiez les données reçues
        setBudget(budgetData);
      } catch (err) {
        console.error('Error fetching budget:', err);
        setError('Failed to load budget data');
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, []);
  if (loading) return <div>Loading budget...</div>;
  if (error) return <div>{error}</div>;
  if (!budget) return <div>No budget data available</div>;
  const remaining = budget.limit - totalSpent;
  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h3>Budget Summary</h3>
      <p>
        💼 <strong>Total Budget:</strong> {budget.limit} $
      </p>
      <p>
        🧾 <strong>Total Spent:</strong> {totalSpent.toLocaleString()} $
      </p>
      <p style={{ color: remaining < 0 ? "red" : "green" }}>
        🏦 <strong>Remaining:</strong> {remaining.toLocaleString()} $
      </p>
    </div>
  );
};

export default Summary;
