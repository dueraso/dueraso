import colors from "vuetify/es5/util/colors";
import server from "./api/server";

export default {
  target: 'static',
  loading: '~/components/LoadingBar.vue',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'siam amulet collection',
    htmlAttrs: {
      lang: 'th'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // {
      //   rel:"preconnect",
      //   href:"https://fonts.googleapis.com"
      // },
      // {
      //   rel:"preconnect",
      //   href:"https://fonts.gstatic.com"
      // },
      {
        rel: "stylesheet",
        // href: "https://fonts.googleapis.com/css2?family=Sarabun&display=swap",
        href: "https://fonts.googleapis.com/css2?family=Sarabun:wght@500&display=swap",
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // Simple usage
    '@nuxtjs/vuetify',

    '@nuxtjs/google-fonts',
    'nuxt-font-loader',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
    '@nuxtjs/auth',
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/dayjs',
    '@nuxtjs/i18n',
  ],
  i18n: {
    locales: ['th', 'en', 'ch'],
    legacy: false,
    globalInjection: true,
    defaultLocale: 'th',
    vueI18n: {
      fallbackLocale: 'th',
      messages: {
        // eslint-disable-next-line global-require
        th: require('./assets/lang/th.json'),
        // eslint-disable-next-line global-require
        en: require('./assets/lang/en.json'),
        ch: require('./assets/lang/ch.json')
      }
    }
  },

  dayjs: {
    locales: ['th'],
    defaultLocale: 'th',
    defaultTimeZone: 'asia/Bangkok',
    plugins: [
      'utc', // import 'dayjs/plugin/utc'
      'timezone' // import 'dayjs/plugin/timezone'
    ] // Your Day.js plugin
  },

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: server.api,
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            method: 'post',
            url: '/member/login',
            propertyName: 'tokens.code',
          },
          user: {
            method: 'get',
            url: '/member/profile',
            propertyName: 'data',
          },
          logout: false,
        },
      },
    },
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/'
    },
    // plugins: ['@/plugins/auth-lang-redirect.js']
  },

  fontLoader: {
    url: 'https://fonts.googleapis.com/css2?family=Sarabun:wght@500&display=swap',

    prefetch: true,
    preconnect: true
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vue-youtube-embed']
  },
}
