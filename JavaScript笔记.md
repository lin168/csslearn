# JavaScript笔记

在前端开发中，HTML语言用来定义网页的内容，CSS用来定义网页的布局和样式，JavaScript则用来对网页进行编程。

[TOC]



## JavaScript是什么

JavaScript是一种网页脚本语言，由浏览器中的解析器执行。它的出现是为了解决浏览器中页面与用户交互的问题。1995年5月，网景公司对这门要设计的语言的要求是“必须看上去与Java足够相似，但还要比java简单，使得非专业的网页作者也能很快上手”。被安排做这项工作的人就是Brendan Eich。作为JavaScript之父，当时实际上只是为了应付公司安排的工作，甚至是设计这门语言只用了10天。基本的设计思路是这样的：

1. 借鉴C语言的基本语法
2. 借鉴Java语言的数据类型和内存管理
3. 借鉴Scheme语言，将函数作为一等公民（first class）【因为作者的喜欢函数式编程】
4. 借鉴Self语言，使用基于原型（prototype）的继承机制。

所以，JavaScript实际上就是混合了函数式语言和面向对象语言的产物。【参考自百度百科-布兰登艾奇】

在JavaScript被提交非ECMA标准委员会之后，它的内容被划分为三部分：

1. 语言自身特性，这部分由标准委员会制定标准，所以也叫做ECMAScript，简称ES
2. 文档对象模型，DOM，控制页面文档的内容，随HTML、CSS标准而更新
3. 浏览器对象模型，BOM，控制浏览器行为



## JavaScript发展史

- 1995年网景公司(Netscape)的工程师Brendan Eich 创造了LiveScript，用于提高HTML页面的交互性。随后在1996年初被应用于Netscape2浏览器上，之后推广的过程中Netscape与Sun公司深度合作，所以LiveScript也改名为JavaScript。
- 1997年，Netscape将LiveScript提交给标准化组织ECMA，也就是ECMAScript标准1.0
- 1999年，ECMAScript发布了第三版，之后由于发展方向的分歧，第四版被作废
- 2009年12月发布的ECMAScript第五版，并在2011年进行修订发布5.1版本，目前使用的大部分JS特性都属于这个版本。
- 2015年，第六版发布
- 2016年，第七版
- 2017年，第八版
- 2018年，第九版



另外国内的JS发展状况也非常有趣

- 2003年：JS主要用于在页面上显示弹窗广告，页面效果很少，一般直接参考“效果宝盒”即可

- 2004年：谷歌推出Ajax，使得JavaScript的功能得到极大提高，从此JavaScript逐渐被人们重视。同年问世了两本JS巨作《犀牛书》和《JavaScript高级程序设计》

- 2007年：三层分离(UI、业务逻辑和数据)，iPhone发布，用户体验开始在产品设计时被重视。而JavaScript作为Web页面中制作交互效果的唯一语言，开始被各大厂商所重视。甚至开始招聘JS工程师。

- 2008年：Chrome发布，V8引擎使得JS的解析变得流畅。

- 2009年：jQuery开始流行，解决了浏览器兼容性问题，简化了效果制作。

- 2010年：Canvas画布技术被H5支持，开始逐渐代替Flash来完成交互动画、小游戏，甚至出现了H5游戏引擎

- 2011年：Nodejs得到广泛使用，也就是用JS进行服务端开发，降低了小企业的开发成本

- 2012年：HTML5+CSS3开始流行，JavaScript同样不可或缺

- 2013年：hybrid app模式开始流行，也就是通过带壳浏览器的方式，开发一套页面同时支持PC、iOS、安卓等平台。

- 2015年：ECMA6发布，叫做ECMA2015。增加了很多语言特性。

- 2019年：前后端分离开发流行起来，vue、react等前端框架开始流行，其中vue框架在中小型企业中被广泛使用

  

##  HTML引入JS

在HTML页面中使用`<script>`标签引入JS，js即可在`<script>`标签内定义，也可以使用src属性指定外部文档。分别叫做内部引入和外部引入。

```html
<script>
    // 内部引入
    // 定义js内容
    //执行js语句
</script>

<scritp src="./global.js">
    // 外部引入
    // 这里必须为空
</scritp>
```

type属性是在HTML5之前为了兼容多种浏览器以及多种脚本语言时使用的，比如vbs、typescript、JScript等

浏览器处理HTML页面的方式是边获取、边渲染、边执行，即使只获取了一部分也会进行解析，由渲染器进行渲染显示，由解析器进行JS解析执行。JS解析执行时单线程的，由上到下进行。

鉴于上面的原因，内部引入通常写在body标签的结尾之前，以免JS中在操作DOM元素时，页面内容还没有获取到。而外部引入则通常写在header标签的最后。



## 基本语法

1. 代码执行顺序

   一个HTML页面中可以嵌入多个script块，他们按照在HTML中引入的顺序，从上到下依次执行。在每个块内部也按照从上到下的顺序执行。并且一个脚本的异常不会影响其他其他脚本的运行。

2. **注释**

   单行注释： //   多行注释： /**/

3. **语句**使用分号或换行分隔，习惯上为每条语句添加分号结尾

4. **标识符**：由数字、字母、下划线、$组成，并且不能以数字开头。标识符的作用是唯一表示一个变量、函数或对象等程序中自定义事物，**大小写敏感**

5. **常量**： 常变量，也就是值不能修改的变量，用const修饰，ES6新增。

6. **数据类型**：JavaScript中有六种数据类型：number 数值型、string 字符串、boolean 布尔型、undefined未定义类型、null空类型、object 对象类型。另外需要了解的是JS是动态类型的、弱类型的语言。

   - number 数值型，包括正负、整数、浮点、各种进制、Infinity正无穷、-Infinity负无穷、NaN(note a number)不存在
   - string 字符串可以用单引号或双引号表示。单双引号可以相互嵌套。转义字符和C语言中一样。
   - boolean 只有true和false两个值
   - undefined 只有undefined一个值，表示值类型不确定。
   - null 与其说是一种类型，不如说是对象类型的一个值，表示空指针对象，表示用来保存对象，但还没有指向真正的对象。也可以用来释放对象
   - object 对象类型，JavaScript中一切皆对象，包括数组、函数等都是通过对象来提供的。
   - function 函数类型，通常归结到对象中。但是js中的函数是作为一等公民设计的，所以函数的很多特性跟面向对象中的函数并不一样。

