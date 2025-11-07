import axios from 'axios'
import serve from "@/con/server";
import Cookies from 'js-cookie';

// const token = sessionStorage.getItem("token");
let token = Cookies.get('auth_token');
export default axios.create({
  baseURL: `${serve.api}`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
})
console.log(token)
