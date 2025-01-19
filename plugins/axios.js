import Cookies from 'js-cookie';

export default function ({ $axios }) {
  $axios.onRequest((config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });
}
