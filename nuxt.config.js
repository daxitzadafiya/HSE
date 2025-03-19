
export default {
  ssr: false,
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        media: 'all',
        rel: 'stylesheet',
        type: 'text/css',
        href: '//cdn.materialdesignicons.com/1.9.32/css/materialdesignicons.min.css'
      },
      {
        rel: 'stylesheet',
        href: '//fonts.googleapis.com/icon?family=Material+Icons'
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Open+Sans:regular%7CRoboto:regular"
      },
      {
        // rel: "stylesheet",
        // href: "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
        // integrity: "sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm",
        // crossorigin: "anonymous"
      },
      {
        rel: "stylesheet",
        href: 'https://use.fontawesome.com/releases/v5.0.1/css/all.css'
      },
      {
        rel: "stylesheet",
        href: 'https://fonts.googleapis.com/css?family=Montserrat&display=swap'
      }
    ],
    script: [
      { src: "https://code.jquery.com/jquery-3.2.1.slim.min.js",
        integrity: "sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN",
        crossorigin: "anonymous"
      },
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js",
        integrity: "sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q",
        crossorigin: "anonymous",
      },
      {
        src: "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js",
        integrity: "sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl",
        crossorigin:"anonymous"
      }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: '~/components/loading.vue',
  loadingIndicator: {
    name: 'rotating-plane',
  },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/main.scss',
    '@/node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css',
    '@/node_modules/froala-editor/css/froala_editor.pkgd.min.css',
    '@/node_modules/froala-editor/css/froala_style.min.css',
    '@/node_modules/dropkiq-ui/dist/dropkiq.css'
    // '@/assets/vendor/wrappixel/monster-admin/4.2.1/assets/plugins/bootstrap/css/bootstrap.min.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/apis/init.js',
    '~/plugins/i18n.js',
    '~/plugins/toaster.js',
    '~/plugins/vuetify.js',
    '~/plugins/moment.js',
    '~/plugins/underscore.js',
    '~/plugins/vee-validate.js',
    '~/plugins/vue2-editor.js',
    '~/plugins/vue2-daterange-picker.js',
    '~/plugins/froala-editor.js',
    '~/plugins/vuedraggable.js',
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
  ],
  /*
  ** Nuxt.js modules
  */
  router: {
    mode:'hash',
    middleware: ['i18n', 'custom-auth']
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    'bootstrap-vue/nuxt',

    // Or if you have custom bootstrap CSS...
    ['bootstrap-vue/nuxt', { css: false }]
  ],
  auth: {
    redirect: {
      callback: '/callback',
      login: true,
      logout: '/login',
      home: false
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    }
  },
  vendor: ['axios', 'vue-i18n','~/plugins/vuetify.js']
};
