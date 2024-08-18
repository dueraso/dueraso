export default function ({store, redirect, route, error}) {
  if (store.state.auth.user.roles.group === "admin"/* || store.state.auth.user.roles.id === 2*/) return
  let policy = JSON.parse(store.state.auth.user.roles.policy)
  if (policy) {
    let val = policy.titleBar.find(d => {
      return d.diractory === route.fullPath
    })
    if (val === undefined) {
      error(
        {
          statusCode: 403,
          message: 'ACCESS DENIED'
        }
      )
    }
  } else {
    error(
      {
        statusCode: 403,
        message: 'ACCESS DENIED'
      }
    )
  }
}
