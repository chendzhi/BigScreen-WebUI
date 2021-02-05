import router from './routers'


router.beforeEach((to, from, next) => {
  next()
})

router.afterEach((to,from,next) => {})
