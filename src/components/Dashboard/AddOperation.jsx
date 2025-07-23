import React, { useState } from "react";
import Navbar from '../Navbar';
import api from "../axiosConfig"; // 👈 Remplace axios
const AddOperation = () => {
const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Loyer");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
console.log("Token:", token); // 👈 Verify this logs a valid token
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { amount: parseFloat(amount), category }; // Ensure amount is a number
    
    try {
      // 👇 Add await here and better error handling
      const response = await api.post("/transactions",formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json", // 👈 Add this
    
          },
          // withCredentials: true, // Nécessaire pour CORS
        }
      );

      console.log("Response:", response.data);
      setMessage("✅ Transaction ajoutée !");
      setAmount("");
      setCategory("Loyer");
    } catch (error) {
      // 👇 Better error logging
      console.error("Full error:", error);
      if (error.response) {
        // Server responded with a status code outside 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        setMessage(`❌ Erreur: ${error.response.data.message || "Erreur serveur"}`);
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
        <> 
    <Navbar />
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2>Ajouter une Transaction</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Montant (€)</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group mt-3">
          <label>Catégorie</label>
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="Loyer">Loyer</option>
            <option value="Électricité">Électricité</option>
            <option value="Restaurant">Restaurant</option>
            <option value="École">École</option>
            <option value="Courses">Courses</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Ajouter
        </button>
      </form>
    </div>
   </> 
  );
};

export default AddOperation;
