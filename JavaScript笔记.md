# 原型与面向对象

JavaScript是一门面向对象的语言，所以它同样支持面向对象的特性。但是由于设计时参考了Self语言(一种基于原型的面向对象程序设计语言)，所以JavaScript面向对象的特性也是由原型实现的。



https://www.cnblogs.com/loveyaxin/p/11151586.html

https://zhuanlan.zhihu.com/p/104203618

https://blog.csdn.net/yucihent/article/details/79424506



## 面向对象

JavaScript中的面向对象参考了Self语言，它取消了类的概念，只有对象的概念。同时，由于JavaScript中方法也是一种对象，所以成员方法同样用属性表示。



### 创建对象的三种方式

1. 通过字面量创建
2. 通过`new Constructor()`, Constructor表示构造函数，本质上它就是普通的函数，但由于功能上，它只与new配合来初始化对象，所以为了区分，采用大驼峰来命名。
3. 通过Object对象来创建对象
4. 通过原型创建对象

```js
// 字面量方式创建，对象中包括三个属性attr1,attr2,attr3,其中attr3定义的是getter/setter访问器，内部读写的是attr1的内容，另外对象中包含一个函数成员属性。在成员函数体中可以使用this指针访问对象的属性
let obj = {
    attr1: "value1",
    attr2: 1,
    get attr3(){  // getter
        return this.attr1;
    },
    set attr3(val){ // setter
        this.attr1 = val;
    },
    do: function(){
        console.log("method");
    }
};

// 采用new构造函数的方式创建
function Person(name,age){
    this.name = name;
    this.age = age;
    this.say = function(){
        console.log("hello");
    }
} 
let p = new Person("tom",18);

// 通过Object创建空对象
let obj = new Object();

// 通过原型模式创建对象
let person = Object.create(Person.prototype) // 创建Person对象
```



### 构造函数(构造器)

对象除了可以用字面量`{}`来创建，还可以用其构造函数创建。构造函数就是普通函数，只是人为的赋予其创建对象的角色。所以为了与普通函数进行区分，通常将其首字母大写，采用大驼峰命名。

JavaScript中函数也是一种特殊的对象，所以它也有自己的属性和方法`fun.call();  fun.__proto__  fun.prototype`。另外它作为方法，也可以通过`fun();`的方式调用。与原型相关的就是它的`__proto__ 和prototype`属性。

在构造函数内部可以用this表示要创建的对象，并可以通过this为其添加属性和方法。

```js
function ClassName(args){
    this.attr1 = attr1;
    ...
    this.method1 =  function(){}
}

let ins = new ClassName(args);
```

需要注意，如果直接调用构造函数，那么this代表window对象，如果用new调用构造函数，this代表新创建的对象（new会先创建一个空对象），当然只有使用new调用构造函数才能创建对象。

### 私有属性和方法(了解)

构造函数内定义的变量和方法就是私有方法

```js
function Student(name,age){
    // 公有属性
    this.name = name;
    this.age  = age;
    
    this.dosomething = function(){
        console.log(tmp);
        test();
    }
    
	// 构造函数内定义的局部变量和方法就是私有属性和
    let tmp = 200;
    function test(){
        console.log("test");
    }
}
```





### 其他

- 类型对象判断  `instanceof`

- 判断对象中是否有属性 `obj.hasOwnProperty(key)`， 不包含原型上的属性

- 判断对象中是否有某个属性 `key in obj`,包含原型上的属性


```js
function Person(name,age){
    this.name=name;
    this.age = age;
}

function Student(name,age,score){
    Person.call(this,name,age);
    this.score = score;
}

let s = new Student('tom',18,99);

if(s instanceof Student){ // 判断对象的类型
	// true
}
if(s instanceof Person){ // 注意，继承时，子类对象不属于父类型
    // false
}

```



## 原型

编程语言在涉及时都会考虑到开发中的代码复用问题，比如函数、类等。通过字面量定义对象的方式是无法进行代码复用的，每个对象中的属性和方法都要重新定义。通过构造器的方式，只需要定义一次就可以生成多个同样结构的对象。但是由于方法是作为成员属性添加到对象上的，每个对象中都会保存一份方法实现，显然，这会造成内存空间的浪费，为了解决这个问题就需要使用原型。

原型是一个与特定构造函数关联的对象，所有使用这个构造函数创建的对象都有一个属性`__proto__`指向原型对象。与构造函数向关联的原型可以用`prototype`属性获取。而每个对象都有一个`__proto__`属性，可以用它获取原型对象。

```js
function Person(name,age){
    this.name = name;
    this.age = age;
}

let p1 = new Person('Tom',18);
let p2 = new Person('Lili',16);

p1.__proto__ === p2.__proto__ === Person.prototype
// 所有使用这个构造函数创建的对象，都指向与构造函数关联的原型对象。
```

另外，原型也是一种机制：当在一个对象obj上访问某个属性时，如果这个属性不存在，那么变回去对象的原型(`obj.__proto__`)上找这个属性，如果还没有就去原型对象的原型(`obj.__proto__.__proto__`)上找，直到找到Object()的原型对象，也就是原型的跟对象，Object原型的原型为null(`Object.prototype.__proto__ === null`)。

我们可以在原型对象上添加属性和方法，在原型机制下，只需要把公用属性和方法添加到原型对象上，就可以供所有对象使用。另外，在原型对象上添加的方法中，this指针表示的是调用此方法的对象，而不是原型对象。

通过这种机制，就做到了使用一份方法对象，供所有这个类型的对象使用。



## 原型链

所有对象都有一个`__proto__`属性，原型对象也不例外。另外所有原型对象都有一个`__constructor__`属性，这个属性指向构造函数对象本身。

默认情况下，原型对象的`__proto__` 指向Object()构造函数的原型对象，可以在代码中修改它，使他指向其他的对象的原型对象，这样就构成了一个原型链。原型链的工作原理就是上面介绍的原型机制。



另外值得注意的是函数也是对象，所以它也有`__proto__`属性，这个属性指向的是`Function()`对象关联的原型对象：`Person.__proto__ === Function.prototype`





# 闭包

闭包函数是指在函数内使用外部局部变量的函数。比如

```js
function outer(){
    var num = 1;
    return function(){
        console.log(num++);
    }
}

let closure1 = outer();
let closure2 = outer();
closure1(); // 1
closure1(); // 2
closure2(); // 1
```

每次调用`outer()`,都会返回一个函数对象，函数对象中引用的外部函数的局部变量会被保存到堆中，当外部函数执行完毕后，这块内存由闭包函数引用，所以不会释放。直到闭包函数的引用全部失效后，闭包函数对象连同堆中的数据空间一同释放。

在上面的示例中，还有一点需要注意，每次调用`outer()`返回的闭包函数内部使用的num变量都是不同的。







































