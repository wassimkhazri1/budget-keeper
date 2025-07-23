import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ParticlesBackground from "./ParticlesBackground"; // Ajustez le chemin selon votre structure

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/signin", {
        email,
        password,
      });
      const token = res.data.token;
      localStorage.setItem("token", token);
      navigate("/tracker");
    } catch (err) {
      alert("Email ou mot de passe incorrect !");
    }
  };

  return (
    <div style={{ 
      position: "relative", 
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
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
        {/* <ParticlesBackground /> */}
        <ParticlesBackground bgColor="#000000" />
      </div>
      
      {/* Contenu du formulaire */}
      <div className="container" style={{ 
        maxWidth: "400px",
        backgroundColor: "rgba(255, 255, 255, 0.9)", // Fond légèrement transparent
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 className="mb-4 text-center">Connexion</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Mot de passe</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Se connecter
          </button>
        </form>

        <hr />

        <p className="text-center mt-3">
          Pas encore de compte ?{" "}
          <Link to="/signup" className="btn btn-outline-secondary btn-sm">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;