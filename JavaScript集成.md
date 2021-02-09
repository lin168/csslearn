# JavaScript 集成

原文地址： https://bitbucket.org/chromiumembedded/cef/wiki/JavaScriptIntegration

JavaScript集成包括两方面的操作：

- 在JS代码中调用C++实现的接口
- 在C++代码中调用页面的JS方法



## 介绍

Chromium 和Chrome使用V8 JavaScript 引擎作为内置的JS实现。浏览器中每一个frame都有它自己的JS上下文，用来限制JS代码执行的范围和安全性。CEF为客户端应用提供了大量JS特性。

在Cef3中Blink渲染引擎和JS执行在一个单独的render进程中执行。render进程的主线程被标记为TID_RENDERER,所有的V8操作都必须在这个线程中执行。回调相关的JS操作通过`CefRenderProcessHandler`接口提供。

browser进程和render进程通信的API应该使用异步回调，参考GeneralUsage中的异步JavaScript绑定。



## 执行JavaScript

执行JS最简单的方式是` CefFrame::ExecuteJavaScript()` 。这个方法在browser进程和renderer进程都可以用，也不需要js上下文。

```c
CefRefPtr<CefBrowser> browser = ...;
CefRefPtr<CefFrame> frame = browser->GetMainFrame();
frame->ExecuteJavaScript("alert('ExecuteJavaScript works!');", frame->GetURL(), 0);
```

上面的代码将会在浏览器的主frame中执行`alert('ExecuteJavaScript works!');`

`ExecuteJavaScript()`中也可以使用JS上下文中的函数的变量。要获取JS的返回值可以考虑使用下面的窗口绑定和扩展。

## Window 绑定

窗口绑定允许客户端应用把变量附加到 js的`window`对象。窗口绑定在`CefRenderProcessHandler::OnContextCreated()` 方法中使用。

```c
void MyRenderProcessHandler::OnContextCreated(
    CefRefPtr<CefBrowser> browser,
    CefRefPtr<CefFrame> frame,
    CefRefPtr<CefV8Context> context) {
  // 获取全局上下文中的window对象
  CefRefPtr<CefV8Value> object = context->GetGlobal();

  // 创建一个V8字符串
  CefRefPtr<CefV8Value> str = CefV8Value::CreateString("My Value!");

  // 把字符串对象添加到window对象上
  object->SetValue("myval", str, V8_PROPERTY_ATTRIBUTE_NONE);
}
```

之后这个浏览器中的页面就可以在JS中通过`window.myval`来使用这个变量了。

```html
<script language="JavaScript">
alert(window.myval); // Shows an alert box with "My Value!"
</script>
```

当frame重新加载时，窗口绑定就会重新加载，从而时客户端应用在必要时更改绑定。



## 扩展

扩展和窗口绑定类似，但是会被加载到每一个frame的上下文中，并且一旦加载完成就无法修改。当扩展加载时，DOM还不存在，如果在扩展加载中尝试访问DOM可能会导致崩溃。扩展使用`CefRegisterExtension()`注册，并且应该在` CefRenderProcessHandler::OnWebKitInitialized()`中调用。

```c
void MyRenderProcessHandler::OnWebKitInitialized() {
  // Define the extension contents.
  std::string extensionCode =
    "var test;"
    "if (!test)"
    "  test = {};"
    "(function() {"
    "  test.myval = 'My Value!';"
    "})();";

  // Register the extension.
  CefRegisterExtension("v8/test", extensionCode, NULL);
}
```

`extensionCode`代表的字符串可以是任意有效的JS代码，然后所有frame中的代码都可以使用这些方法。

```html
<script language="JavaScript">
alert(test.myval); // Shows an alert box with "My Value!"
</script>
```



## 基本JS 类型

CEF 支持创建基本JS数据类型，包括 `undefined null bool int double date string`。 这些类型的变量可以使用`CefV8Value::Create*()`来创建。比如

`CefRefPtr<CefV8Value> str = CefV8Value::CreateString("My Value!");` 创建一个JS 字符串

基本类型的变量可以在任意时间创建，并且不需要关联到特定的上下文，要判断一个CefV8Value的类型，可以用`Is*()`方法。

```c
CefRefPtr<CefV8Value> val = ...;
if (val.IsString()) {
  // The value is a string.
}
```

要获取CefV8Value的值，可以使用`Get*Value()`方法。

```c
CefString strVal = val.GetStringValue();
```

## JS Arrays

js 数组对象使用`CefV8Value::CreateArray()`方法创建，它的参数是数组长度。数组对象只能在上下文中创建和使用。

```c
// 创建一个长度为2的数组
CefRefPtr<CefV8Value> arr = CefV8Value::CreateArray(2);

// 添加两个值
arr->SetValue(0, CefV8Value::CreateString("My First String!"));
arr->SetValue(1, CefV8Value::CreateString("My Second String!"));
```

使用`IsArray()`方法判断`CefV8Value`是否是数组。使用`GetArrayLength()`获取数组的长度。`GetValue(index)`获取数组中的值。



## JS Objects

对象使用`CefV8Value::CreateObject()`方法创建，它由一个可选参数`CefV8Accessor`。对象只能在上下文中创建和使用

```c
// 创建对象
CefRefPtr<CefV8Value> obj = CefV8Value::CreateObject(NULL);

// 为对象添加成员
obj->SetValue("myval", CefV8Value::CreateString("My String!"));
```



### 带访问器的对象

访问器用于get/set 对象的成员

```c
CefRefPtr<CefV8Accessor> accessor = …;
CefRefPtr<CefV8Value> obj = CefV8Value::CreateObject(accessor);
```

必须提供CefV8Accessor接口的实现

```c
class MyV8Accessor : public CefV8Accessor {
public:
  MyV8Accessor() {}

  virtual bool Get(const CefString& name,
                   const CefRefPtr<CefV8Value> object,
                   CefRefPtr<CefV8Value>& retval,
                   CefString& exception) OVERRIDE {
    if (name == "myval") {
      // Return the value.
      retval = CefV8Value::CreateString(myval_);
      return true;
    }

    // Value does not exist.
    return false;
  }

  virtual bool Set(const CefString& name,
                   const CefRefPtr<CefV8Value> object,
                   const CefRefPtr<CefV8Value> value,
                   CefString& exception) OVERRIDE {
    if (name == "myval") {
      if (value->IsString()) {
        // Store the value.
        myval_ = value->GetStringValue();
      } else {
        // Throw an exception.
        exception = "Invalid value type";
      }
      return true;
    }

    // Value does not exist.
    return false;
  }

  // Variable used for storing the value.
  CefString myval_;

  // Provide the reference counting implementation for this class.
  IMPLEMENT_REFCOUNTING(MyV8Accessor);
};
```



## JS 函数





### window绑定函数





## 扩展函数





## 工作上下文



## 执行函数



### 使用JS 回调



### 重新抛出异常











