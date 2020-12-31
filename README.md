# wx-cloud-http
封装微信小程序云开发HTTP API，方便node.js调用。

具体参数含义可以查看[云开发 HTTP API 文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/)


调用功能之前一定要先调用`setEnvironment`来设置环境


## 调用示例
```typescript
// 设置一次环境
setEnvironment({
  appid: 'appid', // 微信公众平台->设置->开发管理->开发设置
  secret: 'secret', // 这个和上面那个一样
  env: 'env', // 微信开发工具->云开发->设置->环境设置
});

uploadFile('/the/path/to/source', '/the/path/to/dest')
  .then(res => {
    // ......
  })
  .catch(err => {
    // ......
  });


```