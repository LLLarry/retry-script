# 滑块验证码

`retry-script`插件是一款能够使我们的项目、**在加载`js`静态资源失败的时候、进行重新尝试加载（或者换域名重新加载）**

## 特色功能：

* 使用简单、支持自定义配置
* 支持`cdn`的方式引入

## 快速开始

### 引入script (注意： **一定要在项目的最顶部引入**)

```html
<script src="http://xxx.xxx.xxx/retry-script.js"></script>
<script>
new RetryScript([
    'http://local/1',
    'http://local/2',
    'http://local/3'
 ])
</script>
```

> 注意： **一定要在项目的最顶部引入**



## 配置项

支持两种方式配置

* 1、仅配置`hosts`时, 可以简化为

  ```js
  new RetryScript([
      'http://local/1',
      'http://local/2',
      'http://local/3'
   ])
  ```

* 2、当多个配置时，看下面示例

  ```js
  new RetryScript({
      hosts: [
          'http://local/1',
          'http://local/2',
          'http://local/3'
      ],
      handler (config) {
          return config.join('http://www.xxx.cn', config.source)
      }
  })
  ```

  

| 名称                | 类型              | 默认值 | 必传 | 说明                                                         |
| ------------------- | ----------------- | ------ | ---- | ------------------------------------------------------------ |
| `hosts`         | string[] | 无     | 是   | 重试的`host`数组列表， 当`js`加载失败时、默认会依次从`hosts`数组中按照顺序取出对应的域名来尝试加载`js` |
| `handler` | function    | 无   | 否   | 处理函数， 接收**`config`对象**, 返回值作为下次重试的`src` 地址; 如果返回值是字符串，则作为下次重试的`src地址`； 返回值如果是其他类型，则使用默认规则生成下次重试地址 |

**config对象说明**

| 名称                | 类型              | 说明                                                         |
| ------------------- | -----------------  | ------------------------------------------------------------ |
| `currentIndex` | number | 重试的hosts的index索引 |
| `source` | string   | 解析出来的资源名 |
| `oldSrc` | string | 上一次加载失败的src路径 |
| `hosts` | string[] | 传入的配置项`hosts` |
| `join` | function | 路径拼接函数、用法同`node`中`path`模块的`join`方法 |

## 方法

| 方法名        | 返回值 | 示例                    | 描述                   |
| ------------- | ------ | ----------------------- | ---------------------- |
| `destory`       | 无     | `captcha.destory()`       | 销毁控件               |

