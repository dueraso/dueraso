export default function ({ route }) {
    if(route !== undefined){
      if(store.state.auth.user.ngx_permissions.indexOf('booking.admin') === -1){
        return redirect('/403')
      }
    }
}
