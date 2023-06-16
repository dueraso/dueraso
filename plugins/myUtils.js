export default function myUtils(val, route) {
  if (process.client) {
    if (JSON.parse(localStorage.getItem("policy")) == null) return

    let policy = JSON.parse(localStorage.getItem("policy"))
    if (val === "create") {
      return policy.create.indexOf(route) !== -1
    } else if (val === "update") {
      return policy.update.indexOf(route) !== -1
    } else if (val === "delete") {
      return policy.delete.indexOf(route) !== -1
    }else return false
  }
}
