# jQuery笔记

jQuery 是一个JavaScript函数库，它的设计宗旨是`write less， do more`。 它包含以下特性：

- HTML元素选取
- HTML元素操作
- CSS操作
- HTML事件函数
- JavaScript特效和动画
- HTML DOM遍历和修改
- AJAX
- Utilities

官网地址： https://jquery.com/     

参考文档： https://jquery.cuishifeng.cn/



## 版本选择

jQuery目前的最新版本是3.6，每一个大版本变更都不兼容之前的版本，所以可以选择的版本有三种

- 1.12.4 最后一个1.x版本，支持IE6、7、8
- 2.2.4   当前2.x的最新稳定版
- 3.6      当前3.x的最新稳定版

大部分公司还在使用1.x，因为它的兼容性比较好，但由于功能比较老旧，所以2.x版本的使用率也在增加。当然一些公司也在使用3.x版本的，不过不是很多



jQuery库分为 压缩 产品版 和 未压缩开发版，所谓压缩版就是去除了注释、多余的空格等内容，使得文件体积更小，更适合正式产品使用，而开发版具有更好的可读性。

jQuery库即可以放到自己的项目中，使用相对路径加载，也可以使用公用的CDN服务，使用CDN有一个好处，就是其他网站可能已经加载过了jQuery库，所以就可以直接从缓存中加载。

常用的jQuery库CDN有百度CDN、新浪CDN、BootCDN等, 参考https://www.jq22.com/cdn/     https://www.bootcdn.cn/jquery/

```html
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
```



## jQuery 与原生JS的关系

前面说，jQuery是一个js函数库，它提供了大量的工具函数给我们使用，同时，为了简化使用，它对DOM中的对象进行了重新封装，提供了新的工具方法。

jQuery中使用`$`来创建jQuery对象，实际上`$`就是一个函数，等价于`jQuery()`函数。如果使用`$`与其他库或框架会产生冲突，那么就可以使用jQuery方法来生成jQuery对象。

```js
// 加载jquery.js之后
console.log(window.$);       ƒ i(t,a){return new i.fn.init(t,a,e)}
console.log(window.jQuery);  ƒ i(t,a){return new i.fn.init(t,a,e)}
```

另外，在搜狗等国产浏览器中默认已经集成了jQuery库，可以直接使用，在Chrome浏览器中也定义了`$`函数：

```js
// 在Chrome浏览器中
ƒ $(id) {
  // eslint-disable-next-line no-restricted-properties
  return document.getElementById(id);
}
```

jQuery对象和DOM对象的相互转换：

```js
// jQuery对象转DOM对象
jQuery对象[index] 
// DOM对象转jQuery对象
$(DOM对象)
```

jQuery的语法是 ： `$(selector).action()`

## 入口函数

入口函数指的是开始执行js的位置，在原生js中通过在load事件或DOMContentLoaded或document的readyStateChange事件中开始js的执行，分别表示文档加载文成、DOM渲染完毕、加载状态编程完成时。

jquery中的写法如下：

```js
$(document).ready(function(){ 
    // 入口，在DOM渲染完毕之后执行
});
// 缩写如下:
$(function(){
   // 入口 
});
```

另外，需要注意的是，ready事件内部应该就是通过DOM2方式添加的DOMContentLoaded事件，所以添加多个ready事件会依次执行，而不会产生覆盖。

## 选择器













