<script>
// import role from "@/middleware/role";

import auth from "@/middleware/auth";

export default {
  layout: 'admin-layout',
  middleware: auth,
  auth: {
    strategy: 'admin',
  },
  mounted() {
    // setInterval(() => this.trackCookieHistory('facebook'), 1000);
  },
  methods: {
    // trackCookieHistory(cookieName) {
    //   const currentCookie = document.cookie
    //     .split('; ')
    //     .find(row => row.startsWith(cookieName))
    //     ?.split('=')[1];
    //
    //   // Retrieve history from localStorage or start a new array
    //   let history = JSON.parse(localStorage.getItem('cookieHistory') || '{}');
    //
    //   // If the current value has changed, update the history
    //   if (history[cookieName]?.slice(-1)[0] !== currentCookie) {
    //     if (!history[cookieName]) history[cookieName] = [];
    //     history[cookieName].push({value: currentCookie, timestamp: new Date()});
    //     localStorage.setItem('cookieHistory', JSON.stringify(history));
    //   }
    // }
  }
}
// function
// }

// Call this function at intervals or on specific events
</script>

<template>
  <div>
    <p>eeee</p>
  </div>
</template>
