# Bootstrap 笔记

Bootstrap是一个基于HTML、CSS、JS的前端框架，用于开发响应式布局、移动设备优先的Web页面。

主要用于创建后台页面或内容比较简单的页面。

官网地址(中文网)： https://www.bootcss.com/



## 版本选择

目前Bootstrap主要分为Bootstrap3 和Bootstrap4 ，这两个分支都在维护更新，相比较而言，Bootstrap3使用更加广泛，而Bootstrap4支持的特性则更加新颖。建议使用Bootstrap3入门。

按使用方式分的话，可以分为发布版和源码版，也可以分为本地版和CDN版。发布版文件是编译并压缩后的CSS、JS和字体文件，不包括文档和源码，源码版则是包括Less、JS和字体文件的源码，并且带有文件。使用时需要Less编译器和一些设置工作。

[下载地址](https://v3.bootcss.com/getting-started/#download) 

BootCDN地址

```html
<!-- 最新版本的 Bootstrap 核心 CSS 文件 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<!-- 可选的 Bootstrap 主题文件（一般不用引入） -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
```



## 使用

Bootstrap中的js插件依赖jQuery，所以在引入Bootstrap之前要先引入jQuery( "1.9.1 - 3")

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- 上述3个meta标签*必须*放在最前面，任何其他内容都*必须*跟随其后！ -->
    <title>Bootstrap 101 Template</title>

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- HTML5 shim 和 Respond.js 是为了让 IE8 支持 HTML5 元素和媒体查询（media queries）功能 -->
    <!-- 警告：通过 file:// 协议（就是直接将 html 页面拖拽到浏览器中）访问页面时 Respond.js 不起作用 -->
    <!--[if lt IE 9]>
      <script src="https://cdn.jsdelivr.net/npm/html5shiv@3.7.3/dist/html5shiv.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/respond.js@1.4.2/dest/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    <h1>你好，世界！</h1>

    <!-- jQuery (Bootstrap 的所有 JavaScript 插件都依赖 jQuery，所以必须放在前边) -->
    <script src="https://cdn.jsdelivr.net/npm/jquery@1.12.4/dist/jquery.min.js"></script>
    <!-- 加载 Bootstrap 的所有 JavaScript 插件。你也可以根据需要只加载单个插件。 -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js"></script>
  </body>
</html>
```



## Bootstrap基本样式

### 排版与连接

- 为`body`元素设置了 `background-color:#fff;`
- 使用`@font-family-base`、`@font-size-base` 、`@line-height-base`变量作为排版的基本参数
- 为所有连接设置了基本颜色 `@link-color` ，并且当链接处于`:hover`状态时才添加下划线



### 布局容器

使用Bootstrap需要为页面内容和栅格系统包括一个`container`容器，容器包括两个类：

- `.container` 用于固定宽度并支持响应式布局的容器
- `.container-fluid` 用于100%宽度，占据全部视口的容器



### 栅格系统

栅格系统也就是表格布局，通过一系列的行`row`和`col-*`列来定位页面元素。页面元素只需要添加到布局即可。它的工作原理如下：

- 行必须包含在`.container`或`.container-fluid`中，以便为其赋予合适的对齐方式`aligment`和内边距`padding`
- 每一行分为若干列
- 页面元素添加到对应的列中（注意，不能直接添加到表示行的元素中）
- 通过为列设置`padding`属性，从而创建列与列之间的间隔。通过为行元素设置负值margin从而抵消掉`container`设置的padding
- 栅格系统中的列是通过指定1~12来表示其跨越的范围，三个等宽的列可以使用 `.col-xs-4`来创建
- 如果一行中包含的列大于12，那么多余的列则会作为一个整体，另起一行显示
- 栅格类适用于屏幕宽度大于或等于分界点大小的设备，并且针对小屏幕覆盖栅格类。

列前缀： `.col-xs-*  .col-sm-*  .col-md-*  .col-lg-*` ， *为1~12，表示占用的列数，xs表示超小屏、sm表示小屏、md表示中屏、lg表示大屏，如果只指定了md，那么大屏也会使用此样式，而比它小的则不使用样式。



示例：

```html
<div class="row">
  <div class="col-xs-12 col-sm-6 col-md-8">.col-xs-12 .col-sm-6 .col-md-8</div>
  <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
</div>
```

其他示例，参考官方文档： https://v3.bootcss.com/css/



### 排版

标题： 可以使用`<h1>~<h6>` ,也可以使用 `.h1 ~ h6`

主体：全局字体大小为14px，行高为1.428，另外段落还有1/2行高的底部外边距

中心内容： `.lead` 可突出显示段落，行内可用`<mark>`标记

对齐：`text-left text-center  text-right  text-justify  text-nowrap `等类

列表： `list-unstyled` 去除圆点 `list-inline` 行内列表



### 代码块

行内 ：`<code>` 用户输入： `<kbd>` 代码块 `<pre>`    变量：`<var>` 程序输入`<samp>`



### 表格

表格类： `table`     条纹状表格 `table-striped`  边框 `table-bordered`

鼠标悬停时所在行高亮显示 `table-hover`

表格内容紧缩： `table-condensed`

单元格状态 ： `active success info warning danger`  ( 也就是不同的背景色)



### 按钮

`a` `button` `input` 等元素都可以作为按钮使用，也都可以使用按钮样式，建议使用button

类型：`btn` `btn-default`  `btn-primary` `btn-success` `btn-info` `btn-warning` `btn-danger` `btn-link`

大小 `.btn-lg  .btn-sm  .btn-xs`

按下状态：`.active`

禁用状态： 通过为按钮添加透明度即可显示出禁用状态，另外button的属性中有disabled，可以使用它来禁用按钮







