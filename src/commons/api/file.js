import getInterface from '@/commons/api/index'

var root = 'app'

export default {
  // 图片及文档上传相关
  uploadFile: (data) => getInterface(root, '/file/upload/', data, 'post'), // 上传文件
  uploadImage: (data) => getInterface(root, '/image/upload/', data, 'post'), // 上传图片
  getFileList: (data) => getInterface(root, '/file/page/', data, 'get') // 查询文件
}
