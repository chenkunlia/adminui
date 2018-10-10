import { param2Obj } from '@/commons/utils'

const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default {
  loginByUsername: config => {
    const { account } = JSON.parse(config.body)
    // console.log('username', account)
    // console.log('config', config)
    return userMap[account]
  },
  getUserInfo: config => {
    // const { token } = param2Obj(config.url)
    console.log('getUserInfo')
    return userMap['admin']
  },
  logout: () => 'success'
}
