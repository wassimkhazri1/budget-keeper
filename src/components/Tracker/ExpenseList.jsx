import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import Transactions from "../../services/OperationService";
import { Table, Form, Button, Pagination } from "react-bootstrap";
import { BiTrash } from "react-icons/bi";

const ExpenseList = ({ expenses, onTransactionDeleted }) => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const token = localStorage.getItem("token");

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter((transaction) => {
    return (
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm) ||
      new Date(transaction.date)
        .toLocaleString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });
console.log("--------search Term: ", searchTerm);
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  console.log("This search result: ", filteredTransactions);

  // Calcul du total des dépenses filtrées
  const totalAmount = filteredTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );



  const handleDelete = async (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette transaction ?")
    ) {
      try {
        await Transactions.deleteTransaction(id);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        onTransactionDeleted && onTransactionDeleted(id);
      } catch (error) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  useEffect(() => {
    if (token) {
      api
        .get("/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((response) => {
          setTransactions(response.data);
        })
        .catch((error) => {
          console.error("Erreur lors du chargement des transactions :", error);
        });
    }
  }, [token]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await api.get("/budgets", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
    .filter((budget) => budget.category !== "Total")
    .map((budget) => budget.category);

  if (loading) return <div>Chargement des catégories...</div>;
  if (error) return <div className="text-danger">{error}</div>;


  // Filtrer pour exclure "Total" et ne garder que les noms de catégories
  const filteredCategoriesLimit = budgets
    .filter((budget) => budget.category === searchTerm)
    .map((budget) => budget.limit);

  if (loading) return <div>Chargement des catégories...</div>;
  if (error) return <div className="text-danger">{error}</div>;


console.log("*****This limit filtred: ", filteredCategoriesLimit);
const remaining = filteredCategoriesLimit - totalAmount;

  return (
    <div className="mt-4">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h3>List of Expenses</h3>
        <Form.Group className="mb-3" style={{ width: "300px" }}>
          <Form.Select
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            required
          >
            <option value="">Select a category</option>
            {filteredCategories.map((cat, index) => (
              <option key={index} value={cat}  >
                {cat}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>

      {transactions.length === 0 ? (
        <p>No expenses recorded.</p>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((expense, index) => (
                <tr key={index}>
                  <td>💰 {expense.category}</td>
                  <td>{new Date(expense.date).toLocaleString()}</td>
                  <td>
                    {expense.amount.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <BiTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {filteredTransactions.length > itemsPerPage && (
            <Pagination className="justify-content-center mt-3">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
              />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i}
                  active={i + 1 === currentPage}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
              />
            </Pagination>
          )}
                        <div className="mt-3 mb-3">
                <strong>Total des dépenses filtrées : </strong>
                {totalAmount.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </div>
                <div className="mt-3 mb-3">
                <strong>Limit des dépenses filtrées : </strong>
                {filteredCategoriesLimit.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </div>
              <div className="mt-3 mb-3">
                    <p style={{ color: remaining < 0 ? "red" : "green" }}>
        🏦 <strong>Remaining:</strong> {remaining.toLocaleString()} $
      </p>
      </div>
        </>
      )}
    </div>
  );
};

export default ExpenseList;