7. **动态类型和弱类型**

   - 动态类型指的是一个变量可以在不同的时刻保存不同类型的数据，用面向对象的方法理解就是Object根对象的引用
   - 弱类型指的是在使用变量时，不必可以强调变量的类型，解释器会自动对变量进行类型转换，从而满足操作要求。当然隐式类型转换是由很大的限制和弊端的，还是要尽量避免。

8. 严格模式：为了规范js代码，可以选择性开启， `"use strict";`





### 变量

和大部分脚本语言一样，JavaScript中的变量也是动态类型的，也就是说变量的类型会根据其值的类型自动变化，当然对于特定的值，其类型时固定的。定义变量的关键字是var 和let，var是ES5中的变量定义方式，let是ES6中新增的变量定义方式，推荐使用

```js
let vname; // 声明（定义）一个变量，JS中一切皆对象，默认值是undefined。
let vname1 = "hello"; // 定义时初始化。
```

var 和 let的区别：

   - var 声明的变量会自动把声明提前，let不会。所以使用var多次声明的变量会当做同一个变量处理。

   - var声明的变量只有函数作用域和全局作用域两种，let声明的变量是块作用域(可以是一个小代码段，也可以是全局块)。

还有一种直接给变量赋值的方法, `vname="hello"` ,它相当于`window.vname="hello"` ,实际上这个变量会作为一个属性被添加到window对象上，window对象的方法和属性可以直接使用。不需要通过对象名来调用。（实际上全局对象和方法都会添加到window对象上）

注意：在读取变量之前，必须先进行定义，否则会抛出异常。



### 运算符和表达式

- 算数运算符：`+ - * / % ++ --`
- 比较运算符： `> <  >= <= == !=  === !==` 后面两个分别是绝对等于(值和类型都相同)和不绝对等于(值和类型至少有一个不相同)
- 逻辑运算符 `&& || !` 与 或 非。
- 赋值运算符 `= += -= *= \= %= `
- 位运算符

 运算数据中有字符串时，加法则会把数字转换为字符串进行拼接, 其他运算则把字符串转换为数字进行运算。

 如果无法转换，则结果是NaN，**应该尽量避免**。

```js
// 1. 字符串运算的隐式类型转换
var x='5';
var y =2;
console.log(x+y); // 52
console.log(x-y); // 3
console.log(x*y); // 10
console.log(x/y); // 2.5

// 2. 比较注意事项
undefined == null // true
undefined === null // false， 值相等，类型不同

NaN != NaN // true, NaN是不相等的
```



### 作用域

变量和函数的作用范围，分为全局作用域和局部作用域。

全局作用域：在整个程序中可用，实际上就是添加到`window`对象上的属性和方法。

局部作用域：也就是只能在代码块或函数内使用。

```js
// 全局变量和函数的定义: 在函数外定义的变量就是全局变量，全局变量会作为属性添加到window对象上。另外，在程序中未定义就赋值的变量都会自动添加到window对象上，也就是全局变量。
var name="llsong";
age = 18;
let gender = "man"
function talk(){
}
// 局部变量定义：也就是在代码块{}中定义的变量和匿名函数
function fn(){
    var name="temp name";
    var f1 = function(){
        console.log("内部匿名函数");
    }
}
```




### 流程控制

顺序结构、分支选择结构、循环结构

```js
[分支语句] if +switch
if(cond){    
// do something
}

if(cond){
// do something
} else{    
// do somethign else
}

if(cond1){
// do something
} else if(cond2){
// do something else
}

switch(express){
case val1:
// do something
break;
case val2:
// do something
break;
...
default:
// do something
break;
}

// 执行第一个为true的分支
switch(true){
case express: // 表达式为true时进入
// do something
break;
case express2:
// do something
break;       
}

// 循环语句, 和C语言一样
for(init;cond;op){
// do something

if(cond){
break; //结束循环
}

continue; // 跳过本次循环
}

while(cond){
// do something
}

do{
// do something
}while(cond);


​	
// 经典示例:水仙花数判断
function isDaffNum(num){
var sum = 0, i = num;
for(;i>0;i=Math.floor(i/10)){
sum += Math.pow(i%10,3);
}
return sum == num
}

for(var i=0;i<1000;i++){
if(isDaffNum(i)){
console.log(i)
}
}
```

注意点：

- `null undefined NaN` 逻辑上都是`false`， 并且算数和比较运算的结果都是false



### 数组

数组的类型是`Array` ,数组中可以存储任意类型的数据，实际上等价于Java中的List，其长度也是自动变化的。

