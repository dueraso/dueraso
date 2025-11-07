<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center">
            Loading..
          </v-col>
        </div>
        <v-container fluid v-if="!loading" style="max-width: 1200px">
          <head-bar :title="headTitle">
          </head-bar>

          <v-row class="m-0">
            <div>
              <div class="content-section introduction">
                <div class="feature-intro">
                  <h1>Steps</h1>
                  <p>Steps components is an indicator for the steps in a wizard workflow. Example below uses nested routes with Steps.</p>
                </div>
              </div>

              <div class="content-section implementation">
                <div class="card">
                  <Steps :model="items" :readonly="true" />
                </div>

                <keep-alive>
                  <router-view :formData="formObject" @prevPage="prevPage($event)" @nextPage="nextPage($event)" @complete="complete" />
                </keep-alive>
              </div>

              <div class="stepsdemo-content">
                <Card>
                  <template #title>
                    Personal Information
                  </template>
                  <template #subtitle>
                    Enter your information
                  </template>
                  <template #content>
                    <p class="p-text-secondary">Enter your information</p>
                    <div class="p-fluid">
                      <div class="field">
                        <label for="firstname">Firstname</label>
                        <InputText id="firstname" v-model="firstname" />
                        <!--                        <small v-show="$v.firstname.$invalid && submitted" class="p-error">Firstname is required.</small>-->
                      </div>
                      <div class="field">
                        <label for="lastname">Lastname</label>
                        <InputText v-model="lastname"/>
                        <!--                        <small v-show="$v.lastname.$invalid && submitted" class="p-error">Lastname is required.</small>-->
                      </div>
                      <div class="field">
                        <label for="age">Age</label>
                        <InputText id="age" v-model="age" />
                        <small v-show="age && submitted" class="p-error">Age should be a number.</small>
                      </div>
                    </div>
                  </template>
                  <template #footer>
                    <div class="grid grid-nogutter justify-content-between">
                      <i></i>
                      <Button label="Next" @click="nextPage(true)" icon="pi pi-angle-right" iconPos="right" />
                    </div>
                  </template>
                </Card>
              </div>
              <!--              <StepsDoc />-->
            </div>

          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style>
b {
  display: block;
}

.p-card-body {
  padding: 2rem;
}

</style>
<script>
import Steps from 'primevue/steps';
import StepsDoc from "./StepsDoc";
import Card from 'primevue/card';
import Button from 'primevue/button';

export default {
  layout: 'auth-layout',

  head() {
    return {
      title: this.headTitle,
    }
  },
  components: {
    Steps,
    Card,
    Button
  },
  data() {
    return {
      headTitle: "บทความ",

      loading:false,
      items: [
        {
          label: "Personal",
          to: "/steps",
        },
        {
          label: "Seat",
          to: "/steps/seat",
        },
        {
          label: "Payment",
          to: "/steps/payment",
        },
        {
          label: "Confirmation",
          to: "/steps/confirmation",
        }
      ],
      formObject: {},
      firstname: '',
      lastname: '',
      age: '',
      submitted: false
    }
  },
  methods:{
    nextPage(isFormValid) {
      this.submitted = true;

      if (!isFormValid) {
        return;
      }
      console.log(isFormValid)
      this.$emit('nextPage', {formData: {firstname: this.firstname, lastname: this.lastname, age: this.age}, pageIndex: 0});
    },
    extPage(event) {
      this.formObject = { ...this.formObject, ...event.formData };

      this.$router.push(this.items[event.pageIndex + 1].to);
    },
    prevPage(event) {
      this.$router.push(this.items[event.pageIndex - 1].to);
    },
    complete() {
      this.$toast.add({severity: "success", summary: "Order submitted", detail: "Dear, " + this.formObject.firstname + " " + this.formObject.lastname + " your order completed."});
    },
  }
}
</script>
