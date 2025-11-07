import Cookies from 'js-cookie';

export default function ({ store, redirect, route }) {
  const tokenAdmin = Cookies.get('auth_token');
  const user = store.state.auth.user;
  if (route.path.startsWith('/admin') && !tokenAdmin) {
    return redirect('/sign'); // ถ้าไม่ได้ล็อกอินให้ไปหน้า login
  }
  if (route.path.startsWith('/dashboard') && !user) {
    return redirect('/login'); // ถ้าไม่ได้ล็อกอินให้ไปหน้า login
  } else if(route.path.startsWith('/dashboard') && user){
    console.log(store.state.auth.user)
    if (store.state.auth.user.status >= 3){
      redirect('/first');
    }
  }
}
