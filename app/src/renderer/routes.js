export default [
  {
    path: '/',
    name: 'login_bak',
    component: require('components/Login')
  },
  {
    path: '*',
    redirect: '/'
  }
]
