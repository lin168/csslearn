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
   var vname; // 声明（定义）一个变量，JS中一切皆对象，默认值是undefined，声明和定义不需要区分。
   var vname1 = "hello"; // 定义时初始化。
   vname = 23; // 省略var关键字时，表示这个变量是全局的。在所有script块中都可以是所有。全局变量定义时必须赋值。
   vname="hello";
   ```

   重复的变量声明会被解释器自动忽略，不会报错。

   注意：在使用(读取)变量之前，必须先进行定义，否则会抛出异常。

7. **数据类型**：JavaScript中有六种数据类型：number 数值型、string 字符串、boolean 布尔型、undefined未定义类型、null空类型、object 对象类型.

   - number 数值型，包括正负、整数、浮点、各种进制、Infinity无线大、NaN(note a number)不存在
   - string 字符串可以用单引号或双引号表示。单双引号可以相互嵌套。转义字符和C语言中一样。
   - boolean 只有true和false两个值
   - undefined 只有undefined一个值，表示值类型不确定。
   - null 与其说是一种类型，不如说是对象类型的一个值，表示空指针对象，表示用来保存对象，但还没有指向真正的对象。也可以用来释放对象
   - object 对象由大括号包围。在括号内部，对象的属性以键值对的形式定义,也就是json(javascript object notion)。比如
     `var person={firstname:"John",lastname:"Doe",age:18};` 键值之间使用冒号分隔，属性之间使用逗号分隔

8. **运算符和表达式**

   - 算数运算符：`+ - * / % ++ --`
   - 比较运算符： `> <  >= <= == !=  === !==` 后面两个分别是绝对等于(值和类型都相同)和不绝对等于(值和类型至少有一个不相同)
   - 逻辑运算符 `&& || !` 与 或 非。
   - 赋值运算符 `= += -= *= \= %= `
   - 位运算符

    运算数据中有字符串时，加法则会把数字转换为字符串进行拼接, 其他运算则把字符串转换为数字进行运算。

    如果无法转换，则结果是NaN，**应该尽量避免**。

   ```js
   var x='5';
   var y =2;
   console.log(x+y); // 52
   console.log(x-y); // 3
   console.log(x*y); // 10
   console.log(x/y); // 2.5
   
   // 比较注意事项
   undefined == null // true
   undefined === null // false， 值相等，类型不同
   
   NaN != NaN // true, NaN是不相等的
   ```

9. 流程控制：分支和循环

   ```js
   // 分支语句
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
   
   // 循环语句
   for(init;cond;op){
       // do something
       
       if(cond){
           break; //结束循环
   	}
       
       continue; // 跳过本次循环
       
   }
   
   
   
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

9. 数组 : 数组的类型是`Array` ,数组中可以存储任意类型的数据，实际上等价于Java中的List，其长度也是自动变化的。

      ```js
   // 定义数组
   var arr = [item1, item2,item3...];
   // 也可以用new Array的方式创建
   var arr = new Array('LiLei','HanMeimei'); // 创建一个数组，数组的内容由参数构成
   var arr = new Array(10); // 定义一个包含10个元素的数组
   
   
   // 数组操作： 增删改查
   // 数组元素可以通过数组名和下标来访问和修改，另外js中不存在数组越界，解释器会自动填充，不存在的元素为empty
   var arr=[];
   arr[5] = 8; // 增
   arr[5] = 3； // 改
   arr[5] = undefined; // 删
   // for 循环遍历，或 for in遍历
   for(var i in arr){
       console.log(arr[i])
   }
   
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
   
   arr.concat(arr1); // 数组元素拼接，返回新的数组
   arr.slice(iStart,iEnd); // 数组切片（截取子数组），索引可以用负值，此时最后一个元素的下标为-1
   arr.indexOf(item, iStart); // 查找第一个符合条件的子元素
   arr.lastIndexOf(item.iStart); // 查找最后一个符合条件的子元素
   
   // 常规操作
   // 1. 字符串和数组的相互转换
   str.split(""); <==> arr.join();
      ```

10. 对象：键值对构成的数据集合，键和值用冒号分隔，键之间用逗号分隔，两端用大括号包围。JavaScript中所有数据都可以被视为对象。键名也就是属性(`property`)

   ```js
   // 定义对象
   var obj={ prop1:value1,prop2:value2};
   
   // 对象的读写（对象属性的读写）,既可以使用点运算，也可以使用方括号
   var obj={key:value};
   console.log(obj.key);  
   console.log(obj["key"]); // 等价于上面的写法，并且这种方式的key可以用变量表示。
   // 对象可以随时添加新的属性
   
   // 对象的遍历 for in
   for (var key in obj){
       
   }
   
   // 对象操作
   'key' in obj // 判断对象是否包含某个属性
   
   // 对象的引用：对象名是对象的引用，一个对象可以有多个引用，他们都可以用来改变这个对象。
   // 赋值操作：传递对象的引用
   
   ```

