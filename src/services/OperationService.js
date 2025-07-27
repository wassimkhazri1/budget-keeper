import axios from "axios";
import api from "../components/axiosConfig";

const API_URL = "http://localhost:8080/api/transactions";

const getAllTransactions = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const createTransaction = async (data, token) => {
  const response = await axios.post(API_URL, data, {
    headers: { 
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const deleteTransaction = async (transactionId) => {
  try {
    const response = await axios.delete(`${API_URL}/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'erreur
      if (error.response.status === 404) {
        throw new Error('Transaction non trouvée');
      } else if (error.response.status === 403) {
        throw new Error('Non autorisé à supprimer cette transaction');
      } else {
        throw new Error('Erreur serveur');
      }
    }
    throw error;
  }
};

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



const  Transactions =  {
  getAllTransactions,
  createTransaction,
  deleteTransaction,
  getBudgetByCategory,
};

export default   Transactions;