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



