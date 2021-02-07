# GeneralUsage

这篇教程讲解了CEF中大部分通用的内容，在深入研究之前，这篇文档是必须深入理解。



## 介绍

CEF框架是一个基于Google Chromium的开源项目。Chromium项目主要聚焦在谷歌Chrome应用开发商，而CEF则聚焦在简化第三种应用中嵌入浏览器的使用情况。CEF通过提供产品级的稳定API，从而隔离了Chromium和Blink代码的复杂性。CEF的发布分支全完跟踪Chromium的发布。CEF中的大部分特性都提供了默认实现，用户只需少量的集成工作就可以提供丰富的功能。正如这篇文章说的，全世界已经有超过1亿个CEF实例安装在各种公司和行业的产品中。CEF的用例包括：

- 在本地应用中嵌入一个支持HTML5的Web浏览器控件
- 创建一个轻量的本地外壳应用来使用Web技术开发的用户接口
- 在应用中使用自定义绘制框架 离屏渲染Web内容(off-screen)
- 作为Web应用的自动化测试程序

CEF3是新一代的基于多进程的Chromium 内容API。CEF3多进程架构的高级特性包括：

- 改进了性能和稳定性（JavaScript 和 插件运行在独立的进程）
- 支持Retina显示
- 支持WebGL和3D CSS的 GPU加速
- 支持WebRTC、webcam、语音输入等新特性
- 更好的自动化UI测试，基于DevTools的远程测试协议和ChromeDriver2
- 更快的支持当前和未来的Web特性和标准

这篇文档介绍使用CEF3开发时的通用内容。



## 开始

