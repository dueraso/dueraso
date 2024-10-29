import Fieldset from 'primevue/fieldset';

export default {
  layout: 'auth-layout',

  head() {
    return {
      title: this.headTitle,
    }
  },
  components:{
    Fieldset
  },
  data() {
    return {
      headTitle: "ข้อมูลพื้นฐาน",

      loading: false,
    }
  },
  methods: {}
}
