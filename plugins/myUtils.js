export default function myUtils(val) {
  if (process.client) {
    console.log(this.$route.fullPath)
    if (JSON.parse(localStorage.getItem("policy")) == null) return

    let po = JSON.parse(localStorage.getItem("policy"))
    if (val === "create") {
      return po.create.indexOf(this.$route.fullPath) !== -1
    } else if (val === "update") {
      return po.update.indexOf(this.$route.fullPath) !== -1
    } else if (val === "delete") {
      return po.delete.indexOf(this.$route.fullPath) !== -1
    }else return false
  }
}
