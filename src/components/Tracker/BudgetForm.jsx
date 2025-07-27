import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';
import Transactions from "../../services/OperationService";
import { Modal, Button, Form, Alert, Table, Pagination } from 'react-bootstrap';
import { BiTrash, BiEdit } from 'react-icons/bi';

const BudgetForm = () => {
  const [budgets, setBudgets] = useState([]);
  const [totalBudget, setTotalBudget] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: ''
  });
   const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');



  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter transactions based on search term
  const filteredTransactions = budgets.filter(transaction => {
    return (
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm) ||
      new Date(transaction.date).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);




  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await api.get('/budgets', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBudgets(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des budgets');
      console.error(err);
    }
  };

    useEffect(() => {
    const fetchBudget = async () => {
      try {
        const budgetData = await Transactions.getBudgetByCategory('Total');
        // console.log('Fetched budget data:', budgetData); // Vérifiez les données reçues
        setTotalBudget(budgetData);
      } catch (err) {
        console.error('Error fetching budget:', err);
        setError('Failed to load budget data');
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, []);
  if (loading) return <div>Loading budget...</div>;
  if (error) return <div>{error}</div>;
  if (!totalBudget) return <div>No budget data available</div>;
  const totalLimit = budgets
  .filter(budget => budget.category !== 'Total') // Exclude 'Total' category
  .reduce((sum, budget) => sum + budget.limit, 0); // Sum the remaining limits
  const remaining = totalBudget.limit - totalLimit;
 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBudget(prev => ({
      ...prev,
      [name]: name === 'limit' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newBudget.category || !newBudget.limit) {
      setError('Veuillez remplir tous les champs');
      return;
    }else if(remaining <  newBudget.limit){
      alert(`Veuillez saisir un montant qui est inferieur ou égal à ${remaining}`);
      return;
    }

    try {
      const response = await api.post('/budgets', newBudget, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setBudgets([...budgets, response.data]);
      setSuccess('Budget créé avec succès');
      setNewBudget({ category: '', limit: '' });
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du budget');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) {
      try {
        await api.delete(`/budgets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBudgets(budgets.filter(budget => budget.id !== id));
        setSuccess('Budget supprimé avec succès');
        window.location.reload();
      } catch (err) {
        setError('Erreur lors de la suppression du budget');
        console.error(err);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Budget Management</h2>
        <Button variant="primary" onClick={() => {if(remaining > 0){setShowModal(true);} else{setError('You have enough amount to spend');}}}>
          Create a new budget
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}



    <div style={{ marginTop: "1.5rem" }}>
      <h3>Budget Summary</h3>
      <p>
        💼 <strong>Total Budget:</strong> {totalBudget.limit} $
      </p>
      <p>
        🧾 <strong>Total Limit:</strong> {totalLimit.toLocaleString()} $
      </p>
      <p style={{ color: remaining < 0 ? "red" : "green" }}>
        🏦 <strong>Remaining:</strong> {remaining.toLocaleString()} $
      </p>
    </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Category</th>
            <th>Limit (€)</th>
            <th>Actions</th>
          </tr>
        </thead>
            <tbody>
              {/* {budgets.length > 0 ? ( */}
              {currentItems.map((budget, index) => (
                <tr key={index}>
                  <td>💰 {budget.category}</td>
                  <td>{budget.limit} €</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(budget.id)}
                    >
                      <BiTrash />
                    </Button>
                  </td>
                </tr>
              ))}
                        {/* ) : (
            <tr>
              <td colSpan="3" className="text-center">Aucun budget défini</td>
            </tr>
          )} */}
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









      {/* Modal pour créer un nouveau budget */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nouveau Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Catégorie</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={newBudget.category}
                onChange={handleInputChange}
                placeholder="Alimentation, Transport..."
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Limite (€)</Form.Label>
              <Form.Control
                type="number"
                name="limit"
                value={newBudget.limit}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                // placeholder="100.00"
                placeholder= {(remaining >=  newBudget.limit)? newBudget.limit : `Le montant saisi ne peut pas dépasser ${remaining}`}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BudgetForm;