```js
// 定义数组
var arr = [item1, item2,item3...];
// 也可以用new Array的方式创建
var arr = new Array('LiLei','HanMeimei'); // 创建一个数组，数组的内容由参数构成
var arr = new Array(10); // 定义一个包含10个元素的数组

// 数组操作： 增删改查
// 数组元素可以通过数组名和下标来访问和修改，另外js中不存在数组越界，解释器会自动填充，不存在的元素为empty
var arr=[];
arr[5] = 8; // 增,直接用下标即可，不用担心下标越界
arr[5] = 3； // 改
arr[5] = undefined; // 删， 也可以用delete arr[5]
// for 循环遍历，或 for in遍历 或 for of遍历 或 数组的forEach方法
for(var i in arr){  // i 是下标
console.log(arr[i])
}
for(var ele of arr){ // ele就是数组中的元素
console.log(ele)
}
arr.forEach( // 参数是一个函数
function(ele, index){ // ele 就是元素，index是下标
// do something
}
)

// 常用属性
arr.length // 数组长度， 可以通过修改arr.length来改变数组的长度，超出长度的数据将被丢弃。不过不建议修改

// 常用方法
Array.isArray(obj); // 判断一个对象是不是数组
// 用数组实现栈、队列的操作。
arr.push(item1,item2...); // 向数组末尾添加元素，返回数组的新长度。
arr.pop(); // 删除数组尾部的最后一个元素，并返回该元素
arr.unshift(item1,item2...);// 在数组头部添加元素，返回数组的新长度。
arr.shift(); // 删除数组头部的第一个元素，并返回该元素 

arr.splice(index, delCnt[,item1,item2...]); // 剪接，从指定下标开始删除delCnt个元素，并添加指定的新元素。返回值是删除的元素构成的数组
arr.join(sep:string);// 把数组中的元素用分隔符连接起来构成一个字符串。
arr.reverse(); // 翻转数组中元素的顺序
arr.sort(function(a,b){}); // 对数组元素排序，需要制定排序函数
arr.map(function(val,index,arr){
// do something with param and return a result
}); // 针对数组中的每个元素调用传入的函数，并把函数返回的数据组成新的数组作为map的返回值
arr.filter(function(val,index,arr){
// do something with param and return a result
return true/false;
}); // 针对数组中的每个元素调用传入的函数，用满足条件的数据组成新的数组返回。

arr.concat(arr1); // 数组元素拼接，返回新的数组
arr.slice(iStart,iEnd); // 数组切片（截取子数组），索引可以用负值，此时最后一个元素的下标为-1
arr.indexOf(item, iStart); // 查找第一个符合条件的子元素
arr.lastIndexOf(item.iStart); // 查找最后一个符合条件的子元素
arr.some(function(val,index,arr){}); // 检测数组中是否有元素满足指定条件，满足返回true，否则返回false
arr.every(function(val,index,arr){}); // 检测数组中的所有元素是否都满足指定条件
arr.include(ele,startpos); // 检测数组中是否包含指定的值
arr.reduce(function(prev, currentValue,CurrentIndex,arr){},initvalue) 和 arr.reduceRight(function(prev, currentValue,CurrentIndex,arr){},initvalue); // 接收一个函数作为累加器，会依次把数组元素传入到函数中，然后把最后一个元素传入函数的返回值作为整体的返回值。prev是上次调用的返回值，第一次调用时是initvalue，如果未指定initvalue，则是数组第一个元素，reduce从第二个元素开始。Right表示从最后一个元素开始。
arr.find(function(currentvalue, index,arr){}); // 返回第一个使回调函数返回true的元素
arr.findIndex(function(currentvalue, index,arr){});// 找到的第一个元素的下标

// 常规操作
// 1. 字符串和数组的相互转换
str.split(""); <==> arr.join();
```

关于二维数组和多维数组的概念也是相同的，二维数组的元素是一维数组，所以二维数组中每个元素的长度可以是不同的，并且都是变长的。



### 对象

键值对构成的数据集合，键和值用冒号分隔，键之间用逗号分隔，两端用大括号包围。JavaScript中所有数据都可以被视为对象。键名也就是属性(`property`)

``` js
// 定义对象
var obj={ 
	prop1:value1,
    prop2:value2,
    ...
    propn:function(){} // 方法成员的定义方式和属性一样,在方法中可以使用this来指代当前对象。
};

// 定义空对象
var obj={};
var obj=new Object();


// 对象的读写（对象属性的读写）,既可以使用点运算，也可以使用方括号
var obj={key:value};
console.log(obj.key);  
console.log(obj["key"]); // 等价于上面的写法，并且这种方式的key可以用变量表示。

// 对象可以随时添加新的属性，即可以用点运算，也可以用方括号
obj.newProp = value;

// 删除属性
delete obj.key;

// 对象的遍历 for in
for (var key in obj){
	// do something with key
}
// 等价于
for(var key of Object.keys(obj)){ 
    // do something with key
}
Object.keys(obj) // 返回obj中所有的key组成的数组
Object.values(obj) // 获取所有属性的值组成的数组
Object.entries(obj) // 返回的是一个保存键值对的数组，键值对用2个元素的数组表示[["name","llsong"],["age",18]]

// 对象操作
if ('key' in obj){} // 判断对象是否包含某个属性

// 对象的引用：对象名是对象的引用，一个对象可以有多个引用，他们都可以用来改变这个对象。
// 赋值操作：传递对象的引用
```



### 函数

在JS中，函数是一等公民(first class)，也就是说程序的功能由函数构成。JS中函数也是一种特殊对象。

函数用`function`关键字定义，函数名就是标识符，函数的参数个数和类型都是任意的。返回值未指定时是`undefined`,也可以指定为任意数据，但只能有一个。

```js
// 函数定义，在执行时，会首先声明块中定义的函数。
function funName(arg1,arg2,arg3){
    // do something
    return; //可以返回任何值
}

// 匿名函数,它的作用范围由变量决定，在DOM事件，回调函数中通常都使用匿名函数
var fName = function(arg1,arg2,arg3){
    // function body
}

// 函数是Function类型，也可以用new来创建
var fn = new Function(param1,param2,.."console.log('function boby')"); 
最后一个参数就是要执行的函数语句


// 调用, 实参数和形参数可以不一致，实参多时，多余的实参将被自动丢弃[也可以使用arguments参数取到]，实参少时，未赋值的形参则是undefined。
funName(param list);

// 变参函数（长度可变）: 在函数内部所有的实参都会按顺序放到arguments对象中，它的用法和数组类似，可以使用下标取出每一个实参。
// arguments有两个属性： length 表示实参的个数， callee 表示函数本身，在匿名函数中可以使用它来实现函数递归。
function(arg1,arg2){
    console.log(arguments);
}
```

匿名自执行函数：在定义时直接调用的匿名函数，这个函数只能调用一次。这也限定了它的使用场景：是一个代码块，但会且只会执行一次。

```js
(function(arglist){
   // function body 
})();
```



### 异常捕获

