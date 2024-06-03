import colors from "vuetify/es5/util/colors";
import dayjs from "dayjs";
import serve from "./con/server";
import googleOauth from "./con/google_oauht.json";

export default {
  loading: "~/components/LoadingBar.vue",
  // serverMiddleware: ["~/api/auth.js"],
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  // mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  // target: 'server',
  target: "static",
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - dueraso",
    title: "ระบบรายรับ-รายจ่าย",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      {charset: "utf-8"},
      {name: "viewport", content: "width=device-width, initial-scale=1"},
      {hid: "description", name: "description", content: ""},
      {name: "format-detection", content: "telephone=no"},
    ],
    link: [
      {rel: "icon", type: "image/x-icon", href: "/icon1.ico"},
      {
        href: "https://fonts.googleapis.com/css2?family=Athiti:wght@200;300;400;500;600;700&family=Belanosima&family=Indie+Flower&display=swap",
        rel: "stylesheet",
      },
      {
        rel: "stylesheet",
        type: "text/css",
        href: "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
      },
      {
        rel: "stylesheet",
        href: "https://unpkg.com/swiper/swiper-bundle.min.css",
      },
    ],
    script: [
      {
        src: "https://accounts.google.com/o/oauth2/v2/auth",
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/css/custom-vuetify.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "@/plugins/myUtils.js",
    "@/plugins/convert.js",
    "@/plugins/Head-util.js",
    "@/plugins/vue-gates.js",
    // "@/plugins/socket.io.js",
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    // Doc: https://github.com/nuxt/content
    "@nuxt/content",
    "@nuxtjs/auth",
    // '@nuxtjs/auth-next',

    "bootstrap-vue/nuxt",

    "@nuxtjs/google-gtag",

    'nuxt-highcharts',

    // 'socket.io',
  ],

  "google-gtag": {
    id: "G-1GY0045ZV5",
    config: {
      anonymize_ip: true, // anonymize IP
      send_page_view: false, // might be necessary to avoid duplicated page track on page reload
      linker: {
        domains: ["dueraso.com"],
      },
    },
    debug: true, // enable to track in dev mode
    disableAutoPageTrack: false, // disable if you don't want to track each page route with router.afterEach(...).
    additionalAccounts: [
      {
        id: "AW-XXXX-XX", // required if you are adding additional accounts
        config: {
          send_page_view: false, // optional configurations
        },
      },
    ],
  },
  //
  // server: {
  //   host: '0.0.0.0' // default: localhost
  // },

  // serverMiddleware: [
  //   {
  //     path: 'chat',
  //     handler: '~/socket.io'
  //   }
  // ],

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  // baseURL: ' https://nuxtjs-portfolio-workshop.herokuapp.com/api',
  axios: {
    baseURL: serve.api,
    // baseURL: 'http://183.88.227.207:81/gps-api/public/api',
  },

  auth: {
    strategies: {
      google: {
        token: {
          property: "access_token",
        },
        user: {
          property: "data",
        },
        endpoints: {
          login: {
            method: "post",
            url: "https://oauth2.googleapis.com/token",
            propertyName: "access_token",
          },
          user: {
            method: "get",
            url: "https://openidconnect.googleapis.com/v1/userinfo",
            propertyName: "data",
          },
        },
      },

      local: {
        endpoints: {
          login: {
            method: "post",
            url: "login",
            propertyName: "data.token",
          },
          user: {
            method: "get",
            url: "user",
            propertyName: "data",
          },
        },
      },
    },
    redirect: {
      login: "/login",
      home: "/dashboard",
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: "#B27D41",
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  bootstrapVue: {
    bootstrapCSS: false, // Or `css: false`
    bootstrapVueCSS: false, // Or `bvCSS: false`
    // componentPlugins: [
    //   'VBBButtonPlugin'
    // ],
    // directivePlugins: []
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ["vue-google-charts"],
  },
};
