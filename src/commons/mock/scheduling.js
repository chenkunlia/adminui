import Mock from 'mockjs'

const List = []
const count = 20

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    year: '@guid()',
    code: +Mock.Random.date('T'),
    usertimename: '@name()',
    name: '@float(1000, 15000, 0, 2)',
    time: '@float(1000, 15000, 0, 2)'
  }))
}

export default {
  getList: () => {
    return {
      code: 0,
      data: {
        total: List.length,
        list: List
      },
      msg: '访问成功'
    }
  }
}
