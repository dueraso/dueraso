import colors from "vuetify/es5/util/colors";
import server from "./api/server";

export default {
  loading: '~/components/LoadingBar.vue',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - Zoom ระบบจอง",
    title: "YRU Zoom",
    htmlAttrs: {
      lang: "en"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" }
    ],
    link: [
      {
        rel: "icon", type: "image/x-icon", href: "/logo.ico"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sarabun:wght@100&display=swap",
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'
      }]
  },
  target: "static",
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify"
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    "bootstrap-vue/nuxt",
  ],

  axios: {
    // baseURL: ' https://nuxtjs-portfolio-workshop.herokuapp.com/api',
    baseURL: server.api,
  },

  auth: {
    // cookie: true,
    strategies: {
      social: {
        scheme: 'oauth2',
        endpoints: {
          authorization: 'https://passport.yru.ac.th/oauth/authorize',
          userInfo: 'https://passport.yru.ac.th/apis/v1/identity/userinfo',
          logout: `https://passport.yru.ac.th/auth/client-logout?redirect_uri=${server.redirectUri}?logout`
        },
        responseType: 'code',
        redirectUri: server.redirectUri,
        clientId: server.clientId,
        scope: ['*'],
      },
      local: {
        token: {
          property: "access_token",
        },
        user: {
          property: "data",
        },
        endpoints: {
          login: {
            method: 'post',
            url: 'https://passport.yru.ac.th/oauth/token',
            propertyName: 'access_token',
          },
          user: {
            method: 'get',
            url: 'https://passport.yru.ac.th/apis/v1/identity/userinfo',
            propertyName: 'data',
          },
        },
      },
    },
    redirect: {
      login: '/login',
      // logout: `https://passport.yru.ac.th/auth/client-logout?redirect_uri=${server.redirectUri}?logout`,
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
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
  }
};