浏览器中针对没每个script标签会启动一个解析器，然后在js虚拟机中执行解析之后的代码，如果js代码执行过程中发生错误，则停止执行，并在控制台上显示异常信息。一个script标签中的代码异常不会影响其他script标签中的代码执行。

如果希望异常发生后，不影响后面的语句执行，则可以把可能发生异常的代码放到`try{}catch(error){}`块中，这样即使try块中的代码发生了异常，之后的代码也可以正常执行。

```js
try{
    // 可能发生异常的代码
} catch(error){
    // 处理发生的异常
}

```



## 常用标准库对象

标准库对象由浏览器提供，可以在js代码中直接使用

### Math

提供数学函数相关属性和方法

```js
// 常用属性
PI 圆周率

// 常用方法
random(); 随机[0,1)的数,可以用它生成任意范围的随机数,生成[m,n]的随机整数，parseInt(Math.random()*(n-m+1)+m)
floor(); 向下取整
ceil();  向上取整
round(); 四舍五入
pow(x,y); x的y次方
max(); 最大值，参数可以有多个
min(); 最小值
abs(); 绝对值
sqrt(); 求平方根
```

### 日期时间Date

提供日期和时间处理的属性和方法

```js
// 获取当前时间
var dt = new Date();
var dt1 = new Date("2021-02-19 13:41:54");// 指定日期时间的对象
var dt2 = new Date(毫秒值);// 参数是距1970-1-1 0:0:0的毫秒数

// 常用属性

// 常用方法
getTime(); 获取距离1970-1-1 0:0:0的毫秒数，常用的时间戳
getYear(); 获取年，距1900年的年份
getFullYear(); 获取4位的年份
getMonth(); 获取月份 0~11
getDate(); 获取日
getDay(); 获取星期几
getHours(); getMinutes(); getSeconds(); 获取时分秒
toString(); 转换为字符串
toLocalString(); 先转换为本地时区，然后转换为字符串
toDateString(); 只转换日期，
toTimeString(); 只转换时间

// 常用操作
1. 计算日期间隔
日期对象直接做减法即可，返回的是毫秒值
```



## DOM

DOM 是`Document Object Model`(文档对象模型)的缩写，也就是HTML文档的内存对象表示模型。使用DOM可以方便的对HTML文档中的内容进行管理---增删改查。DOM可以看做是一个标准：它规范了HTML文档元素的表示方式(内存对象模型-树)，以及操作HTML文档元素的接口API。

在深入学习DOM之前，先回顾一下HTML页面的组成：

HTML页面的所有内容包含在一对`HTML`标签中，然后在这对标签中包含`head body`两个子标签，在子标签内部包含其他标签。在数据结构上，它就是一棵树，每个标签都是一个节点，另外标签中的文本作为该标签的子节点，标签的属性作为该标签的兄弟节点，注释也作为单独的节点处理。 

