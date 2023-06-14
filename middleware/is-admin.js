export default function ({store, redirect, route, error}) {
  let policy = JSON.parse(store.state.auth.user.roles.policy)
  if (policy) {
    let val = policy.read.find(d => d.route === route.fullPath)
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
