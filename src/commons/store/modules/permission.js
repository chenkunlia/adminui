import { asyncRouterMap, constantRouterMap } from '@/router/admin.router'
import genMenus from '@/commons/utils/menu'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission (roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter (asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    privRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      // console.log('addRouters:', routers)
      state.addRouters = routers
      if (constantRouterMap) {
        state.routers = constantRouterMap.concat(routers)
      } else {
        state.routers = routers
      }
      // console.log('state.routers:', state.routers)
    },
    SET_PRIVROUTERS: (state, routers) => {
      state.privRouters = routers
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        // console.log(data)
        // console.log(roles)
        let accessedRouters
        if (roles.indexOf('admin') >= 0) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    GenPrivRoutes ({ commit }, menus) {
      return new Promise(resolve => {
        const routers = genMenus(menus)
        // console.log('genrouters', routers)
        commit('SET_PRIVROUTERS', routers)
        resolve()
      })
    }
  }
}

export default permission