使用二进制发布包，从[项目下载页](http://www.magpcss.net/cef_downloads/) 下载发布包，选择指定平台的版本。发布包中包括cefclient、cefsimple等示例项目以及头文件、库文件(Debug\Release)、资源文件(Resources)、以及C++包装库(libcef_dll)。详细的参考发布包中的`Readme.txt`。

基于CEF二进制发布包的应用可以使用平台的标准构建工具来构建，比如Windows上的VS，MacOS的Xcode以及Linux上的gcc/make/clang等。

开发者也可以直接使用源码进行构建，这需要同时下载Chromium和CEF源代码。Chromium源代码非常庞大，对硬件的要求较高。详细方法可以参考BranchesAndBuilding。

注意：发布包中有开源license文件，所有使用了CEF的产品在发布时都需要在产品中包含此license.txt文件。另外在URL中输入chrome:license 和 chrome:credits也可以查看。(资源文件中已包含了这些内容)



## 示例应用

cefclient示例程序是一个完整的集成CEF的示例。使用CEF创建新应用的最简单的方式就是从cefclient开始，删除不需要的功能即可。这篇文章中的很多示例代码都来自于cefclient应用。



## 重要概念

基于CEF3的应用开发中有一些重要的概念要理解。

### C++ Wrapper

libcef项目最开始暴露的是C API接口，libcef_dll_wrapper项目(在二进制发布包中可以找到源码)则是对C API进行了C++API的包装。C++应用程序中需要先连接这个项目生成的静态库(`libcef_dll_wrapper.lib`)。C/C++ API转换层是通过[translator](https://bitbucket.org/chromiumembedded/cef/src/master/tools/translator.README.txt?at=master)工具自动生成的。也可以参考[UsingTheCAPI](https://bitbucket.org/chromiumembedded/cef/wiki/UsingTheCAPI.md)中说明来使用 C API开发。

### 进程

CEF3以多进程模式运行。主进程用来处理窗口创建、绘制和网络访问，叫做browser进程。它通常就是宿主程序程序，所以应用的主逻辑也是在browser进程中执行的。`Blink`渲染和`JavaScript`执行是在`render`进程中进行的。一些应用逻辑，比如JavaScript绑定和DOM访问，也是在`Render`进程中执行的。默认的[进程模型](http://www.chromium.org/developers/design-documents/process-models)会针对每一个站点(scheme+domain 不区分子域名和端口)启动一个render进程，其他进程会在需要时创建，比如plugin进程会在处理插件时创建，gpu进程在处理显卡加速显示时启动。

默认情况下，会多次启动主程序来创建子进程。内部通过命令行参数传递给`CefExecuteProcess`来实现。如果主程序可执行程序很大，加载慢，那么可以使用单独的可执行程序来启动子进程。只需要指定`CefSettings.browser_subprocess_path`就可以了。

CEF3进程之间使用IPC通信，browser进程和render进程之间可以相互发送异步消息。Render进程集成的JavaScript 可以通过异步API来传递给Browser进程处理





### 线程

每个CEF3进程都包含多个线程，完整的线程列表参考[cef_thread_id_t](http://magpcss.org/ceforum/apidocs3/projects/(default)/cef_thread_id_t.html) ,常用的线程如下

- `TID_UI`是 browser进程的主线程，同时如果在这个线程中设置`CefSettings.multi_threaded_message_loop`为false，并调用`CefInitialize()` ,那么它也应该是应用程序的主线程
- `TID_IO` 是browser进程中处理IPC和网络消息的线程
- `TID_FILE`是browser进程中和文件系统交互的线程，这个线程可以执行阻塞操作。
- `TID_RENDERER`线程是render进程的主线程，所有的Blink和V8交互必须在这个线程中执行。

由于CEF3的多线程本质，使用消息传递和消息锁来保护数据成员是非常重要的。`CefPostTask`相关函数支持简单的同步消息传递。

当前线程可以使用`CefCurrentlyOn()`函数来判断。同时也可以使用一些相关的宏。

```c
#define CEF_REQUIRE_UI_THREAD()       DCHECK(CefCurrentlyOn(TID_UI));
#define CEF_REQUIRE_IO_THREAD()       DCHECK(CefCurrentlyOn(TID_IO));
#define CEF_REQUIRE_FILE_THREAD()     DCHECK(CefCurrentlyOn(TID_FILE));
#define CEF_REQUIRE_RENDERER_THREAD() DCHECK(CefCurrentlyOn(TID_RENDERER));
```

CEF提供`base::Lock`和`base::AutoLock` 来同步多个线程。

```c
// 头文件
#include "include/base/cef_lock.h"

// 类声明
class MyClass : public CefBase {
 public:
  MyClass() : value_(0) {}
  // 模拟在多个线程中使用的，访问共享数据的操作。
  void IncrementValue();
 private:
  // 数据
  int value_;
  // 锁对象
  base::Lock lock_;
  IMPLEMENT_REFCOUNTING(MyClass);
};

// 实现
void MyClass::IncrementValue() {
  // 申请锁的范围：从申请到锁到方法结尾
  base::AutoLock lock_scope(lock_);
  // 申请到锁之后就可以安全使用数据了。
  value_++;
}
```



### 引用计数

所有框架类继承自`CefBase`接口，所有实例指针使用`CefRefPtr`智能指针处理。最简单的实现一个类的方式是：

```c
class MyClass : public CefBase {
 public:
  // 类的公有内容

 private:
  // 类的私有内容

  IMPLEMENT_REFCOUNTING(MyClass);  // 提供原子级引用计数实现。
};

// References a MyClass instance
CefRefPtr<MyClass> my_class = new MyClass();
```



### 字符串

Cef定义了自己的数据结构来代表字符串，原因如下：

- libcef.dll和宿主应用可能使用不同运行时来管理堆内存。所有对象，包括字符串需要使用和分配时相同的运行时来释放内存。
- libcef.dll 支持不同的字符类型(UTF8 UTF16等)，默认的是UTF16，但可以通过修改cef_string.h中的定义，然后重新编译CEF来修改。当选择宽字符集时，需要注意不同平台上占用的字节数是不同的。

UTF16的字符串结构如下：

```c
typedef struct _cef_string_utf16_t {
  char16* str;  // Pointer to the string
  size_t length;  // String length
  void (*dtor)(char16* str);  // Destructor for freeing the string on the correct heap
} cef_string_utf16_t;

typedef char16 cef_char_t;
typedef cef_string_utf16_t cef_string_t;
```

CEF提供很多C API函数来操作CEF字符串类型，比如：

- cef_string_set 将分配一个字符串值
- cef_string_clear 清除字符串值
- cef_string_cmp 比较两个字符串

CEF也提供字符串类型转换的帮助函数(ASCII  UTF8  UTF16 和宽字符串)，参考cef_string.h 和cef_string_types.h

在C++中，可以直接使用CefString类来简化操作。CefString提供自动转换功能。

```c
std::string str = “Some UTF8 string”;

// 下面三种方式等价. Conversion from UTF8 will occur if necessary.
CefString cef_str(str);
cef_str = str;
cef_str.FromString(str);

// 下面两种方式等价，字符串会转换为UTF8编码
str = cef_str;
str = cef_str.ToString();
---------------------------------------------
std::wstring str = “Some wide string”;

// 下面三种方式等价. Conversion from wide will occur if necessary.
CefString cef_str(str);
cef_str = str;
cef_str.FromWString(str);

//下面两种方式等价. 转换为宽字符
str = cef_str;
str = cef_str.ToWString();
----------------------------------------------
const char* cstr = “Some ASCII string”;
CefString cef_str;
cef_str.FromASCII(cstr);
```

CefSettings 字符串成员`cef_string_t`的赋值方法：

```c
CefSettings settings;
const char* path = “/path/to/log.txt”;

// Equivalent assignments.
CefString(&settings.log_file).FromASCII(path);
cef_string_from_ascii(path, strlen(path), &settings.log_file);
```



### 命令行参数

CEF3和Chromium中的很多特性可以使用命令行参数配置。命令行参数会通过`CefExecuteProcess()`和CefMainArgs结构传递给子进程。

- `CefSettings.command_line_args_disabled` 可以禁用命令行参数
- 在`CefApp::OnBeforeCommandLineProcessing()`方法中可以通过代码来指定命令行参数
- 传递应用自己的命令行参数（非CEF和Chromium参数）,可以使用`CefBrowserProcessHandler::OnBeforeChildProcessLaunch()`方法。

完整的命令行参数，可以在Chromium源码的`*_switches.cc`文件中查看。比如`client_switches.cc base_switches.cc chrome_switches.cc `

https://www.cnblogs.com/chechen/p/10312890.html



## 应用布局

Windows平台：

默认的布局是把libcef库和相关的资源和可执行程序放到一起，目录结构像下面一样：

```code
Application/
    cefclient.exe  <= cefclient application executable
    libcef.dll <= main CEF library
    icudtl.dat <= unicode support data
    libEGL.dll, libGLESv2.dll, ... <= accelerated compositing support libraries
    cef.pak, devtools_resources.pak, ... <= non-localized resources and strings
    natives_blob.bin, snapshot_blob.bin <= V8 initial snapshot
    locales/
        en-US.pak, ... <= locale-specific resources and strings
```



## 应用结构












