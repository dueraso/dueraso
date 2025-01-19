// middleware/role.js
export default function ({ store, redirect, route }) {
  // const user = store.state.auth.user;
  // if (user === null){
  //   console.log(";;;;")
  //   return
  // }
  // console.log("ใช่มั้ย0>>"+JSON.stringify(user))
  // Check if the user is logged in and has the appropriate role for the route
  // if (!user) {
  //   console.log("ใช่มั้ย1>>"+user.roles.group)
  //
  //   return redirect('/login'); // Redirect to login if not authenticated
  // }
  // // console.log("ใช่มั้ย3>>"+user.roles.group)
  //
  // // If route is `/admin/*`, ensure user is an admin
  // if (route.path.startsWith('/admin') && user.roles.group !== "master") {
  //   console.log("ใช่มั้ย2>>"+user.roles.group)
  //   return redirect('/sign'); // Redirect non-admins away from admin pages
  // }
  // // console.log(route.path.startsWith('/admin')+"<<ใช่มั้ย4>>"+user.roles.group)
  //
  // // If route is `/dashboard/*`, ensure user is not an admin
  // if (route.path.startsWith('/dashboard') && route.path.startsWith('/pos') && user.roles.group !== 'admin') {
  //   return redirect('/login'); // Redirect admins away from regular user pages
  // }
}
