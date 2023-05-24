import axios from 'axios'
import serve from "~/api/server";
// const token = sessionStorage.getItem("token");

export default axios.create({
  baseURL: `${serve.api}`,
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${token}`,
  }
})
