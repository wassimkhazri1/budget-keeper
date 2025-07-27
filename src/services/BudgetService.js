import api from "../components/axiosConfig";


        const getAllBudget = await api.get('/budgets', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
