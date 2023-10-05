<template>
  <div>
    <h1>Callback Page</h1>
    <!-- You can add loading spinner or messages here -->
  </div>
</template>

<script>
export default {
  created() {
    this.getData()
  },
  methods:{
    async getData() {
      try {
        // Use the auth module to complete the Google OAuth authentication
        console.log(this.$route.params)
        await this.$auth.loginWith('google', {
          params: {
            code: this.$route.query.code, // Get the authorization code from the URL
          },
        }).then((res)=>{
          console.log(res)
        this.$router.push('/');
        });
        // Redirect to a protected route or home page
      } catch (error) {
        // Handle authentication error
        console.error('Authentication failed:', error);
      }
    },
  },
  // async asyncData({ app, route }) {
  //   try {
  //     // Use the auth module to complete the Google OAuth authentication
  //     await app.$auth.loginWith('google', {
  //       params: {
  //         code: route.query.code, // Get the authorization code from the URL
  //       },
  //     });
  //     // Redirect to a protected route or home page
  //     console.log("kkkk")
  //     app.router.push('/');
  //   } catch (error) {
  //     // Handle authentication error
  //     console.error('Authentication failed:', error);
  //   }
  // },
};
</script>
