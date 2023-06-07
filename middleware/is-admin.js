export default function ({store, redirect, route}) {
  let val = JSON.parse(store.state.auth.user.roles.policy).read.find(d => d.route === route.fullPath)
  if (val === undefined) {
    console.log("val> "+JSON.stringify(val))
    // return redirect('/403')
  }
  // if (store.state.auth.user.roles !== 1 ) {
  //   console.log(route)
  //   return redirect('/')
  // }
}
