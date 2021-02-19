# JavaScript笔记

在前端开发中，HTML语言用来定义网页的内容，CSS用来定义网页的布局和样式，JavaScript则用来对网页进行编程。

## JavaScript是什么

JavaScript是一种网页脚本语言，由浏览器中的解析器执行。它的出现是为了解决浏览器中页面与用户交互的问题。1995年5月，网景公司对这门要设计的语言是“必须看上去与Java足够相似，但还要比java简单，使得非专业的网页作者也能很快上手”。被安排做这项工作的人就是Brendan Eich。作为JavaScript之父，实际上它只是为了应付公司安排的工作，甚至是设计这门语言只用了10天。基本的设计思路是这样的：

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

1. 执行顺序

   一个HTML页面中可以嵌入多个script块，他们按照在HTML中引入的顺序，从上到下依次执行。在每个块内部也按照从上到下的顺序执行。并且一个脚本的异常不会影响其他其他脚本的运行。

2. **注释**

   单行注释： //   多行注释： /**/

3. **语句**使用分号或换行分隔，习惯上为每条语句添加分号结尾

4. **标识符**：由数字、字母、下划线、$组成，并且不能以数字开头。标识符的作用是唯一表示一个变量、函数或对象等程序中自定义事物，**大小写敏感**

5. **变量**：和大部分脚本语言一样，JavaScript中的变量也是动态类型的，也就是说变量的类型会根据其值的类型自动变化，当然对于特定的值，其类型时固定的。常用操作如下：

   ```js
   // 定义变量的关键字是var 和let，var是ES5中的变量定义方式，let是ES6中新增的变量定义方式，推荐使用
   let vname; // 声明（定义）一个变量，JS中一切皆对象，默认值是undefined。
   let vname1 = "hello"; // 定义时初始化。
   /* 
   var 和 let的区别：
   1. var 声明的变量会自动把声明提前，let不会
   2. var声明的变量只有函数作用域和全局作用域两种，let声明的变量是块作用域(当然也可以作用全局的使用)。
   /*
   ```

   重复的变量声明会被解释器自动忽略，不会报错。

   ```js
   // 定义变量时也可以不加var或let关键字，比如vname="hello",实际上这个变量会作为一个属性被添加到window对象上，window对象的方法和属性可以直接使用。不需要 [window.]
   ```

   注意：在使用(读取)变量之前，必须先进行定义，否则会抛出异常。

6. **常量**： 常变量，也就是值不能修改的变量，用const修饰，ES6新增。

7. **数据类型**：JavaScript中有六种数据类型：number 数值型、string 字符串、boolean 布尔型、undefined未定义类型、null空类型、object 对象类型。另外需要了解的是JS是动态类型的、弱类型的语言。

   - number 数值型，包括正负、整数、浮点、各种进制、Infinity正无穷、-Infinity负无穷、NaN(note a number)不存在
   - string 字符串可以用单引号或双引号表示。单双引号可以相互嵌套。转义字符和C语言中一样。
   - boolean 只有true和false两个值
   - undefined 只有undefined一个值，表示值类型不确定。
   - null 与其说是一种类型，不如说是对象类型的一个值，表示空指针对象，表示用来保存对象，但还没有指向真正的对象。也可以用来释放对象
   - object 对象类型，JavaScript中一切皆对象，包括数组、函数等都是通过对象来提供的。
   - function 函数类型，通常归结到对象中。但是js中的函数是作为一等公民设计的，所以函数的很多特性跟面向对象中的函数并不一样。

8. **动态类型和弱类型**

   - 动态类型指的是一个变量可以在不同的时刻保存不同类型的数据，用面向对象的方法理解就是Object根对象的引用
   - 弱类型指的是在使用变量时，不必可以强调变量的类型，解释器会自动对变量进行类型转换，从而满足操作要求。当然隐式类型转换是由很大的限制和弊端的，还是要尽量避免。

9. **运算符和表达式**

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
   
14. 作用域：变量和函数的作用范围，分为全局作用于和局部作用域。

    全局作用域：在整个程序中可用。

    局部作用域：也叫函数作用域。只能在当前函数内使用。

    ```js
    // 全局变量的定义: 全局变量可以在任意位置定义，在定义时不带var关键字就表示是全局变量
    function f(){
        na = 3; // 定义全局变量na
    }
    
    // 局部变量定义：使用var关键字定义的就是局部变量，形参也是局部变量。
    ```

15. 严格模式：为了规范js代码，可以选择性开启

    ```js
    // 开启严格模式
    'use strict';
    // 后面的代码将按照严格语法模式进行检查
    ```




