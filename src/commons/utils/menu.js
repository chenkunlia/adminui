const findChildren = (parent, childrens, removeIndexs) => {
  let children = []
  let id = parent.name
  for (var c in childrens) {
    if (childrens[c].menuPId === id) {
      let cmenu = childrens[c]
      let childr = {
        path: cmenu.menuUrl,
        name: cmenu.menuId + '',
        meta: {
          title: cmenu.menuName,
          icon: cmenu.icon
        }
      }
      findChildren(childr, childrens, removeIndexs)
      children.push(childr)
      removeIndexs.push(c)
    }
  }
  if (children.length > 0) {
    parent.children = _.sortBy(children, 'index')
  }
}

/**
 * 将后台返回的菜单展示列表封装成路由菜单
 */
export default (menus) => {
  let router = []
  let parents = menus.filter((m) => { return m.menuPId == null })
  parents = _.sortBy(parents, 'showIndex')
  // console.log('parents', parents)
  let childrens = menus.filter((m) => { return m.menuPId != null })
  // console.log('childrens', childrens)
  for (var i in parents) {
    const menu = parents[i]
    const r = {
      path: menu.menuUrl,
      name: menu.menuId + '',
      meta: {
        title: menu.menuName,
        icon: menu.icon + ''
      }
    }
    let id = menu.menuId
    let children = []
    let removeIndexs = []
    for (var c in childrens) {
      if (childrens[c].menuPId === id) {
        let cmenu = childrens[c]
        let childr = {
          path: cmenu.menuUrl,
          name: cmenu.menuId + '',
          meta: {
            title: cmenu.menuName,
            icon: cmenu.icon + ''
          },
          index: cmenu.showIndex
        }
        findChildren(childr, childrens, removeIndexs)
        children.push(childr)
        removeIndexs.push(c)
      }
    }
    // if (children.length == 0) {
    //   console.log('children', children)
    //   let t = JSON.parse(JSON.stringify(r))
    //   t.name = t.name + '-1'
    //   if (t.path == null) {
    //     t.path = '/' + i
    //   }
    //   children.push(t)
    // }
    if (children.length != 0) {
      r.children = _.sortBy(children, 'index')
    }
    router.push(r)
    // removeIndexs.map((i, index) => {
    //   childrens.splice(i, 1)
    // })
  }
  // console.log('menurouters', router)
  return router
}

export const genTree = (list, covs) => {

}
