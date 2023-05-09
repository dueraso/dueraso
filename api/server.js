const  local = {
  redirectUri : "http://localhost:3000/callback",
  url : "http://localhost:3000",
  api : "http://183.88.227.207:8084/admin/api",
  // upload : "http://183.88.227.207:81/monk-api/public/api",
}
const  lan = {
  api : "http://10.10.19.235/siam-amulet/api",
  // upload : "http://183.88.227.207:81/monk-api/public/api",
}
const  production = {
  redirectUri : "https://siamamuletcollection.com/callback",
  api : "https://siamamuletcollection.com/admin/api",
  // upload : "http://183.88.227.207:81/monk-api/public/api",
}

module.exports = production
