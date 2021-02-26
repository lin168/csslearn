
# 常用类





## 工具类



### CefCommandLine

```c
// 用来创建和解析命令行参数的工具类
// 命令行参数中的开关可以用'--','-','/'开头，开关也可以用=连接一个值，比如-switch=value
// "--"参数可以终止开关解析，后续所有的标记，无论是什么前缀都当做非开关参数处理。
// 开关名称是大小写敏感的，这个类可以在CefInitialize()之前调用
class CefCommandLine : public virtual CefBaseRefCounted {
 public:
  typedef std::vector<CefString> ArgumentList;
  typedef std::map<CefString, CefString> SwitchMap;

  // 创建一个CefCommandLine实例
  static CefRefPtr<CefCommandLine> CreateCommandLine();

  // 返回全局的CefCommandLine单例对象，只读
  static CefRefPtr<CefCommandLine> GetGlobalCommandLine();

  // 对象是否有效
  virtual bool IsValid() = 0;

  // 对象是否只读
  virtual bool IsReadOnly() = 0;

  // 返回此对象的深拷贝
  virtual CefRefPtr<CefCommandLine> Copy() = 0;

  // 用argc和argv进行初始化
  virtual void InitFromArgv(int argc, const char* const* argv) = 0;

  // 使用命令行字符串进行初始化，命令行字符串可以用GetCommandLineW()获取
  virtual void InitFromString(const CefString& command_line) = 0;

  // 重置所有的命令行开关和参数
  virtual void Reset() = 0;

  // 获取原始的命令行字符串并保存到CefString数组中
  virtual void GetArgv(std::vector<CefString>& argv) = 0;

  // 获取返回的命令行字符串
  virtual CefString GetCommandLineString() = 0;
  
  // 获取命令行中的程序部分
  virtual CefString GetProgram() = 0;

  // 设置命令行中的程序部分
  virtual void SetProgram(const CefString& program) = 0;

  // 命令行中是否有开关
  virtual bool HasSwitches() = 0;

  // 命令行中是否有指定开关
  virtual bool HasSwitch(const CefString& name) = 0;

  // 获取指定开关的值，如果没有值则返回空字符串
  virtual CefString GetSwitchValue(const CefString& name) = 0;

  // 返回开关的键值对
  virtual void GetSwitches(SwitchMap& switches) = 0;

  // 在命令行中添加开关，带前缀--
  virtual void AppendSwitch(const CefString& name) = 0;

  // 添加带值的开关
  virtual void AppendSwitchWithValue(const CefString& name,
                                     const CefString& value) = 0;

  // 命令行中是否包含参数
  virtual bool HasArguments() = 0;

  // 获取命令行中程序之外的参数
  virtual void GetArguments(ArgumentList& arguments) = 0;

  // 把一个参数添加到命令行末尾
  virtual void AppendArgument(const CefString& argument) = 0;

  // 在当前命令之前插入一个新的命令，通常用于调试器，比如gdb myexe --args
  virtual void PrependWrapper(const CefString& wrapper) = 0;
};
```

## Cookie

### CefCookie

```c
// cookie结构体，包含cookie的各个字段
typedef struct _cef_cookie_t {
  
  // The cookie name.
  cef_string_t name;

  // The cookie value.
  cef_string_t value;

  // 域名，如果domain为空，则创建host cookie
  // domain cookie以.开头存储，并且对子域可见，而主机cookie对子域不可见
  cef_string_t domain;

  // 如果path不为空，则只有访问Path路径的子URL时才会带上cookie
  // 比如 zhidao.baidu.com 是baidu.com的子域
  cef_string_t path;

  // secure为true时，只在https协议下发送，同时限制js访问cookie
  int secure;

  // httponly为true时只能在http、https协议下使用，不允许js访问cookie(document.cookie)
  int httponly;

  // 创建事件，浏览器创建
  cef_time_t creation;

  // 上次访问时间，浏览器更新
  cef_time_t last_access;

  // 是否有过期时间，以及过期时间
  int has_expires;
  cef_time_t expires;

  // 
  // Same site.
  cef_cookie_same_site_t same_site;

  // 优先级
  cef_cookie_priority_t priority;
} cef_cookie_t;
```



### CefCookieManager

```c
// Cookie 管理类
class CefCookieManager : public virtual CefBaseRefCounted {
 public:
  // 返回全局的Cookie管理器
  // 默认情况下，数据保存在CefSettings.cache_path目录下.
  // 如果callback为空，在管理器中的存储初始化完成后就会在UI线程中异步调用callback中的接口
  // 这个接口等价于CefRequestContext::GetGlobalContext()->GetDefaultCookieManager().
  static CefRefPtr<CefCookieManager> GetGlobalManager(
      CefRefPtr<CefCompletionCallback> callback);

  // 设置管理器中支持的Scheme
  // 如果include_defaults为true，则自动包含默认的协议(http\https\ws\wss)
  virtual void SetSupportedSchemes(
      const std::vector<CefString>& schemes,
      bool include_defaults,
      CefRefPtr<CefCompletionCallback> callback) = 0;

  // 在UI线程访问所有的cookie
  // 返回的Cookie按最长路径排序，然后按创建日期升序排序，如果无法访问cookie，则返回false
  virtual bool VisitAllCookies(CefRefPtr<CefCookieVisitor> visitor) = 0;

  // 在UI线程访问cookie的自己，结果会使用给定的url的scheme、host、domain过滤
  // 如果includeHttpOnly为true，结果中也会包含HttpOnly属性
  // 返回的cookies按照最长路径排序，然后按照最早创建日期排序，如果访问失败，则返回false
  virtual bool VisitUrlCookies(const CefString& url,
                               bool includeHttpOnly,
                               CefRefPtr<CefCookieVisitor> visitor) = 0;

  // 设置一个cookie，需要提供一个cookie以及使用的url
  // cookie的每一个属性都要按照格式设置，它会检查是否有不允许的字符
  // 失败时返回false
  virtual bool SetCookie(const CefString& url,
                         const CefCookie& cookie,
                         CefRefPtr<CefSetCookieCallback> callback) = 0;

  // 删除指定的cookie
  // 如果url和cookie_name都指定了，那么所有host cookie和domain cookie中匹配的都会删除
  // 如果只指定了url，所有host cookie中匹配的会被删除
  // 如果url为空，所有的cookie都会被删除
  virtual bool DeleteCookies(const CefString& url,
                             const CefString& cookie_name,
                             CefRefPtr<CefDeleteCookiesCallback> callback) = 0;

  // 将备份存储刷新到磁盘
  virtual bool FlushStore(CefRefPtr<CefCompletionCallback> callback) = 0;
};
```

