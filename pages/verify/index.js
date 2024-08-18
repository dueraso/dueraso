export default {
  layout: 'auth-layout',
  data() {
    return {
      loading: false,
      snackbar: false,
      snackbarColor: 'default',
      otp: '',
      text: '',
      expectedOtp: '133707',
    };
  },
  mounted() {
    console.log(this.$auth.hasScope("admin"))
  },
  methods: {
    onFinish (rsp) {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.snackbarColor = (rsp === this.expectedOtp) ? 'success' : 'warning'
        this.text = `Processed OTP with "${rsp}" (${this.snackbarColor})`
        this.snackbar = true
      }, 3500)
    },
  },
}
