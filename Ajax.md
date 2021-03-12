# AJAX

AJAX 全称是Asynchronous JavaScript and XML，也就是浏览器中提供的一种通过JavaScript异步向服务器发送请求的方法。

它最大的优势就是结合DOM操作，只进行关键数据的交换，就能实现页面内容的更新。



## XMLHttpRequest

异步JS请求就是通过浏览器提供的XMLHTTPRequest对象实现的，从名字也可以看出来，它早期是通过XML进行数据交换的。

在IE5和IE6中，是通过ActiveX提供的实现，从IE7开始，所有现代的浏览器都提供了这个对象。

```javascript
let xhr = new XMLHttpRequest(); // 创建XMLHttpRequest对象
xhr.open("GET","/test", true);  // 初始化对象，参数分别是method，url，async(true异步，false同步)
xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded"); // 设置请求头信息
xhr.send(data);					// 建立连接，发送数据
xhr.onreadystatechange = function(){
    // 根据xhr对象的readyState属性变化来判断状态，0初始，1已连接，2开始发送，3发送完成，4接收完成
    if(xhr.readyState==4 && xhr.status == 200){
       // success
        xhr.responseText; // 字符串形式返回的响应数据
        xhr.responseXML;  // XML形式返回的响应数据,浏览器中提供了XML解析的方法
    }else{
        // fail
    }
}
```

上面介绍了相关API的使用，另外，针对GET请求和POST请求的调用方式是不同的

```js
// GET 请求的发送方式,发送的数据都是在URL中的
let xhr = new XMLHttpRequest();
let url = "/test?username=admin&passwd=12345";
xhr.open('get',url,true);
xhr.send();
xhr.onreadystatechange = function(){
    if(xhr.readyState==4 && xhr.status == 200){
        // success
    }
}
```

```js
// POST 请求的发送方式
let xhr = new XMLHttpRequest();
xhr.open('post','/test',true);
xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
let data = `username=${username}&password=${passwd}`;
xhr.send(data);
xhr.onreadystatechange = function(){
    if(xhr.readyState==4 && xhr.status == 200){
        // success
    }
}
```

Get请求中的数据都是放在请求头中发送出去的，没有请求体，而Post请求中的数据时放在请求体中发送出去的，需要使用`setRequestHeader`指定数据类型，数据类型 包括以下三种：

- application/x-www-form-urlencoded 发送表单数据，内容会自动进行 urlencode
- multipart/form-data 发送multipart表单，带有文件数据
- text/plain 发送普通文本数据







## jQuery中使用AJAX

在jQuery中通过对XMLHttpRequest进行封装来提供异步JavaScript请求功能。封装的方法就是`$.ajax`

```js
$.ajax({
    type:'', // 请求方式， get post
    url:'',  // 请求的地址
    data:{   // 发送到服务端的数据，会自动转换为查询字符串(?key=value&key1=value1)
        key:value,
    },
    dataType:'', // 返回数据的类型，注意是返回的数据，json、jsonp、xml、text、html等
    async:'', // 是否异步发送，默认是true，一般不会使用同步
    cache:'', // 是否缓存请求的内容
    contentType:"", // 内容编码类型，默认值application/x-www-form-urlencoded
    context: "",  // 设置回调函数的上下文，也就是this对象
	jsonp: "", 	  // 服务器端接收回调函数的参数名，默认是callback
    jsonpCallback: "", // 为jsonp请求指定一个回调函数名
    success: function(res){ // 参数是返回的数据xhr.responseText
    	// do something
	},
    error:function(err){ // 失败时的回调函数
        // handle error
    }
    beforeSend:function(xhr){ // 连接成功之后，发送请求之前调用，也就是readyState为1，
        // 
    },
    complete:function(xhr,type){   // 请求完成，在调用success或error之后调用
        // do some always
    },
});

```

说明： 如果dataType为json，那么success函数的参数就是json字符串转换为的对象



另外jquery中也对get请求或post请求进行了封装，从而针对特定的情况简化调用

```js
$.get('url',{data}，function(res){/*success*/},'return data type');
$.getJSON('url',{key:value,...},callback);
$.post('url',{data},callback,'return data type');
```









































