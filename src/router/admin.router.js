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
  {path: '/system/systemMenu', component: () => import('@/views/admin/system/SystemMenu'), name: 'systemMenu', meta: { title: '菜单管理', icon: 'nested', noCache: true} },
  {path: '/system/systemRole', component: () => import('@/views/admin/system/SystemRole'), name: 'systemRole', meta: { title: '角色管理', icon: 'peoples', noCache: true} },
  {path: '/system/user', component: () => import('@/views/admin/system/user'), name: 'User', meta: {title: '用户管理', icon: 'user' } },
  {path: '/system/organ',component: () => import('@/views/admin/system/organ'),name: 'Organ', meta: { title: '部门管理', icon: 'organ'} },
  {path: '/system/log',component: () => import('@/views/admin/system/log'),name: 'Log', meta: { title: '日志管理', icon: 'organ'} }
]

const emergencyRouter = [
  {path: '/emergency/emergencyPlan', component: () => import('@/views/admin/emergency/emergencyPlan'), name: 'emergencyPlan', meta: { title: '预案管理', icon: 'nested', noCache: true} },
  {path: '/emergency/emergencyEvent', component: () => import('@/views/admin/emergency/emergencyEvent'), name: 'emergencyEvent', meta: { title: '事件管理', icon: 'nested', noCache: true} }
]


const dutyRouter = [
  {path: '/duty/dutylist',component: () => import('@/views/admin/duty/DutyList'),name: 'dutylist', meta: { title: '值班列表', icon: 'list'} },
  {path: '/duty/dutyPerson',component: () => import('@/views/admin/duty/DutyPerson'),name: 'dutyPerson', meta: { title: '人员登记', icon: 'list'} },
  {path: '/duty/dutyArrange',component: () => import('@/views/admin/duty/DutyArrange'),name: 'dutyArrange', meta: { title: '值班安排', icon: 'nested'} },
  
]
const waterRouter = [
  {path: '/water/deliverymanage',component: () => import('@/views/admin/water/DeliveryManage'),name: 'deliveryManage', meta: { title: '水雨情录入', icon: 'list'} },
  
]

const eneralizeRouter = [
  {path: '/eneralize/intake',component: () => import('@/views/admin/eneralize/intake'),name: 'intake', meta: { title: '取水概化图', icon: 'list'}},
  {path: '/eneralize/intake/intakeData',component: () => import('@/views/admin/eneralize/intake/intakeData'),name: 'intakeData', meta: { title: '数据管理', icon: 'list'}}
]

const schedulingRouter = [
  {path: '/scheduling/SchedulingPlan',component: () => import('@/views/admin/scheduling/SchedulingPlan'),name: 'SchedulingPlan', meta: { title: '调度计划生成', icon: 'list'}},
  {path: '/scheduling/LowWaterTemplate/:id/:year',component: () => import('@/views/admin/scheduling/LowWaterTemplate'),name: 'LowWaterTemplate', meta: { title: '枯水期调度方案', icon: 'list'}},
  {path: '/scheduling/LowWaterTemplate/History/:id/:year',component: () => import('@/views/admin/scheduling/LowWaterTemplate/History'),name: 'History', meta: { title: '枯水期调度方案', icon: 'list'}}
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
    meta: { title: '首页', icon: 'dashboard' },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/admin/Demo'),
        name: 'Dashboard1',
        meta: { title: '首页', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'systemIndex',
    meta: { title: '系统管理', icon: 'dashboard' },
    children: systemRouter
  },
  {
    path: '/emergency',
    component: Layout,
    redirect: '/emergency/emergencyPlan',
    name: 'emergencyIndex',
    meta: { title: '应急事件管理', icon: 'component' },
    children: emergencyRouter
  },
  {
    path: '/scheduling',
    component: Layout,
    redirect: '/scheduling/SchedulingPlan',
    name: 'schedulingIndex',
    meta: { title: '水量调度管理', icon: 'component' },
    children: schedulingRouter
  },
  {
    path: '/duty',
    component: Layout,
    redirect: '/duty/dutylist',
    name: 'dutyIndex',
    meta: { title: '值班管理', icon: 'chart' },
    children: dutyRouter
  },
  {
    path: '/water',
    component: Layout,
    redirect: '/water/deliverymanage',
    name: 'waterIndex',
    meta: { title: '水雨情报送', icon: 'chart' },
    children: waterRouter
  },
  {
    path: '/eneralize',
    component: Layout,
    redirect: '/eneralize/intake',
    name: 'eneralizeIndex',
    meta: { title: '流域概化图', icon: 'component' },
    children: eneralizeRouter
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
