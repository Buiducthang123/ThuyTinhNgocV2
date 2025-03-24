// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    '@ant-design-vue/nuxt',
    'tailwindcss',
    '@pinia/nuxt',
    "nuxt-lodash",
    '@nuxt/image',
    '@nuxt/icon',
    'dayjs-nuxt',
  ],
  // set time zone vietnam
  dayjs: {
    locales: ['vi'],
    defaultLocale: 'vi',
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultTimezone: 'Asia/Ho_Chi_Minh',
  },


  runtimeConfig:{
    public:{
      baseURLAPI: process.env.BASE_URL_API || ''
    }
  },

  devServer:{
    port: Number(process.env.PORT) || 3000
  }
})