import axios from "axios";

const API_URL = "http://localhost:8080/auth/";

const register = (name, email, password) => {
  return axios.post(API_URL + "signup", {
    name  ,
    email,
    password,
  });
};

const login = async(email, password) => {
  return axios
    .post(API_URL + "login", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