### CefCookieVisitor

```c
// CefCookieManager中访问Cookie时是通过CefCookieVisitor进行的
class CefCookieVisitor : public virtual CefBaseRefCounted {
 public:
  // CefCookieVisitor中的VisitAllCookies和VisitUrlCookies中访问Cookie时，会针对每个Cookie调用Visit方法一次
  // count是当前cookie基于0的索引，total是cookie的总数，deleteCookie设为true就会删除当前访问的cookie
  // 返回false时，就会停止cookie的访问，如果没找到cookie，就不会调用这个方法
  virtual bool Visit(const CefCookie& cookie,
                     int count,
                     int total,
                     bool& deleteCookie) = 0;
};
```



## 任务传递

```c
// 把任务投递到指定的线程上执行等价于 CefTaskRunner::GetForThread(threadId)->PostTask(task).
bool CefPostTask(CefThreadId threadId, CefRefPtr<CefTask> task);
// 把任务投递到指定的线程上，并延迟执行
bool CefPostDelayedTask(CefThreadId threadId, CefRefPtr<CefTask> task, int64 delay_ms);
```

### CefTask

```c
// 实现这个接口进行异步任务执行
// 如果任务成功投递并且相关的消息循环正在运行，那么就会调用Execute()方法，如果任务失败，那么任务对象会在源线程销毁
class CefTask : public virtual CefBaseRefCounted {
 public:
  // 会在目标线程上执行的方法
  virtual void Execute() = 0;
};
```

### CefTaskRunner

```c
// 在关联线程上异步执行任务。
// CEF维护了多个内部线程来处理不同类型的任务， cef_thread_id_t 枚举了通用的线程。
// 任务运行器也可用于其他CEF线程中，比如V8 WebWorkder线程
class CefTaskRunner : public virtual CefBaseRefCounted {
 public:
  // 获取当前线程的任务运行器，只有CEF线程中有TaskRunner，在普通线程中调用返回空引用
  static CefRefPtr<CefTaskRunner> GetForCurrentThread();

  // 获取指定线程的任务运行器
  static CefRefPtr<CefTaskRunner> GetForThread(CefThreadId threadId);

  // 判断两个对象是否相同
  virtual bool IsSame(CefRefPtr<CefTaskRunner> that) = 0;

  // 判断任务运行器是否属于当前线程
  virtual bool BelongsToCurrentThread() = 0;

  // 判断任务运行器是否属于指定线程
  virtual bool BelongsToThread(CefThreadId threadId) = 0;

  // 向任务运行器中投递任务
  virtual bool PostTask(CefRefPtr<CefTask> task) = 0;

  // 投递延迟任务
  virtual bool PostDelayedTask(CefRefPtr<CefTask> task, int64 delay_ms) = 0;
};
```



### CefThread

```c
// 在新线程上建立消息循环的简单的线程抽象类
// 消费者使用CefTaskrunner在线程消息循环中执行代码，当CefThread对象销毁或调用Stop()之后，线程才会终止
// 所有在线程消息循环中排队的挂起任务全部执行完成后，线程才会退出。
// 可以在任何CEF线程上调用CreateThread()这个类智能用于需要专用线程的任务
// 在大多数情形下，你可以向已有的CEF线程投递任务而不是创建一个新的
class CefThread : public CefBaseRefCounted {
 public:
  // 创建并开始一个新的线程。这个方法不会阻塞，display_name是线程的标记名，priority是线程执行的优先级
  // message_loop_type 消息循环类型指示了线程可以处理异步事件集合，如果stoppable为true，线程在对象销毁或调用Stop方法时会停止
  // 否则线程无法停止，在关闭时会导致资源泄漏。com_init_mod指定了Windows上COM如果在线程中初始化。如果com_init_mode被指定为COM_INIT_MODE_STA，那么message_loop_type必须被设定为ML_TYPE_UI
  static CefRefPtr<CefThread> CreateThread(
      const CefString& display_name,
      cef_thread_priority_t priority,
      cef_message_loop_type_t message_loop_type,
      bool stoppable,
      cef_com_init_mode_t com_init_mode);

  // 使用默认值创建并启动一个新的线程
  static CefRefPtr<CefThread> CreateThread(const CefString& display_name) {
    return CreateThread(display_name, TP_NORMAL, ML_TYPE_DEFAULT, true,
                        COM_INIT_MODE_NONE);
  }

  // 获取线程中的CefTaskRunner对象
  virtual CefRefPtr<CefTaskRunner> GetTaskRunner() = 0;

  // 返回平台相关的线程ID
  virtual cef_platform_thread_id_t GetPlatformThreadId() = 0;

  // 其他线程等待此线程任务执行完成并退出后再执行。Stop必须和CreateThread在同一线程中调用
  virtual void Stop() = 0;

  // 判断线程是否正在运行
  virtual bool IsRunning() = 0;
};
```











