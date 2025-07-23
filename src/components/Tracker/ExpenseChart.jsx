import React, { useEffect, useState } from 'react';
import api from "../axiosConfig";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ expenses }) => {
  const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      api.get("/transactions", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        withCredentials: true,
      })
      .then(response => {
        setTransactions(response.data);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des transactions :", error);
      });
    }
  }, [token]);

  // Regrouper les transactions par catégorie et calculer le total
  const getGroupedTransactions = () => {
    const grouped = {};
    
    transactions.forEach(transaction => {
      if (!grouped[transaction.category]) {
        grouped[transaction.category] = 0;
      }
      grouped[transaction.category] += transaction.amount;
    });
    
    return grouped;
  };

  const groupedTransactions = getGroupedTransactions();
  const categories = Object.keys(groupedTransactions);
  const amounts = Object.values(groupedTransactions);

  const data = {
    labels: categories,
    datasets: [
      {
        label: "Expenses by Category",
        data: amounts,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#8AFFC1",
          "#B28DFF",
          "#FF9E9E",
          "#FF9F40",
          "#4BC0C0",
          "#9966FF",
          "#FF99CC",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: '400px', margin: '0 auto' }}>
      <h3 style={{ textAlign: 'center' }}>Expenses Breakdown by Category</h3>
      {categories.length > 0 ? (
        <Pie 
          data={data} 
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                  }
                }
              }
            }
          }}
        />
      ) : (
        <p>No expenses to display in chart.</p>
      )}
    </div>
  );
};

export default ExpenseChart;