## 流程控制

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



## 数组

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



## 对象

键值对构成的数据集合，键和值用冒号分隔，键之间用逗号分隔，两端用大括号包围。JavaScript中所有数据都可以被视为对象。键名也就是属性(`property`)

``` js
// 定义对象
var obj={ 
	prop1:value1,
    prop2:value2,
    ...
    propn:function(){} // 方法成员的定义方式和属性一样
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



## 函数

在JS中，函数是一等公民(first class)，也就是说程序的功能由函数构成。JS中函数也是一种特殊对象。

函数用`function`关键字定义，函数名就是标识符，函数的参数个数和类型都是任意的。返回值未指定时是`undefined`,也可以指定为任意数据，但只能有一个。

```js
// 函数定义，在执行时，会首先声明块中定义的函数。
function funName(param1,param2...){
    // do something
    return; //可以返回任何值
}

// 匿名函数
var fName = function(param1,param2...){
    // function body
}

// 调用，实参类型必须与形参一致，多余的实参会被丢弃，不会报错
funName(param list);
    
```


## 异常捕获

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

DOM 是`Document Object Model`(文档对象模型)的缩写，也就是HTML文档的内存对象表示模型。使用DOM可以方便的对HTML文档中的内容进行管理---增删改查。

在深入学习DOM之前，先回顾一下HTML页面的组成：

HTML页面的所有内容包含在一对`HTML`标签中，然后在这对标签中包含`head body`两个子标签，在子标签内部包含其他标签。在数据结构上，它就是一棵树，每个标签都是一个节点，另外标签中的文本作为该标签的子节点，标签的属性作为该标签的兄弟节点，注释也作为单独的节点处理。 

![dom](http://pic.llsong.xyz:9000/picbed/2021/2/14/dom-173532.png)

在通过DOM对HTML文档进行操作时，也要按照树形结构的思想进行。比如添加子元素，就是在一个节点中添加子节点。一个元素的父元素、子元素、兄弟元素等就对应着父节点、子节点、兄弟节点。

在浏览器中进行页面显示要经过解析、布局、渲染三个步骤：解析又分为HTML解析、CSS规则解析。HTML 解析的结果就是DOM树，HTML文档中的任意一个元素、属性、文本等内容都对应着DOM中的一个节点。CSS解析则是在DOM的基础上为HTML元素关联样式。

布局就是按照从上到下，从左到右，从外到内的顺序来依次定位DOM树中的元素。块级元素独占一行，行内元素在显示不完时自动换行。对float的元素在其父元素内容重新处理布局，对有position属性的元素重新定位，最终要实现的目标就是确定每一个元素的位置和大小。

渲染就是把布局之后的DOM元素显示到浏览器窗口中，渲染完成后就可以看到最终的页面效果了。

JavaScript的解析执行则是js解析器中进行的，使用JS对DOM进行操作时，结果可以实时的反映在渲染的窗口中。



### DOM对象操作

JavaScript中表示DOM根节点的对象是`document`,它代表整个文档。文档的操作主要包括增删改查和事件

1. 查询元素【选择元素】

   ```js
   document.getElementById(id:string); // 根据id属性获取元素HTMLElement,id是唯一的，只返回一个元素
   document.getElementsByName(name:string);// 根据name属性获取元素，name可以重复，所以返回的是一个数组
   document.getElementsByTagName(tag:string); // 根据标签名获取元素，同一个标签可以有多个，所以返回的是一个数组
   document.getElementsByClassName(class:string); // 根据class属性获取元素，多个元素可以使用相同的class
   document.querySelector(selector:string); // 使用css选择器来选择元素，返回找到的第一个
   document.querySelectorAll(selector:string); // 使用css选择器来选择元素，返回找到的所有元素
   ```

   使用`document`来调用这些方法就是在整个文档中查找，也可以通过某个元素对象来调用这些方法，表示在这个元素内查找，不过只能使用一部分查找方法，比如`getElementsByTagName(tag)`。

2. 增加元素， 很少会使用JS增加元素，了解即可

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
   parentEle.appendChild(element); // 在父节点最后插入子节点
   brotherEle.insertBefore(element); // 在兄弟节点之前插入子节点
   ```

3. 删除元素

   ```js
   // 1. 首先要选择元素
   // 2. 通过其父节点来删除该节点
   parentNode.removeChild();
   
   // 删除属性
   element.removeAttribute();
   ```

