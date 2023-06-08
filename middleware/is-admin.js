import error from "@/layouts/error.vue";

export default function ({store, redirect, route, error}) {
  let val = JSON.parse(store.state.auth.user.roles.policy).read.find(d => d.route === route.fullPath)
  if (val === undefined) {
    console.log("val> "+JSON.stringify(val))
    // <error />
    error({ statusCode: 403, message: 'Post not found' })
    // return redirect('/403')
  }
  // if (store.state.auth.user.roles !== 1 ) {
  //   console.log(route)
  //   return redirect('/')
  // }
}
