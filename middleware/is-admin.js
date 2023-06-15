export default function ({store, redirect, route, error}) {
  let policy = JSON.parse(store.state.auth.user.roles.policy)
  if (policy) {
    let val = policy.titleBar.find(d => d.diractory === route.fullPath)
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
