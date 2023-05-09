export default function ({ store, redirect, route }) {
  // console.log("check>"+JSON.stringify(route.id))
  if (store.state.auth.loggedIn) {
    return redirect('/')
  }
}