![dom](http://pic.llsong.xyz:9000/picbed/2021/2/14/dom-173532.png)

在通过DOM对HTML文档进行操作时，也要按照树形结构的方式进行。比如添加子元素，就是在一个节点中添加子节点。一个元素的父元素、子元素、兄弟元素等就对应着父节点、子节点、兄弟节点。

在浏览器中进行页面显示要经过解析、布局、渲染三个步骤：解析又分为HTML解析、CSS规则解析。HTML 解析的结果就是DOM树，HTML文档中的任意一个元素、属性、文本等内容都对应着DOM中的一个节点。CSS解析则是在DOM的基础上为HTML元素关联样式。

布局就是按照从上到下，从左到右，从外到内的顺序来依次定位DOM树中的元素。块级元素独占一行，行内元素在显示不完时自动换行。对float的元素在其父元素内容重新处理布局，对有position属性的元素重新定位，最终要实现的目标就是确定每一个元素的位置和大小。

渲染就是把布局之后的DOM元素显示到浏览器窗口中，渲染完成后就可以看到最终的页面效果了。

JavaScript的解析执行则是js解析器中进行的，使用JS对DOM进行操作时，结果可以实时的反映在渲染的窗口中。



JavaScript中表示DOM根节点的对象是`document`,它代表整个文档。文档的操作主要包括增删改查和事件

### 查询元素【选择元素】

```js
document.getElementById(id:string); // 根据id属性获取元素HTMLElement,id是唯一的，只返回一个元素
document.getElementsByName(name:string);// 根据name属性获取元素，name可以重复，所以返回的是一个数组
document.getElementsByTagName(tag:string); // 根据标签名获取元素，同一个标签可以有多个，所以返回的是一个数组
document.getElementsByClassName(class:string); // 根据class属性获取元素，多个元素可以使用相同的class
document.querySelector(selector:string); // 使用css选择器来选择元素，返回找到的第一个
document.querySelectorAll(selector:string); // 使用css选择器来选择元素，返回找到的所有元素
```

使用`document`来调用这些方法就是在整个文档中查找，也可以通过某个元素对象来调用这些方法，表示在这个元素内查找，不过只能使用一部分查找方法，比如`getElementsByTagName(tag)`。

相对而言，getElement*()方法的效率更高，但querySelector的功能更强大，所以根据情况选择即可。

### 增加元素

 很少会使用JS增加元素，了解即可

```js
// 1. 创建元素对象
var element = document.createElement(tag:string);
// 2. 如果有文本内容，就创建文本对象，并附加到元素上 [文本在DOM中是元素的子节点]
var text = document.createTextNode(text);
element.appendChild(text);
// 3. 创建属性对象，附加到元素上
var attr = document.createAttribute(name:string);
attr.value = value;
element.setAttributeNode(attr);
// 3.1 也可以用element.setAttribute(name,value);来设置元素的属性

// 4. 把该元素附加到父元素最后，或者作为兄弟元素添加到某个元素之前
parentEle.appendChild(element); // 在父节点最后插入子节点。
brotherEle.insertBefore(element); // 在兄弟节点之前插入子节点
```

### 删除元素

```js
// 1. 首先要选择元素
// 2. 通过其父节点来删除该节点
parentNode.removeChild();

// 删除属性
element.removeAttribute();
```

### 修改元素

```js
// 1.选择元素 
// 2.替换节点
parentNode.replaceChild(eleOld,eleNew);
parentNode.appendChild(); //此方法也可以把一个节点移动到它父节点的最后


// 3.修改元素的文本
element.innerHTML // 内容可以是HTML子标签
element.innerText // 内容只能是文本，标签会自动去除
element.value 	  // 适用于表单元素 input
element.textContent // 功能和innerText一样，不过兼容旧的浏览器版本

// 4. 修改属性
element.getAttribute(name); //[常用] 返回属性的值，没有属性时返回null
element.id //[常用] 可以用元素对象.属性名的方式来获取属性值，不支持自定义属性
element["id"] // 元素对象["属性名"]，不支持自定义属性
element.getAttributeNode(name); // 获取属性节点对象，然后在通过nodeName,nodeValue就能获取属性名和属性值
element.attributes; // 获取元素的所有属性列表，然后通过下标就能获取每一个属性节点对象
// 上面几种读的方式也可以用来写
element.setAttribute(name,value);
element.id = value; // 不支持自定义属性
element.["id"]=value;
element.getAttributeNode(name).nodeValue=newValue;
element.removeAttribute(name);

// 5.修改样式
// 行内样式使用style属性对象来修改样式（element.style）
element.style.width="300px"
element.style.backgroundColor="red"; // 属性名中的-会去掉，之后的首字母大写
element.style.cssFloat = "left"; 
// 5.1 也可以使用cssText，不过它是修改整个style属性
element.style.cssText="width:300px;background-color:red;float:left;"
// style对象也提供了对应的方法来get/set/remove样式属性，一般直接使用点运算来操作。
element.style.getProperty(propName,value);
element.style.setProperty(propName,value);
element.style.removeProperty(propName); // 删除属性

// style属性只能修改行内样式，修改内部和外部样式,谷歌使用window.getComputedStyle(element,null)，老版本IE使用element.currentStyle,兼容的写法如下
function getStyle(ele){
    if(window.getComputedStyle == undefined){
    	return element.currentStyle;   
    }else{
        return window.getComputedStyle(ele);
    }
}
var style = getStyle(element);
style.width = "200px"; // get、set 样式属性

// 定位相关的属性
offsetParent: 绝对定位下的父元素节点
offsetTop: 距父元素的上部偏移量
offsetLeft: 距父元素的左侧偏移量

// 元素的大小属性
offsetWidth： 元素的宽度，包括content、padding、border
offsetHeight：元素的高度，包括content、padding、border
clientWidth： 客户区宽度，包括content、padding
clientHeight:客户区高度，包括content、padding

// 6. 使用className属性来修改class属性[因为class是保留字，所以用className来代替class属性]
element.className=name;
```

### DOM对象补充

```js
// 文档常用属性
document.documentElement // [r] html文档，☆
document.title // [rw] 文档的标题元素中的文本
document.body  // [r] 文档的body元素
document.head
document.doctype // 文档类型声明

document.documentURI // 当前网址,一般就是URL
document.URL  // URL
domain // 服务器域名
lastModified  // 响应头信息
location // 地址对象，location.href 也是URL
readyState // 文档的状态：loading、interactive（加载外部资源）、complete

anchors 页面中具有name属性的超链接元素的集合
forms  页面中所有form元素的集合
images 页面中所有image元素的集合
links 页面中所有带有href属性的元素的集合
scripts 页面中所有script节点的集合


// 节点常用属性
element.nodeName // [r] 节点名称：元素名、属性名、#text、#comment、 #document等
element.nodeValue // [r] 节点的当前值
element.nodeType // [r] 节点类型（元素1，属性2，文本3，注释8，文档9）

// 节点关系：中间包含空白文本节点
childNodes // 子节点（可以有多个）
parentNode // 父节点（只有一个）
firstChild  // 第一个子节点（有文本时就是文本内容）
lastChild // 最后一个子节点
nextSibling  // 下一个兄弟节点
previousSibling // 上一个兄弟节点
a.isEqualNode(b); // 判断两个节点是否相同（nodeType,nodeValue,nodeName）
a.contains(b); // 判断a节点是否包含b节点
a.hasChildNodes(); // 判断a节点是否有子节点

// 元素节点关系：自动忽略空白文本节点
children
parentElement
firstElementChild
lastElementChild
nextElementSibling
previousElementSibling

// 复选框的checked以及下拉列表框的selected属性等单值属性用true和false表示是否选中
var hobbys = document.getElementsByName("hobby");
hobbys[0].checked=true;
hobbys[1].checked=false;
```



### 事件

用户在元素上进行的鼠标、键盘操作称为事件，另外浏览器在处理文档处理中的某些特殊的状态也称为事件，比如页面加载完成，页面开始卸载等。对事件的处理就是为事件添加一个响应函数，在响应函数中处理事件内容

   ```js
// 鼠标事件
onclick    鼠标在元素上按下又松开：单击
ondblclick 双击
onmousedown 鼠标在元素上按下
onmouseup  鼠标在元素上松开
onmousemove 鼠标移动
onmouseover 鼠标进入，当进入和离开子元素的范围时也会触发此事件，另外这个事件支持冒泡，会向父元素传递
onmouseout  鼠标离开，当进入和离开子元素的范围时也会触发此事件，支持冒泡
onmouseenter 鼠标进入，子元素不触发此事件，不支持冒泡，
onmouseleave 鼠标离开，子元素不触发此事件，不支持冒泡
onmousewheel 鼠标滚轮滚动事件
// 鼠标右键事件
oncontextmenu 右击，弹出上下文菜单事件
// 键盘事件
onkeydown  按键按下，通常在表单元素上添加，也可以在document对象上添加(事件冒泡)
onkeyup    按键松开
onkeypress 按键按下时不断触发，只对主键区的非控制键有效
// 表单及表单元素事件
onfocus    表单元素获取焦点时触发
onblur     表单元素失去焦点时触发，通常在这里进行表单输入校验
oninput    表单元素中输入的内容变化时触发
onchange   表单元素中输入的内容变化并且输入焦点时触发
onsubmit   表单事件，在表单的submit按钮按下时触发，在事件处理函数中返回false可以阻断默认提交处理。
onreset    表单事件，在表单reset按钮按下时触发
// 滚动条事件
onscroll   滚轮事件，可以加在window对象上，也可以加在其它元素上，比如document body div等，另外，元素中滚动的距离可以用element.scrollTop和element.scrollLeft来获取和设置，常见的回到顶部功能就是使用document.documentElement.scrollTop=0;来实现的
// 触摸事件，开发时可以在控制台指定手机模式进行调试
ontouchstart 手指触摸屏幕时触发
ontouchmove  手指在屏幕上移动时触发
ontouchend   手指离开屏幕时触发
ontouchcancel 当系统停止跟踪触摸时触发，比如电话接入或者弹出信息时，会中断之前的触摸过程，一般在这个操作中进行暂停操作


// 使用实例
// 1. 在标签的事件属性中指定要执行的js代码
    <div onclick="alert('clicked');">hello</div> 
        -------------------------------------
        function handleClick(){
        // do something
    }
// 执行的是一个函数
<div onclick="handleClick();" >hello</div> 

// 2. [常用，兼容性好]通过元素对象指定事件处理函数[可以用命名函数，也可以用匿名函数]，也叫DOM 0级事件处理程序
var btn = document.getElementById("btn");
btn.onclick = function(){
    // do something
}

// 3. DOM 2级事件处理程序. element.addEventListener(eventname,handleFun,bEventStream), 事件流，默认false，表示事件冒泡，true表示事件捕获。 此方法在IE9之前不支持。对应的删除事件处理程序的方法是element.removeEventListener(eventname,handleFun,bEventStream);此时，响应函数不能是匿名函数
btn.addEventListener("click",function(){
    console.log("hello");
},false); // 这种方式不能删除函数，必须是命名函数
// 这种方式为同一事件添加的多个事件处理程序可以同时存在，按添加的顺序进行执行，而不会进行覆盖。

// 4. 针对IE添加事件处理函数
element.attachEvent("onclick",function(){
    console.log("clicked"); 
});
element.detachEvent("onclick",fn);

// 所以DOM2的兼容写法如下：
function addEvent(element, eventName,callback,eventStream){
    if(element.addEventListener == undefined){
        element.attachEvent("on"+eventName, callback);
    }else{
        element.addEventListener(eventName,callback,eventStream);
    }
    return;
}
   ```

   注意事项：

   - 由于事件处理函数是元素的一个属性方法，所以可以使用this来获取当前元素的其他属性。

   - 多次指定事件处理函数时，由于HTML标签属性时从后向前解析，所以第一个生效，element.onclick 是从上往下执行，所以最后一个生效。

   - **事件流**：在元素布局时，子元素是在父元素父元素上面显示的，并且一般是在父元素内部显示的。如果我们在子元素内点击鼠标，那么也就是在父元素内点击鼠标，子元素和父元素都能收到点击事件，事件流指的就是事件在子元素和父元素之间触发的先后顺序。**冒泡**就是先触发子元素的事件，然后向父元素传递。捕获就是父元素先触发事件，然后子元素才触发事件。默认是冒泡。大部分事件都具有冒泡特性，但也有不支持冒泡的事件，比如mouseenter  mouse leave

   - 关于onmouseover  onmouseout  onmouseenter  onmouseleave,他们的区别分为两方面，**一是是否支持事件流**，也就是是否冒泡或捕获(子元素触发此事件时，父元素是否会触发)，其次是**在进入子元素时，是否触发父元素的离开事件**。

     比如有两个嵌套的div：A和B，B在A的内部，那么鼠标从外部进入A时，触发A的onmouseover事件，然后从A进入到B时，触发A的onmouseout事件，然后触发B的onmouseover事件，由于事件流，所以A的onmouseover事件也被触发，然后从B离开到A时，先触发B的onmouseout，同样从事件流触发A的onmouseout，然后A触发onmouseover事件。对于onmouseenter 和onmouseleave事件，鼠标从外部进入A时，触发A的onmouseenter，然后从A进入B时，触发B的onmouseenter，此时既没有事件流，也不会离开A，从B移动到A时，触发B的onmouseleave，从A离开时触发A的onmouseleave。



### 事件对象

在事件处理函数中可以添加一个参数来接收事件对象。

```js
var div = document.getElementById("box");
div.onclick=function(e){
    console.log(e);
}
```

但是这种方法在IE8及以下是不支持的，在事件处理函数中需要使用`window.event`来获取事件对象，兼容的写法如下：

```js
div.onclick = function(e){
    e = e || window.event;
    // do something with e
}
```

事件对象的常用属性和方法

```js
e.type // 事件类型
e.altKey // Alt 键是否按下
e.shiftKey // shift 键是否按下
e.ctrlKey // ctrl键是否按下
e.keyCode // 当键盘事件发生时，它表示按键的键码值，使用它就知道哪个按键被按下了
e.clientX // 浏览器窗口客户区的坐标，不受滚动条影响
e.clientY
e.pageX   // 相对于页面的位置坐标，受滚动条影响
e.pageY
e.offsetX // 相对于当前元素的左上角的坐标
e.offsetY
e.screenX // 屏幕坐标系中的位置
e.screenY 
e.currentTarget // 接收到事件的元素对象，等于this
e.target  // 表示最上层的，被点击到的子元素对象，IE8 之前用e.srcElement,兼容写法就是 let target = e.target||e.srcElement;
e.preventDefault(); // 在事件处理函数中阻止默认处理，在IE8之前用e.returnValue=false;来阻止默认处理，兼容写法
    if(e.preventDefault){
        e.preventDefault();
    }else{
        e.returnValue=false;
    }
e.stopPropagation(); // 取消事件的进一步捕获或冒泡，IE8以前用e.cancelBubble = true;来取消冒泡， 兼容写法
    if(e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble = true;
    }
e.bubbles;    // 事件是否冒泡(默认的事件流就是冒泡)
e.eventPhase; // 事件冒泡的过程中，执行的阶段，真正触发事件的元素接收的到事件的eventPhase属性为2，冒泡时，其父元素的事件eventPhase为3，捕获时，其父元素的eventPhase为1
e.button;     // 鼠标事件中的按钮： 0左键 1 中键  2右键

```



### 触摸事件对象

在触摸事件中的事件对象为触摸事件对象，它继承自触摸事件，但也有自己特有的属性和方法

```js
e.touches      // 事件发生时，所有的触摸点(Touch对象)数组，目前一般触摸屏都支持五点触控，高级设备上甚至支持十点触控
e.targetTouches  // 事件发生时，和当前元素相关的触摸点信息，常用
e.changedTouches // 事件发生时，变化的触摸点信息，比如新增加的触摸点，或者松开的触摸点

触摸点用Touch对象表示
touch.identifier ：触摸ID
screenX  screenY ： 触摸点屏幕坐标
clientX clientY ： 客户区坐标
pageX pageY  ： 页面坐标
radiusX  radiusY ： 触摸点半径
rotationAngele： 旋转角度
force ： 力度
target  ：触摸的元素对象


```

## Window及BOM





## 常用功能



### typeof

typeof 获取变量类型

```js
// typeof :关键字， 后跟变量名可以获取变量的类型，比如
var num = 6;
console.log(num, typeof num);
if(typeof num == "number"){
    console.log("is number");
}
```



### 数据类型转换

```js
[字符串转数值] 以下函数均会自动去除首尾的空白符
1. Number(str): 可转换整数和浮点数，字符串数字不合法时，返回NaN。
2. parseInt(str,radix): 字符串转整数。radix是基数，也就是进制,可省略。逐字符进行转换，遇到无法转换的字符则返回。
3. parseFloat(str,radix)：字符串转浮点数。radix是基数，可省略。同样逐字符转换。

[浮点数转整数]
1. parseInt(fnum,radix);参数同样可以是浮点数，小数部分直接丢弃
2. Math.floor(); 小于num的最大整数
3. Math.round(); 四舍五入
4. Math.ceil();  大于num的最小整数

[数值转字符串]
1. 利用+运算符，数字加空字符串时会自动转换为字符串
2. 利用变量（对象）的toString()方法
   let num = 3.14;
   console.log(num.toString());
3. 利用String对象的构造函数String(num); 它可以转换的各种类型的数据
```

转换失败时并不会抛出异常，而是返回`NaN`



### 字符串常用属性和方法

```js
模板字符串：使用反引号包围，中间用${}包围JS表达式
console.log(`${num1}+${num2}=${sum}`);

var str = "hello string"
console.log(str.length);  // length 字符串长度，字符数

str.charAt(index); // 返回指定索引处的字符(string类型)，索引从0开始
str.charCodeAt(index); // 返回指定索引处的字符的Unicode编码，中是20013，\u4E2D
str.concat(str1,str2,...); // 拼接字符串，等于+
str.substring(iStart,iEnd);// 截取子字符串，开始下标和结束下标(可省略，表示到结尾)
str.substr(iStart,len); // 截取子字符串，开始下标和长度(可省略，表示到结尾)
str.slice(iStart,iEnd); // 截取子字符串，返回的是原字符串的切片【修改时会反应到原字符串，除非生成了新字符串】
str.toUpperCase(); // 转换为大写，不改变原字符串
str.toLowerCase(); // 转换为小写
str.indexOf(substr,iStart); // 从指定下标开始查找子字符串，iStart省略时表示从第一个字符开始。返回下标，找不到返回-1
str.lastIndexOf(substr,iStart); // 从指定下标开始向前查找子字符串，iStart省略时表示从最后一个字符开始。
str.search(str:regexp); //查找子字符串，支持正则表达式。返回下标
str.match(str:regexp); // 返回匹配的字串,支持正则表达式。
str.trim(); // 去除字符串两端的空白符
str.replace(oldstr, newstr); // 子字符串替换，支持正则表达式。默认只替换第一个
str.split(sep:string); // 分隔字符串，返回数组。用空字符串作为分隔符时，是按字符分隔，也就是把字符串转换为字符数组。未指定分隔符时，则把数组串转换为数组，数组中只有一个元素。

// ES6\7 新增方法
str.include(substr); // 是否包含子字符串
str.startsWith(substr); // 是否以某个字符串开头
str.endsWith(substr); // 是否以某个字符串结尾
str.repeat(count); // 字符串重复n次组成的新字符串
str.padStart(tarLen,str1); // 如果str的长度不足tarLen，则使用str1在开始处填充
str.padEnd(tarLen,str1); // 在字符串结尾补充

// 字符串与Base64编码， 下面几个是window对象的方法，可以直接使用
btoa(str); 字符串或二进制值转为Base64编码
atob(base64); Base64编码转为原来的值

// 字符串与URI
encodeURIComponent(str); 将非ASCII码字符转为URI编码
decodeURIComponent(); 将转码后的内容转为非ASCII内容
```

需要注意的就是`split`的用法，以及支持正则表达式的`search\match\replace`



### Number对象常用方法

```js
let num = Math.PI;
console.log(num.toFixed(2)); // 保留两位小数 "3.14"
console.log(num.toPrecision(2)); // 数据精度，3.1
```



### 定时器

定时器中包括两部分内容：定时执行的内容和时间间隔

定时器有两个操作：开始和停止

```js
// 创建定时器，创建之后立即开始执行
let timerId = setInterval(要执行的函数, 时间间隔); // 时间间隔单位是毫秒, 返回定时器ID

// 停止定时器
clearInterval(timerId); 
```



### 鼠标拖动元素实现

```js
// 根据鼠标点下时，光标在元素内的位置，在鼠标移动时计算元素在客户区内的位置
// 鼠标移动事件应该添加到document元素上，避免鼠标移动过快时，鼠标脱离元素范围的问题(会导致元素收不到鼠标移动事件)
let box = document.getElementById("box");
box.onmousedown = function(e){
    let startPos ={};
    startPos.x = e.offsetX;
    startPos.y = e.offsetY;

    document.onmousemove = function(e){
        box.style.left = (e.clientX - startPos.x)+"px";
        box.style.top = (e.clientY - startPos.y)+"px";
    }
}
box.onmouseup = function(e){
    document.onmousemove = null;
}
```



### 键盘移动元素位置

```js
// 获取元素位置时需要使用window.getComputedStyle(),设置元素位置时使用元素对象
document.onkeydown = function(e){
    let box = document.getElementById("box");
    let style = window.getComputedStyle(box,null);   

    switch(e.keyCode){
        case 37: // 左
            box.style.left = (parseInt(style.left)-5)+"px";
            break;
        case 38: // 上
            box.style.top = (parseInt(style.top)-5)+"px";
            break;
        case 39: // 右
            box.style.left = (parseInt(style.left)+5)+"px";
            break;
        case 40: // 下
            box.style.top = (parseInt(style.top)+5)+"px";
            break;
    }
}
```

### 自定义菜单

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Test Media</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }

        ul{
            list-style: none;
            width: 100px;
            background-color: #999;
            padding-left: 20px;
            position: fixed;
            left: 0;
            top: 0;
            display: none;
        }
        ul>li{
            height: 24px;
            line-height: 24px;
            background-color: #ddd;
            padding-left: 5px;
        }
    </style>
