import React from "react";

const BudgetInput = ({ budget, setBudget }) => {
  const handleChange = (e) => {
    setBudget(Number(e.target.value));
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
    <div className="form-group mb-3">
      <input
        type="number"
        className="form-control"
        placeholder="Enter your budget"
        value={budget}
        onChange={handleChange}
      />
      <p>Your Budget is: {budget.toLocaleString()} Dollars</p>
    </div>
    </div>
  );
};

export default BudgetInput;