11. 函数：在JS中，函数时一等公民，也就是说程序的功能由函数构成。JS中函数也是一种特殊对象。

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
    
    // 调用
    funName(param list);
    
    ```

12. 作用域：变量和函数的作用范围，分为全局作用于和局部作用域。

    全局作用域：在整个程序中可用。

    局部作用域：也叫函数作用域。只能在当前函数内使用。

    ```js
    // 全局变量的定义: 全局变量可以在任意位置定义，在定义时不带var关键字就表示是全局变量
    function f(){
        na = 3; // 定义全局变量na
    }
    
    // 局部变量定义：使用var关键字定义的就是局部变量，形参也是局部变量。
    ```





## DOM

DOM 是`Document Object Modal`(文档对象模型)的缩写，指的是HTML元素在JS中的对象抽象，可以用来管理控制HTML文档的元素。

在学习DOM之前，先回顾一下HTML页面的组成：

HTML页面的所有内容包含在一对`HTML`标签中，然后再这对标签中包含`head body`两个子标签，在子标签内部包含其他标签。

显然，它是一个只有一个根节点的树，每个元素都是这颗树中的一个节点。DOM也是采用树形结构来处理HTML元素的。

![dom](http://pic.llsong.xyz:9000/picbed/2021/2/14/dom-173532.png)

当网页被加载时，浏览器会自动创建页面的文档对象模型,通过文档对象模型，JS能改变页面中的所有HTML元素以及CSS样式。



## DOM常用对象

1. document对象

   ```js
   // 常用属性
   document.title // [rw] html文档的标题<title>
   document.location.href // [rw] 当前文档的地址
   
   // 常用方法
   document.getElementById(id:string); // 根据id属性获取元素HTMLElement,id是唯一的，只返回一个元素
   document.getElementsByName(name:string);// 根据name属性获取元素，name可以重复，所以返回的是一个数组
   document.getElementsByTagName(tag:string); // 根据标签名获取元素，同一个标签可以有多个，所以返回的是一个数组
   document.getElementsByClassName(class:string); // 根据class属性获取元素，多个元素可以使用相同的class
   document.querySelector(selector:string); // 使用css选择器来选择元素，返回找到的第一个
   document.querySelectorAll(selector:string); // 使用css选择器来选择元素，返回找到的所有元素
   
   // 创建元素 - 不常用
   document.createElement(tag:strign);// 在document末尾创建一个元素，返回HTMLElement
   
   
   ```

2. HTMLElement对象: 表示`document.getElementBy*` 系列方法返回的元素对象

   ```js
   // 常用属性
   ele.innerText // [rw] 元素中的文本字符串,<div>hello</div> 中的hello
   ele.innerHTML  // [rw]元素中的文本字符串，可以是一个html元素，<a><img /></a>中的<img />
   
   // 常用方法
   ele.getElementsByTagName(tag:string); // 根据标签名获取该元素的子元素
   
   ```

3. HTMLCollection对象：HTMLElement元素的集合



















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

3. 类型转换

   ```js
   var str= "3.14"
   // 字符串转整数  parseInt(str,radix)  基数radix是10
   console.log(parseInt(str));
   //  字符串转浮点数 parseFloat(str,radix)  基数radix默认是10
   console.log(parseFloat(str,radix));
   ```

   转换失败时并不会抛出异常，而是返回`NaN`
   
4. 字符串常用属性和方法

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
   str.replace(oldstr, newstr); // 子字符串替换，支持正则表达式。
   str.split(sep:string); // 分隔字符串，返回数组。用空字符串作为分隔符时，是按字符分隔，也就是把字符串转换为字符数组。未指定分隔符时，则把数组串转换为数组，数组中只有一个元素。
   ```

   需要注意的就是`split`的用法，以及支持正则表达式的`search\match\replace`

5. 数组 : 数组的类型是`Array` ,数组中可以存储任意类型的数据，实际上等价于Java中的List，其长度也是自动变化的。

   ```js
   // 定义数组
   var arr = [item1, item2,item3...];
   // 也可以用new Array的方式创建
   var arr = new Array('LiLei','HanMeimei'); // 创建一个数组，数组的内容由参数构成
   var arr = new Array(10); // 定义一个包含10个元素的数组
   
   
   // 数组操作： 增删改查
   // 数组元素可以通过数组名和下标来访问和修改，另外js中不存在数组越界，解释器会自动填充，不存在的元素为empty
   var arr=[];
   arr[5] = 8; // 增
   arr[5] = 3； // 改
   arr[5] = undefined; // 删
   // for 循环遍历，或 for in遍历
   for(var i in arr){
       console.log(arr[i])
   }
   
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
   
   arr.concat(arr1); // 数组元素拼接，返回新的数组
   arr.slice(iStart,iEnd); // 数组切片（截取子数组），索引可以用负值，此时最后一个元素的下标为-1
   arr.indexOf(item, iStart); // 查找第一个符合条件的子元素
   arr.lastIndexOf(item.iStart); // 查找最后一个符合条件的子元素
   
   // 常规操作
   // 1. 字符串和数组的相互转换
   str.split(""); <==> arr.join();
   ```

   













