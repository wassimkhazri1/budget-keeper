import React, { useEffect, useState } from 'react';

import Navbar from '../Navbar';
import api from "../axiosConfig"; // 👈 Remplace axios
const OperationsList = () => {
   const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      // TransactionDataService.getAllTransactions(token)
          api.get("/transactions", {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json", // 👈 Add this
    
          },
          withCredentials: true, // Nécessaire pour CORS
        })
        .then(response => {
          setTransactions(response.data);
        })
        .catch(error => {
          console.error("Erreur lors du chargement des transactions :", error);
        });
    }
  }, [token]);

  return (
    <>
     <Navbar/>

    <div className="container mt-4">
      <h3>Liste des Transactions</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Montant</th>
            <th>Catégorie</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={tx.id} className={index % 2 === 0 ? 'table-active' : ''}>
              <td>{tx.amount}</td>
              <td>{tx.category}</td>
              <td>{new Date(tx.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </>
  );
};
export default OperationsList;
