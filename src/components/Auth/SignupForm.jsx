import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ParticlesBackground from "./ParticlesBackground"; // Ajustez le chemin selon votre structure

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/signup", formData);
      alert("Compte créé avec succès ! Connectez-vous maintenant.");
      navigate("/");
    } catch (err) {
      alert("Erreur lors de l'inscription. Email peut-être déjà utilisé ?");
    }
  };

  return (
    <div style={{ 
      position: "relative", 
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      {/* Arrière-plan de particules */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1
      }}>
        <ParticlesBackground bgColor="#d1e2e1ff" />
      </div>
      
      {/* Contenu du formulaire */}
      <div className="container" style={{ 
        maxWidth: "500px",
        backgroundColor: "rgba(255, 255, 255, 0.93)",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
      }}>
        <h2 className="mb-4 text-center">Créer un compte</h2>
        <form onSubmit={handleSignup}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Prénom</label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Nom</label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100 py-2">
            Créer le compte
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="mb-0">
            Déjà un compte ?{" "}
            <Link to="/" className="btn btn-link p-0 align-baseline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;