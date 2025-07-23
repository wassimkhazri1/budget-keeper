import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import OperationsList from "./components/Dashboard/OperationsList";
import SignupForm from "./components/Auth/SignupForm";
import AddOperation from "./components/Dashboard/AddOperation";
import BudgetTracker from "./components/Tracker/BudgetTracker";

function App() {

  return (

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/dashboard" element={<OperationsList />} />
        <Route path="/add-operation" element={<AddOperation />} />
        <Route path="/tracker" element={<BudgetTracker/>} />
      </Routes>

  );
}

export default App;
