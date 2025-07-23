import React, { useEffect, useState } from 'react';
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import Summary from "./Summary";
import ExpenseChart from "./ExpenseChart";
import Navbar from "../Navbar";
import api from "../axiosConfig";
import BudgetForm from './BudgetForm';

const BudgetTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const token = localStorage.getItem("token");


 const [budgets, setBudgets] = useState([]); // Ajoutez cet état pour les budgets
  // const [refreshKey, setRefreshKey] = useState(0); // Clé de rafraîchissement
  const [refreshFlag, setRefreshFlag] = useState(0); // Clé de rafraîchissement
  // Fonction pour rafraîchir les données
  // const refreshData = () => {
  //   setRefreshKey(prev => prev + 1);
  // };


// utils/authHeaders.js (ou dans votre fichier axiosConfig.js)
 const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json"
  };
};

  useEffect(() => {
    // Chargez à la fois les transactions et les budgets
    const loadData = async () => {
      try {
        const [transactionsRes, budgetsRes] = await Promise.all([
          api.get("/transactions", { headers: getAuthHeader() }),
          api.get("/budgets", { headers: getAuthHeader() })
        ]);
        
        setExpenses(transactionsRes.data);
        setBudgets(budgetsRes.data);
      } catch (error) {
        console.error("Erreur de chargement:", error);
      }
    };

 //   loadData();
  // }, [refreshData]); // Déclenché quand refreshKey change
    }, []); // Déclenché quand refreshKey change


  // Fonction pour déclencher le rechargement
  const triggerRefresh = () => {
    setRefreshFlag(prev => !prev);
  };

  useEffect(() => {
    if (token) {
      api.get("/transactions", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json", 
        },
      })
      .then(response => {
        setExpenses(response.data);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des transactions :", error);
      });
    }
  }, [token, refreshFlag]); // Ajout de refreshFlag comme dépendance

  const addExpense = (expense) => {
    api.post("/transactions", expense, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
    .then(() => {
      triggerRefresh(); // Recharge après ajout
    })
    .catch(error => {
      console.error("Erreur lors de l'ajout :", error);
    });
  };

  const deleteExpense = (id) => { // Modifié pour utiliser un ID au lieu d'un index
    api.delete(`/transactions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      triggerRefresh(); // Recharge après suppression
    })
    .catch(error => {
      console.error("Erreur lors de la suppression :", error);
    });
  };

  return (
    <>
      <Navbar />
      <div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
        <div style={{ flex: 1 }}>
          <BudgetForm onBudgetAdded={triggerRefresh} />
          <ExpenseForm addExpense={addExpense} />
        </div>
        <div style={{ flex: 2 }}>
          <ExpenseList expenses={expenses} deleteExpense={deleteExpense} />
          <Summary expenses={expenses} />
        </div>
        <div style={{ flex: 1 }}>
          <ExpenseChart expenses={expenses} />
        </div>
      </div>
    </>
  );
};

export default BudgetTracker;