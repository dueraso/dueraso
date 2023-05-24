export default function ({ store, redirect }) {
  if (store.state.auth.user.roles !== 1 ) {
    return redirect('/')
  }
}
