import axios from "axios";

const instance = axios.create({
  baseURL: "https://localhost:7251/",
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
});

export default instance;
