// src/services/AuthService.js
import axios from 'axios';

const API_URL = "http://localhost:8080/api/auth/";

const signin = (username, password) => {
  return axios.post(API_URL + "signin", {
    username,
    password,
  });
};

const signout = () => {
  localStorage.removeItem("user");
};

const AuthService = {
  signin,
  signout,
};

export default AuthService;
