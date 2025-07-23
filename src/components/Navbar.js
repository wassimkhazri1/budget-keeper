// import React from "react";
// import { Link, useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // Ici tu peux nettoyer le token si tu l'utilises
//     navigate("/");
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//       <div className="container">
//         <Link className="navbar-brand" to="/dashboard">Budget Keeper</Link>
//         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav me-auto">
//             <li className="nav-item">
//               <Link className="nav-link" to="/dashboard">Tableau de bord</Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/add-operation">Nouvelle opération</Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/tracker">Tracker</Link>
//             </li>
//           </ul>
//           <button className="btn btn-outline-light" onClick={handleLogout}>Déconnexion</button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ParticlesBackground from "./Auth/ParticlesBackground"; // Chemin relatif ajusté

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Nettoyage du token
    navigate("/");
  };

  return (
    <>
      {/* Conteneur des particules limité à la Navbar */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "56px", // Hauteur exacte de la navbar
        overflow: "hidden",
        zIndex: -1
      }}>
{/* <ParticlesBackground bgColor="#e2d1d1ff" /> */}
<ParticlesBackground bgColor="#d1e2e1ff" />
      </div>

      {/* Navbar principale */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Noir semi-transparent
        backdropFilter: "blur(5px)", // Effet de flou
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/tracker">
            Budget Keeper
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
            </ul>           
            <button 
              className="btn btn-outline-light" 
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-1"></i> Déconnexion
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;