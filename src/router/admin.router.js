// import App from '../App'
import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/admin/layout'
// const cp = (r, url) => { return require.ensure([], () => r(require('@/views' + url)), 'index') }

// const _router = [
//   {path: '', name: 'admin', component: r => cp(r, '/admin/Demo')},
//   {path: '/admin', name: 'index', component: r => cp(r, '/admin/Demo')},
//   {path: '/admin/login', name: 'home', component: r => cp(r, '/admin/login')}
// ]
const systemRouter = [
  {path: '/system/systemMenu', component: () => import('@/views/admin/system/SystemMenu'), name: 'systemMenu', meta: { title: 'systemMenu', icon: 'nested', noCache: true} },
  {path: '/system/systemRole', component: () => import('@/views/admin/system/SystemRole'), name: 'systemRole', meta: { title: 'systemRole', icon: 'peoples', noCache: true} },
  {path: '/system/user', component: () => import('@/views/admin/system/user'), name: 'User', meta: {title: 'user', icon: 'user' } },
  {path: '/system/organ',component: () => import('@/views/admin/system/organ'),name: 'Organ', meta: { title: 'organ', icon: 'organ'} },
  {path: '/system/log',component: () => import('@/views/admin/system/log'),name: 'Log', meta: { title: 'log', icon: 'organ'} }
]


const dutyRouter = [
  {path: '/duty/dutylist',component: () => import('@/views/admin/duty/DutyList'),name: 'dutylist', meta: { title: 'dutylist', icon: 'list'} },

]





Vue.use(Router)
export const constantRouterMap = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/admin/login'),
    hidden: true
  },
  {
    path: '/authredirect',
    component: () => import('@/views/admin/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/admin/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/admin/errorPage/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'index',
    meta: { title: 'dashboard', icon: 'dashboard' },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/admin/Demo'),
        name: 'Dashboard1',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'systemIndex',
    meta: { title: 'system', icon: 'dashboard' },
    children: systemRouter
  },
  {
    path: '/duty',
    component: Layout,
    redirect: '/duty/dutylist',
    name: 'dutyIndex',
    meta: { title: 'duty', icon: 'chart' },
    children: dutyRouter
  },
  {
    path: 'home',
    component: Layout,
    redirect: '/home',
    name: 'homeIndex',
    meta: { title: 'home', icon: 'component' },
    children: [
      {path: '/home', component: () => import('@/views/admin/Home'), name: 'home', meta: { title: 'home', icon: 'component', noCache: true} }
    ]
  }
]

export const asyncRouterMap = [
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: '/index',
        component: () => import('@/views/admin/svg-icons'),
        name: 'Icons',
        meta: { title: 'icons', icon: 'icon', noCache: true }
      }
    ]
  },

  /** When your routing table is too long, you can split it into small modules**/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    hidden: true,
    children: [
      {
        path: '401',
        component: () => import('@/views/admin/errorPage/401'),
        name: 'Page401',
        meta: { title: 'page401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/admin/errorPage/404'),
        name: 'Page404',
        meta: { title: 'page404', noCache: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap, // _router
  base: process.env.NODE_ENV === 'production' ? '/ui-web/' : '/' // ui-web生产环境是tomcat时文件夹的名字
})