</head>
<body>
    <ul id="menu">
        <li>复制</li>
        <li>剪切</li>
        <li>粘贴</li>
    </ul>
	<script>
        document.oncontextmenu = function(e){
            e.preventDefault();

            let menu = document.getElementById("menu");
            menu.style.display = "block";
            menu.style.left = e.clientX+"px";
            menu.style.top = e.clientY+"px";
            console.log(e.clientX);
            console.log(e.clientY);
        }
        document.onclick = function(e){
            let menu = document.getElementById("menu");
            menu.style.display = "none";
        }

        let lis = document.getElementsByTagName("li");
        for(let i=0; i<lis.length;i++){
            lis[i].onmouseover = function(){
                this.style.backgroundColor="#eee";
            }
            lis[i].onmouseout = function(){
                this.style.backgroundColor="#ddd";
            }
        }
	</script>
</body>
</html>
```



### 列表项循环滚动

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Media</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        #msg{
            width: 500px;
            height: 300px;
            border: 1px solid;
            margin: 100px auto;
            line-height: 2em;
            overflow: hidden;
        }
        ul{
            padding-left: 10px;
        }

        li{
            list-style: none;
        }
        ul span{
            margin-right: 10px;
        }
        a{
            color: #000;
            text-decoration: none;
        }
        a:hover{
            color: red;
            text-decoration: underline;
        }

    </style>
</head>
<body>
    <div id="msg">
        <ul>
            <li><span>1.</span><a href="#">法国国家电视台发文点赞总台牛年春晚科技感十足</a></li>
            <li><span>2.</span><a href="#">重新定义超大屏 Redmi MAX 86智能电视仅</a></li>
            <li><span>3.</span><a href="#">5G消息商用进行时：三大运营商联手推动产业生态探索</a></li>
            <li><span>4.</span><a href="#">比超级计算机快百万亿倍 仅是量子计算“星辰大海”的</a></li>
            <li><span>5.</span><a href="#">审视数据安全在国家层面的重要意义</a></li>
            <li><span>6.</span><a href="#">疫情之下 5G等成填补数字鸿沟关键技术</a></li>
            <li><span>7.</span><a href="#">互联网货运平台要严把“安全关”</a></li>
            <li><span>8.</span><a href="#">手机制造商频发车联网、自动驾驶专利，究竟意欲何为？</a></li>
            <li><span>9.</span><a href="#">百度健康核酸检测线上预约量增10倍</a></li>
            <li><span>10.</span><a href="#">女子因吃了一份被送错的外卖，家门遭泼红漆，饿了么回</a></li>
            <li><span>11.</span><a href="#">井下534米！探秘5G矿山!</a></li>
        </ul>
    </div>
	<script>
        let msgbox = document.querySelector("#msg");
        let ul = document.querySelector("#msg>ul");
        ul.innerHTML += ul.innerHTML;

        function rollup(){
            msgbox.scrollTop += 1;
            if(msgbox.scrollTop == ul.offsetHeight/2){
                msgbox.scrollTop = 0;
            }
        }
        let timerid = setInterval(rollup, 20);
        msgbox.onmouseover = function(){
            clearInterval(timerid);
        }
        msgbox.onmouseout = function(){
            timerid = setInterval(rollup,20);
        }
    </script>
</body>
</html>
```



### 触摸屏 拖动

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>testJS</title>
    <style>
        div{
            width: 200px;
            height: 200px;
            background-color: skyblue;
            position: fixed;
            left: 0px;
            top: 0px;
        }
    </style>
</head>
<body>
    <div id="box"></div>
    <script>
        let box = document.getElementById("box");
        box.ontouchstart = function(e){
            let x = e.targetTouches[0].clientX;
            let y = e.targetTouches[0].clientY;
            let left = parseInt(box.offsetLeft);
            let top = parseInt(box.offsetTop);

            box.ontouchmove = function(e){
                box.style.left =  left + e.targetTouches[0].clientX - x +"px";
                box.style.top = top + e.targetTouches[0].clientY -y +"px";
            }
        }
    </script>
</body>
</html>
```

由于触摸事件和鼠标事件的内容是不同的，所以需要使用不同的方法计算坐标。在鼠标拖动中，我们可以从事件中获取触摸点相对于元素和相对于客户区的坐标，相减之后就是元素的坐标。但是在触摸事件中，我们知道的是触摸点相对于客户区的坐标clientX和元素相对于父元素的坐标offsetLeft，移动过程中相对于客户区的坐标减去按下时的坐标，再加上初始的left和top就是就是当前的left和top



