4. 修改元素

   ```js
   // 1.选择元素 
   // 2.替换节点
   parentNode.replaceChild(eleOld,eleNew);
   
   // 3.修改元素的文本
   element.innerHTML
   element.innerText
   
   // 4. 读写属性
   element.getAttribute(name); // 返回属性的值，没有属性时返回null
   element.setAttribute(name,value);
   element.removeAttribute(name);
   
   // 5.使用style属性对象来修改样式（element.style）
   element.style.width="300px"
   element.style.backgroundColor="red"; // 属性名中的-会去掉，之后的首字母大写
   element.style.cssFloat = "left"; 
   // 5.1 等价于
   element.style.cssText="width:300px;background-color:red;float:left;"
   
   // 6. 使用className属性来修改class属性
   element.className=name;
   ```

5. 事件：用户在元素上进行的鼠标、键盘操作称为事件，另外浏览器在处理文档处理中的某些特殊的状态也称为事件，比如页面加载完成，页面开始卸载等。对事件的处理就是为事件添加一个响应函数，在响应函数中处理事件内容

   ```js
   // 常用事件
   onclick    鼠标在元素上按下又松开：单击
   ondblclick 双击
   onkeydown  按键按下
   onkeyup    按键松开
   onkeypress 焦点在一个元素按下按键又松开
   onmousedown 鼠标在元素上按下
   onmouseup  鼠标在元素上松开
   onmousemove 鼠标移动
   onmouseover 鼠标进入，子元素会自动绑定此事件，也叫做支持冒泡
   onmouseout  鼠标离开
   onmouseenter 鼠标进入，区别是子元素不会自动绑定此事件，也叫做不支持冒泡
   onmouseleave 鼠标离开
   
   // 使用实例
   // 1. 在标签的事件属性中指定要执行的js代码
   <div onclick="alert('clicked');">hello</div> 
   -------------------------------------
   function handleClick(){
       // do something
   }
   // 执行的是一个函数
   <div onclick="handleClick();" >hello</div> 
   
   // 2. 通过元素对象指定事件处理函数[可以用命名函数，也可以用匿名函数]
   var btn = document.getElementById("btn");
   btn.onclick = function(){
       // do something
   }
   ```

   



其他内容：

```js
document.title // [rw] 文档的标题元素中的文本
document.body  // [rw] 文档的body元素

element.nodeName // [r] 节点名称：元素名、属性名、#text、#document等
element.nodeValue // [r] 节点的当前值
element.nodeType // [r] 节点类型（元素1，属性2，文本3，注释8，文档9）
```







## 特殊语法

1. 变量声明提前

   ```js
   console.log(a); // undefined
   var a=100;
   console.log(a); // 100
   ```

   执行第一行代码并不会抛出异常，因为解释器在开始执行脚本中的代码块之前自动声明代码块中的所有变量，之后脚本中的声明语句会被自动忽略，只执行赋值操作。

2. typeof 获取变量类型

   ```js
   // typeof :关键字， 后跟变量名可以获取变量的类型，比如
   var num = 6;
   console.log(num, typeof num);
   if(typeof num == "number"){
       console.log("is number");
   }
   ```

3. 数据类型转换

   ```code
   [字符串转数值] 以下函数均会自动去除首尾的空白符
   1. Number(str): 可转换整数和浮点数，字符串数字不合法时，返回NaN。
   2. parseInt(str,radix): 字符串转整数。radix是基数，也就是进制,可省略。逐字符进行转换，遇到无法转换的字符则返回。
   3. parseFloat(str,radix)：字符串转浮点数。radix是基数，可省略。同样逐字符转换。
   
   [浮点数转整数]
   ```
   
1. parseInt(fnum,radix);参数同样可以是浮点数，小数部分直接丢弃
   2. Math.round(); 四舍五入
   3. Math.floor(num); 小于num的最大整数
   4. Math.ceil(num); 大于num的最小整数
   
   
   [数值转字符串]
   1. 利用+运算符，数字加空字符串时会自动转换为字符串
   2. 利用变量（对象）的toString()方法
   let num = 3.14;
   console.log(num.toString());
   3. 利用String对象的构造函数String(num); 它可以转换的各种类型的数据
   ```
   
   转换失败时并不会抛出异常，而是返回`NaN`
   ```
   
5. 字符串常用属性和方法

   ```js
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

6. 模板字符串：使用反引号包围，中间用${}包围JS表达式

   ```js
   console.log(`${num1}+${num2}=${sum}`);
   ```

7. 数值型对象的方法

   ```js
   let num = Math.PI;
   console.log(num.toFixed(2)); // 保留两位小数 "3.14"
   console.log(num.toPrecision(2)); // 数据精度，3.1
   ```

   



















