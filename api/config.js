import axios from 'axios'
import serve from "~/api/server";


export default axios.create({
  baseURL: `${serve.api}`,
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${this.$auth.$storage.getLocalStorage('token')}`,
  }
})
