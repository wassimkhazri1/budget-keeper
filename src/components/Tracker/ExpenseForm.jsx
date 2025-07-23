import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import api from "../axiosConfig"; // 👈 Remplace axios
const ExpenseForm = ({ addExpense }) => {

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Loyer");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await api.get('/budgets', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Vérification du format des données
        if (Array.isArray(response.data)) {
          setBudgets(response.data);
        } else {
          throw new Error("Format de données inattendu");
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError("Impossible de charger les catégories");
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  // Filtrer pour exclure "Total" et ne garder que les noms de catégories
  const filteredCategories = budgets
    .filter(budget => budget.category !== "Total")
    .map(budget => budget.category);

  if (loading) return <div>Chargement des catégories...</div>;
  if (error) return <div className="text-danger">{error}</div>;


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { amount: parseFloat(amount), category }; // Ensure amount is a number
    if (!category || !amount || isNaN(amount)) {
      alert("Please enter a valid category and amount!");
      return;
    }
    try {
      // 👇 Add await here and better error handling
      const response = await api.post("/transactions", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json", // 👈 Add this
        },
        
      });
      setMessage("✅ Transaction ajoutée !");
      setAmount("");
      setCategory("");
    } catch (error) {
      // 👇 Better error logging
      console.error("Full error:", error);
      if (error.response) {
        // Server responded with a status code outside 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        setMessage(
          `❌ Erreur: ${error.response.data.message || "Erreur serveur"}`
        );
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
        setMessage("❌ Pas de réponse du serveur. Vérifiez votre connexion.");
      } else {
        // Something else happened
        console.error("Error:", error.message);
        setMessage("❌ Erreur inattendue.");
      }
    }
  };


  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <form onSubmit={handleSubmit} >
           <div>
      <h3>Enter Your Expenses Here...</h3>
      <Form.Group className="mb-3">
        <Form.Label>Category:</Form.Label>
        <Form.Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          {filteredCategories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </div>
        <div className="form-group mb-3">
          <label>Enter Amount:</label>
          <input
            type="number"
            className="form-control"
            placeholder="Ex: 20"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-50">
          Add
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
