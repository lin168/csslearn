# 常用类说明

基于[最简单的Demo]中的示例，进行CEF常用类说明。主要参考CEF头文件中的注释说明。

[TOC]



## CefApp

代表进程级通用回调，另外`CefBrowserProcessHandler` 表示browser进程独有的回调，`CefRenderProcessHandler`代表render进程独有的回调

```c
class CefApp : public virtual CefBaseRefCounted {
 public:
    
  // 提供一个查看或修改命令行参数的功能。 process_type表示进程类型，browser进程为空，render进程为"render".
  // command_line 就是命令行参数对象，注意不要保留这个对象的引用。如果CefSettings.command_line_args_disabled=true，则命令行对象为空。
  // CefSettings中的进行的一些设置会转换为命令行参数传递到其他进程。
  // 注意,不要修改非browser进程的参数，可能会引发意外。
  virtual void OnBeforeCommandLineProcessing(
      const CefString& process_type,
      CefRefPtr<CefCommandLine> command_line) {}


  // 提供注册自定义协议的功能，不要保留registrar对象的引用
  virtual void OnRegisterCustomSchemes(
      CefRawPtr<CefSchemeRegistrar> registrar) {}

  // 返回CefResourceBundleHandler对象的引用，用来处理资源包事件。
  // 如果 CefSettings.pack_loading_disabled=true， 这个方法必须返回一个对象（this即可） 
  // 这个方法返回空时，使用本地的pack文件作为资源文件 
  virtual CefRefPtr<CefResourceBundleHandler> GetResourceBundleHandler() {
    return nullptr;
  }


  // 返回CefBrowserProcessHandler对象，用来实现browser进程特有的功能
  virtual CefRefPtr<CefBrowserProcessHandler> GetBrowserProcessHandler() {
    return nullptr;
  }

  // 返回CefRenderProcessHandler对象，用来实现render进程特有的功能 
  virtual CefRefPtr<CefRenderProcessHandler> GetRenderProcessHandler() {
    return nullptr;
  }
};
```

Browser进程中的`CefApp`对象在`CefInitialize(CefMainArgs,CefSettings,CefApp,sandbox)`中设置,子进程中的`CefApp`对象通过`CefExecuteProcess`来设置。



### CefBrowserProcessHandler

browser进程回调，必须和`CefApp`一起使用,并且要实现`GetBrowserProcessHandler`。

```c
// 实现浏览器进程回调
class CefBrowserProcessHandler : public virtual CefBaseRefCounted {
 public:
  ///
  // browser进程的UI线程调用它获取支持Cookie的协议列表
  // include_defaults如果为true，默认的协议（http、https、ws、wss）等也会自动支持  Providing
  // schemes 为空，并且include_defaults为false时，所有的协议都不会加载和保存cookies
    
  // 这个状态会应用到全局CefRequestContext对象上关联的CefCookieManager对象上。
  // 它也会作为新CefRequestContext对象的初始状态，在创建一个新的CefRequestContext对象之后，
  // CefCookieManager::SetSupportedSchemes方法可能会被调用.
  virtual void GetCookieableSchemes(std::vector<CefString>& schemes,
                                    bool& include_defaults) {}

  // 在CEF上下文初始化完成后会被立即调用。在进程初始化完成后，就可以进行浏览器的创建了。browser UI thread
  virtual void OnContextInitialized() {}

  // 在子进程(render、GPU、Plugin)启动之前调用。 browser UI thread、 IO thread。 可以在这里修改子进程的命令行参数。当然一般是不建议修改的
  virtual void OnBeforeChildProcessLaunch(
      CefRefPtr<CefCommandLine> command_line) {}

  // 在Linux系统上返回打印对象句柄
  virtual CefRefPtr<CefPrintHandler> GetPrintHandler() { return nullptr; }

  // 当为browser进程UI线程调度功能时调用，这个回调可以和CefSettings.external_message_pump 以及CefDoMessageLoopWork()联合使用.
  // 当CEF消息循环需要和其他应用的消息循环一起使用时，可以采用这种方法
  // 这个回调会在browser ui线程上执行CefDoMessageLoopWork时调用。
  // delay_ms 是请求延迟时间，如果 delay_ms<=0,调用会尽快发生，否则就会等待一段时间后发生。
  virtual void OnScheduleMessagePumpWork(int64 delay_ms) {}

  // 返回创建新浏览器时使用的默认的CefClient对象。
  // 如果返回空，创建的浏览器就不会执行回调，应用关闭会被阻塞，直到所有的浏览器窗口手动关闭。目前只能在chrome运行时中使用。
  virtual CefRefPtr<CefClient> GetDefaultClient() { return nullptr; }
};
```



### CefRenderProcessHandler

render 进程回调，必须和`CefApp`一起使用，提供`GetRenderProcessHandler`实现

```c
// 实现render进程回调
class CefRenderProcessHandler : public virtual CefBaseRefCounted {
 public:
  typedef cef_navigation_type_t NavigationType;

  // 在WebKit初始化完成之后调用，WebKit是原来的渲染内核
  virtual void OnWebKitInitialized() {}

  // 在browser对象创建之后调用。
  // 当浏览跨源网站时，新浏览器对象会在旧浏览器销毁之前创建，并且他们具有相同的browser_id
  // extra_info是在调用 CefBrowserHost::CreateBrowser(), CefBrowserHost::CreateBrowserSync(),
  // CefLifeSpanHandler::OnBeforePopup() or CefBrowserView::CreateBrowserView() 时传入的信息，它是只读的
  virtual void OnBrowserCreated(CefRefPtr<CefBrowser> browser,
                                CefRefPtr<CefDictionaryValue> extra_info) {}

  // 在browser对象销毁之前调用
  virtual void OnBrowserDestroyed(CefRefPtr<CefBrowser> browser) {}

  // 返回CefLoadHandler对象，处理浏览器加载状态事件
  virtual CefRefPtr<CefLoadHandler> GetLoadHandler() { return nullptr; }

  // 在frame中的V8上下文创建之后立即调用，使用CefV8Context::GetGlobal()方法获取'window'对象
  // v8 对象只能在创建它们的线程上使用，可以使用CefV8Context::GetTaskRunner()获取任务运行器，从而把任务投递到相关联的线程上运行。
  virtual void OnContextCreated(CefRefPtr<CefBrowser> browser,
                                CefRefPtr<CefFrame> frame,
                                CefRefPtr<CefV8Context> context) {}


  // frame中的v8上下文对象被释放之前调用
  virtual void OnContextReleased(CefRefPtr<CefBrowser> browser,
                                 CefRefPtr<CefFrame> frame,
                                 CefRefPtr<CefV8Context> context) {}

  // frame中出现全局未捕获的异常时调用，默认是禁用的，使用CefSettings.uncaught_exception_stack_size > 0.开启
  virtual void OnUncaughtException(CefRefPtr<CefBrowser> browser,
                                   CefRefPtr<CefFrame> frame,
                                   CefRefPtr<CefV8Context> context,
                                   CefRefPtr<CefV8Exception> exception,
                                   CefRefPtr<CefV8StackTrace> stackTrace) {}

  // 当browser中的元素焦点切换时调用，node是DOM节点，可以为空，并且只在此方法内有效
  virtual void OnFocusedNodeChanged(CefRefPtr<CefBrowser> browser,
                                    CefRefPtr<CefFrame> frame,
                                    CefRefPtr<CefDOMNode> node) {}

  // 当接收到其他进程发来的消息时调用，消息处理之后返回true，否则返回false，消息只能在这个方法内处理。
  virtual bool OnProcessMessageReceived(CefRefPtr<CefBrowser> browser,
                                        CefRefPtr<CefFrame> frame,
                                        CefProcessId source_process,
                                        CefRefPtr<CefProcessMessage> message) {
    return false;
  }
};
```



## CefClient

CefClient 用来处理browser相关的回调(CefBrowser)。实际上它只是一个浏览器回调的总入口，浏览器相关回调根据其特性被划分在不同的类中

```c
// 提供浏览器相关回调
class CefClient : public virtual CefBaseRefCounted {
 public:
  // 返回CefAudioHandler实现类对象，处理音频渲染事件
  virtual CefRefPtr<CefAudioHandler> GetAudioHandler() { return nullptr; }

  // 返回CefContextMenuHandler实现类对象，处理上下文菜单。如果未提供，则使用默认的上下文菜单
  virtual CefRefPtr<CefContextMenuHandler> GetContextMenuHandler() {
    return nullptr;
  }

  // 返回CefDialogHandler实现类对象，处理对话框相关回调,如果未提供，则使用默认实现
  virtual CefRefPtr<CefDialogHandler> GetDialogHandler() { return nullptr; }

  // 返回CefDisplayHandler实现类对象，处理浏览器显示状态事件
  virtual CefRefPtr<CefDisplayHandler> GetDisplayHandler() { return nullptr; }

  // 返回CefDownloadHandler实现类对象，处理下载事件,如果未提供，则使用默认实现
  virtual CefRefPtr<CefDownloadHandler> GetDownloadHandler() { return nullptr; }

  // 返回CefDrayHandler实现类对象，处理拖拽事件
  virtual CefRefPtr<CefDragHandler> GetDragHandler() { return nullptr; }

  // 返回CefFindHandler实现类对象，处理查找结果事件
  virtual CefRefPtr<CefFindHandler> GetFindHandler() { return nullptr; }

  // 返回CefFocusHandler实现类对象，处理焦点事件
  virtual CefRefPtr<CefFocusHandler> GetFocusHandler() { return nullptr; }

  // 返回CefJSDialogHandler实现类对象，处理JavaScript对话框事件，未提供时使用默认实现
  virtual CefRefPtr<CefJSDialogHandler> GetJSDialogHandler() { return nullptr; }

  // 返回CefKeyboardHandler实现类对象，处理键盘事件
  virtual CefRefPtr<CefKeyboardHandler> GetKeyboardHandler() { return nullptr; }

  // 返回CefLifeSpanHandler实现类对象，处理浏览器生命周期事件
  virtual CefRefPtr<CefLifeSpanHandler> GetLifeSpanHandler() { return nullptr; }

  // 返回CefLoadHandler实现类对象，处理浏览器加载状态事件
  virtual CefRefPtr<CefLoadHandler> GetLoadHandler() { return nullptr; }

  // 返回CefRenderHandler实现类对象，处理离屏渲染事件
  virtual CefRefPtr<CefRenderHandler> GetRenderHandler() { return nullptr; }

  // 返回CefRequestHandler实现类对象，处理浏览器请求事件
  virtual CefRefPtr<CefRequestHandler> GetRequestHandler() { return nullptr; }

  // 当接受到其他进程的消息时调用，消息处理之后返回true，否则返回false
  virtual bool OnProcessMessageReceived(CefRefPtr<CefBrowser> browser,
                                        CefRefPtr<CefFrame> frame,
                                        CefProcessId source_process,
                                        CefRefPtr<CefProcessMessage> message) {
    return false;
  }
};
```

### CefAudioHandler

控制音频流的播放，一般使用默认播放即可。

```c
// 处理音频事件
class CefAudioHandler : public virtual CefBaseRefCounted {
 public:
  typedef cef_channel_layout_t ChannelLayout;

  // 可以在这里配置音频流参数，返回true则继续音频流捕获，false则取消
  // params中的所有成员都可以在这里设置，如果未设置则使用默认填充
  virtual bool GetAudioParameters(CefRefPtr<CefBrowser> browser,
                                  CefAudioParameters& params) {
    return true;
  }

  // 浏览器开始进行音频流播放时，在音频捕获线程中调用。播放结束时调用OnAudioSteamStopped
  // params中包含音频流参数，比如采样率、声道等,channels 就是声道数
  virtual void OnAudioStreamStarted(CefRefPtr<CefBrowser> browser,
                                    const CefAudioParameters& params,
                                    int channels) = 0;

  // 当从音频流中接收到PCM数据包时，在音频流线程中调用。可以自定义音频播放
  // data是原始的PCM数据包构成的数组，frames是PCM包的帧数，pts是播放时间戳，用来控制播放速率
  // 可以通过OnAudioStreamStarted中的frames和channel_layout来计算data数组的大小
  virtual void OnAudioStreamPacket(CefRefPtr<CefBrowser> browser,
                                   const float** data,
                                   int frames,
                                   int64 pts) = 0;

  // 音频流播放结束时调用
  virtual void OnAudioStreamStopped(CefRefPtr<CefBrowser> browser) = 0;

  // 音频流播放发生错误时调用
  virtual void OnAudioStreamError(CefRefPtr<CefBrowser> browser,
                                  const CefString& message) = 0;
};
```

### CefContextMenuHandler

上下文菜单事件处理，如果需要自定义菜单功能，则需要提供下面方法的实现

```c
// 处理上下文菜单事件
class CefContextMenuHandler : public virtual CefBaseRefCounted {
 public:
  typedef cef_event_flags_t EventFlags;

  // 在上下文菜单显示之前调用
  // params 提供上下文菜单状态的信息，model表示默认的上下文菜单，可以自定义菜单项，也可以删除现有的菜单项，清空之后就不显示菜单了
  virtual void OnBeforeContextMenu(CefRefPtr<CefBrowser> browser,
                                   CefRefPtr<CefFrame> frame,
                                   CefRefPtr<CefContextMenuParams> params,
                                   CefRefPtr<CefMenuModel> model) {}

  // 自定义上下文菜单的展示
  // params提供上下文菜单状态，model 包含OnBeforeContextMenu修改之后的上下文菜单。返回true开启自定义显示，并使用所选的命令ID同步或异步执行回调。
  virtual bool RunContextMenu(CefRefPtr<CefBrowser> browser,
                              CefRefPtr<CefFrame> frame,
                              CefRefPtr<CefContextMenuParams> params,
                              CefRefPtr<CefMenuModel> model,
                              CefRefPtr<CefRunContextMenuCallback> callback) {
    return false;
  }

  // 当点击菜单项时，执行此回调。处理之后返回true，否则返回false。
  // command_id 是所点菜单项的id，参考cef_menu_id_t，用户自定义菜单项ID应该在MENU_ID_USER_FIRST和MENU_ID_USER_LAST之间
  virtual bool OnContextMenuCommand(CefRefPtr<CefBrowser> browser,
                                    CefRefPtr<CefFrame> frame,
                                    CefRefPtr<CefContextMenuParams> params,
                                    int command_id,
                                    EventFlags event_flags) {
    return false;
  }

  // 当上下文菜单关闭时调用，无论是否点击了菜单项
  virtual void OnContextMenuDismissed(CefRefPtr<CefBrowser> browser,
                                      CefRefPtr<CefFrame> frame) {}
};
```



### CefDialogHandler

文件选择对话框

```c
// 处理对话框事件
class CefDialogHandler : public virtual CefBaseRefCounted {
 public:
  typedef cef_file_dialog_mode_t FileDialogMode;

  // 在运行文件选择对话框之前调用
  // mode代表对话框类型(打开、另存)，title是对话框标题，如果未空则使用默认标题，default_file_path表示初始文件路径
  // accept_filters是文件类型过滤器,可以是小写的MIME类型，比如"text/*","image/*",也可以是单独的文件后缀".txt",".png",或者他们的联合，中间用"|"和";"分割，比如“Image Types|.png;.gif;.jpg”, selected_accept_filter是默认选中的从0开始的过滤器索引。
  // 返回false表示使用默认对话框，返回true表示使用自定义对话框，此时应该在这里实现自己的文件选择框，在选择完成时根据选择结果调用callback.Continue()或callback.Cancel();
  virtual bool OnFileDialog(CefRefPtr<CefBrowser> browser,
                            FileDialogMode mode,
                            const CefString& title,
                            const CefString& default_file_path,
                            const std::vector<CefString>& accept_filters,
                            int selected_accept_filter,
                            CefRefPtr<CefFileDialogCallback> callback) {
    return false;
  }
};
```



### CefDisplayHandler

处理浏览器展示事件

```c
// 处理浏览器展示状态相关事件
class CefDisplayHandler : public virtual CefBaseRefCounted {
 public:
  // frame的地址改变之后调用
  virtual void OnAddressChange(CefRefPtr<CefBrowser> browser,
                               CefRefPtr<CefFrame> frame,
                               const CefString& url) {}

  // 页面标题变化之后调用
  virtual void OnTitleChange(CefRefPtr<CefBrowser> browser,
                             const CefString& title) {}

  // 页面Icon变化之后调用
  virtual void OnFaviconURLChange(CefRefPtr<CefBrowser> browser,
                                  const std::vector<CefString>& icon_urls) {}

  // 页面在正常模式和全屏模式间切换时调用
  // fullscreen为true时，页面内容会自动改变大小来填充浏览器内容区域，否则页面内容则按原始大小显示
  virtual void OnFullscreenModeChange(CefRefPtr<CefBrowser> browser,
                                      bool fullscreen) {}

  // 当浏览器中显示提示信息之前调用 Called when the browser is about to display a tooltip. |text| contains the
  // text 包含要显示的信息，可修改
  // 要自定义处理时，返回true，否则返回false
  virtual bool OnTooltip(CefRefPtr<CefBrowser> browser, CefString& text) {
    return false;
  }

  // 当浏览器接收到状态消息后调用，value包含要展示的状态文本
  virtual void OnStatusMessage(CefRefPtr<CefBrowser> browser,
                               const CefString& value) {}

  // 显示控制台消息之前调用，返回true阻止消息显示
  virtual bool OnConsoleMessage(CefRefPtr<CefBrowser> browser,
                                cef_log_severity_t level,
                                const CefString& message,
                                const CefString& source,
                                int line) {
    return false;
  }

  // 当通过CefBrowserHost::SetAutoResizeEnabled启用自动调整大小并且大小调整之后调用
  // new_size是最终的大小，消息处理之后返回true，否则返回false进行默认处理
  virtual bool OnAutoResize(CefRefPtr<CefBrowser> browser,
                            const CefSize& new_size) {
    return false;
  }

  // 当页面加载进度改变时调用，progress取值从0.0到1.0
  virtual void OnLoadingProgressChange(CefRefPtr<CefBrowser> browser,
                                       double progress) {}

  // 浏览器光标改变后调用 If |type| is CT_CUSTOM then
  // 如果type是CT_CUSTOM，那么custom_cursor_info将会使用自定义鼠标信息填充
  // 返回false表示默认处理，true表示已进行自定义处理
  virtual bool OnCursorChange(CefRefPtr<CefBrowser> browser,
                              CefCursorHandle cursor,
                              cef_cursor_type_t type,
                              const CefCursorInfo& custom_cursor_info) {
    return false;
  }
};
```



### CefDownloadHandler

下载控制

```c
// 处理文件下载事件
class CefDownloadHandler : public virtual CefBaseRefCounted {
 public:
  // 在下载开始之前调用
  // suggested_name是建议文件名，默认情况下，下载将会被取消。callback可以用来控制下载的暂停、继续、取消等操作。
  virtual void OnBeforeDownload(
      CefRefPtr<CefBrowser> browser,
      CefRefPtr<CefDownloadItem> download_item,
      const CefString& suggested_name,
      CefRefPtr<CefBeforeDownloadCallback> callback) = 0;

  // 当下载状态改变时或者下载进度改变时调用
  // 可能会被执行多次，可以使用callback来暂停、恢复、取消下载
  virtual void OnDownloadUpdated(CefRefPtr<CefBrowser> browser,
                                 CefRefPtr<CefDownloadItem> download_item,
                                 CefRefPtr<CefDownloadItemCallback> callback) {}
};
```

### CefDragHandler

```c
// 处理拖拽事件
class CefDragHandler : public virtual CefBaseRefCounted {
 public:
  typedef cef_drag_operations_mask_t DragOperationsMask;

  // 当外部拖拽事件进入浏览器窗口时调用|dragData|
  // dragData包括拖拽事件对象，mask代表拖拽操作Return false for default drag handling behavior or true to
  // 返回false执行默认的处理，true表示取消拖拽事件
  virtual bool OnDragEnter(CefRefPtr<CefBrowser> browser,
                           CefRefPtr<CefDragData> dragData,
                           DragOperationsMask mask) {
    return false;
  }

  // 浏览器窗口内的拖拽区域改变时调用，可以使用-webkit-app-region: drag/no-drag CSS属性来定义 If
  // 如果页面中没有定义可拖拽区域，这个方法就不会被调用
  virtual void OnDraggableRegionsChanged(
      CefRefPtr<CefBrowser> browser,
      CefRefPtr<CefFrame> frame,
      const std::vector<CefDraggableRegion>& regions) {}
};
```



### CefFindHandler

```c
// 处理查找结果
class CefFindHandler : public virtual CefBaseRefCounted {
 public:
  // 报告查找结果时调用，可以使用CefBrowserHost::Find() 触发查找.
  // identifier是传递给Find()的查找标记Find(), count 是匹配项的数目， selectionRect是匹配项的位置（窗口坐标系下的矩形），activeMatchOrdinal是查找结果中的当前位置，如果是最后一个查找结果，finalUpdate为true
  virtual void OnFindResult(CefRefPtr<CefBrowser> browser,
                            int identifier,
                            int count,
                            const CefRect& selectionRect,
                            int activeMatchOrdinal,
                            bool finalUpdate) {}
};
```

### CefFocusHandler

```c
// 处理焦点相关事件
class CefFocusHandler : public virtual CefBaseRefCounted {
 public:
  typedef cef_focus_source_t FocusSource;

  // 当浏览器组件失去焦点时调用，比如最后的焦点是在一个HTML元素上，当用户按下TAB键时。 
  // next表示焦点是否移动到了下一个组件
  virtual void OnTakeFocus(CefRefPtr<CefBrowser> browser, bool next) {}

  // 当浏览器组件在请求焦点时调用
  // source代表焦点请求的发起方
  // 返回false表示允许设置焦点，true表示取消设置焦点
  virtual bool OnSetFocus(CefRefPtr<CefBrowser> browser, FocusSource source) {
    return false;
  }

  // 当浏览器组件接收到焦点之后进行调用
  virtual void OnGotFocus(CefRefPtr<CefBrowser> browser) {}
};
```

### CefJSDialogHandler

```c
// JavaScript对话框相关事件
class CefJSDialogHandler : public virtual CefBaseRefCounted {
 public:
  typedef cef_jsdialog_type_t JSDialogType;

  // 在运行JavaScript对话框时调用 
  // origin_url表示当前上下文所在frame的URL，可能为空。如果不为空，则是经过CefFormatUrlForSecurityDisplay处理的可安全展示的URL。    
  // default_prompt_text是输入框中的默认文本，设置suppress_message 为true，然后返回false可以阻止这个事件。阻止事件比立即执行callback更好，因为他用于检测可能的恶意行为，比如onbeforeunload中的垃圾警告信息。设置suppress_message为false，然后返回false表示使用默认的对话框实现(一个单线程的模式对话框)。 
  // 返回true时，表示使用自定义对话框，或者是callback已经立即执行。自定义对话框是否是模态的都可以，如果使用了自定义对话框，当对话框关闭时，callback必须执行一次
  virtual bool OnJSDialog(CefRefPtr<CefBrowser> browser,
                          const CefString& origin_url,
                          JSDialogType dialog_type,
                          const CefString& message_text,
                          const CefString& default_prompt_text,
                          CefRefPtr<CefJSDialogCallback> callback,
                          bool& suppress_message) {
    return false;
  }

  // 当弹出一个对话框询问用户是否要离开时调用
  // 返回false表示使用默认的对话框实现，返回true表示使用自定义对话框实现
  virtual bool OnBeforeUnloadDialog(CefRefPtr<CefBrowser> browser,
                                    const CefString& message_text,
                                    bool is_reload,
                                    CefRefPtr<CefJSDialogCallback> callback) {
    return false;
  }

  // 取消挂起的对话框时调用，重置任何保存的对话框状态。在页面不正常的跳转时会被调用
  virtual void OnResetDialogState(CefRefPtr<CefBrowser> browser) {}

  // 默认实现的对话框被关闭时调用
  virtual void OnDialogClosed(CefRefPtr<CefBrowser> browser) {}
};
```

### CefKeyboardHandler

```c
// 处理键盘事件
class CefKeyboardHandler : public virtual CefBaseRefCounted {
 public:
  // 在键盘事件被发送到渲染器之前调用
  // event包含键盘事件信息，os_event是操作系统事件消息 
  // 返回false表示采用默认处理，true表示已进行自定义处理
  // 如果按键是作为快捷键在OnKeyEvent()中进行处理，则修改is_keyboard_shortcut为true，返回返回false
  virtual bool OnPreKeyEvent(CefRefPtr<CefBrowser> browser,
                             const CefKeyEvent& event,
                             CefEventHandle os_event,
                             bool* is_keyboard_shortcut) {
    return false;
  }

  // 在渲染器和JavaScript处理事件之后调用
  // event包含键盘事件信息，os_event是操作系统事件信息
  // 返回false表示采用默认处理，true表示已进行自定义处理
  virtual bool OnKeyEvent(CefRefPtr<CefBrowser> browser,
                          const CefKeyEvent& event,
                          CefEventHandle os_event) {
    return false;
  }
};
```

### CefLifeSpanHandler

```c
// 处理浏览器生命周期相关事件
class CefLifeSpanHandler : public virtual CefBaseRefCounted {
 public:
  typedef cef_window_open_disposition_t WindowOpenDisposition;

  // 在新的弹出浏览器创建之前调用
  // browser和frame代表发起弹出请求的browser和frame对象，target_url和target_frame_name只是新浏览器要打开的地址。
  // target_disposition表示在哪里打开弹出浏览器（当前标签、新标签等），user_gesture表示是否是用户触发的弹出动作，比如点击一个连接时就是true，js中打开就是false。popupFeatures 结构包含请求弹出窗口的额外信息。可以修改windowInfo、client、settings以及no_javascript_access参数并返回false来改变创建的窗口属性。
  // 返回true时则取消窗口的弹出，client和settings的值默认和源浏览器一样，如果父浏览器封装在CefBrowserView中，对windowInfo的修改将是不起作用的。
  // 如果在新浏览器窗口弹出前，父浏览器就被销毁了，那么新的浏览器就不会再弹出了。extra_info参数可以用来指定额外信息，在CefRenderProcessHandler::OnBrowserCreated()中可以获取到传入的信息。
  virtual bool OnBeforePopup(CefRefPtr<CefBrowser> browser,
                             CefRefPtr<CefFrame> frame,
                             const CefString& target_url,
                             const CefString& target_frame_name,
                             WindowOpenDisposition target_disposition,
                             bool user_gesture,
                             const CefPopupFeatures& popupFeatures,
                             CefWindowInfo& windowInfo,
                             CefRefPtr<CefClient>& client,
                             CefBrowserSettings& settings,
                             CefRefPtr<CefDictionaryValue>& extra_info,
                             bool* no_javascript_access) {
    return false;
  }

  // 在新浏览器创建之后调用，这个方法中是最早获取到浏览器对象的地方
  virtual void OnAfterCreated(CefRefPtr<CefBrowser> browser) {}

  // 当浏览器接收到关闭请求后调用，可以参考 CEF 关闭流程
  virtual bool DoClose(CefRefPtr<CefBrowser> browser) { return false; }

  // 当浏览器对象销毁之前调用，这个方法是最后能获取到浏览器对象的地方。 
  // 在这个方法调用前，应该释放该浏览器的所有引用。browser对象中的任何进行中的网络请求将会被终止
  // 请求关联的CefResourceRequestHandler回调可能仍旧能收到
  virtual void OnBeforeClose(CefRefPtr<CefBrowser> browser) {}
};
```



### CefLoadHandler

```c
// 处理浏览器加载状态时间，这个方法会在browser和render进程的主线程中调用
class CefLoadHandler : public virtual CefBaseRefCounted {
 public:
  typedef cef_errorcode_t ErrorCode;
  typedef cef_transition_type_t TransitionType;

  // 当加载状态改变时调用，这个回调会执行两次：加载开始时和加载结束时(完成、取消、失败)
  // 每次调用OnLoadStart、OnLoadError、OnLoadEnd时都会调用这个回调
  virtual void OnLoadingStateChange(CefRefPtr<CefBrowser> browser,
                                    bool isLoading,
                                    bool canGoBack,
                                    bool canGoForward) {}

  // 在浏览器开始加载内容时调用
  // frame表示加载内容的frame，可以用IsMain()判断是否是主frame，transition_type提供跳转源的准确值
  // 多个frame可能会同时开始加载，子frame在主frame加载结束后可以继续加载。通过历史状态、fragments来加载相同的页面时，不会触发这个回调。
  virtual void OnLoadStart(CefRefPtr<CefBrowser> browser,
                           CefRefPtr<CefFrame> frame,
                           TransitionType transition_type) {}


  // 浏览器加载结束时调用 
  // frame表示加载内容的frame，可以用IsMain()判断是否是主frame，多个frame可能会同时开始加载，子frame在主frame加载结束后可以继续加载。通过历史状态、fragments来加载相同的页面时，不会触发这个回调。
  virtual void OnLoadEnd(CefRefPtr<CefBrowser> browser,
                         CefRefPtr<CefFrame> frame,
                         int httpStatusCode) {}

  // 当浏览器加载出错或取消时调用 |errorCode| is the error code number, |errorText| is the
  // errorCode是错误码，errorText是错误信息，failedUrl是访问失败的URL，错误码参考net\base\net_error_list.h
  virtual void OnLoadError(CefRefPtr<CefBrowser> browser,
                           CefRefPtr<CefFrame> frame,
                           ErrorCode errorCode,
                           const CefString& errorText,
                           const CefString& failedUrl) {}
};
```

### CefRenderHandler

```c
// 当窗口渲染被禁用,也就是使用离屏渲染时，使用它来处理处理相关的事件
class CefRenderHandler : public virtual CefBaseRefCounted {
 public:
  typedef cef_drag_operations_mask_t DragOperation;
  typedef cef_drag_operations_mask_t DragOperationsMask;
  typedef cef_paint_element_type_t PaintElementType;
  typedef std::vector<CefRect> RectList;
  typedef cef_text_input_mode_t TextInputMode;

  // 返回CefAccessibilityHandler实现类对象，提供辅助功能通知处理
  virtual CefRefPtr<CefAccessibilityHandler> GetAccessibilityHandler() {
    return nullptr;
  }

  // 获取屏幕坐标系的根窗口矩形时调用
  // 如果可以获取到这个矩形，则返回true，如果返回false，则使用GetViewRect返回的矩形
  virtual bool GetRootScreenRect(CefRefPtr<CefBrowser> browser, CefRect& rect) {
    return false;
  }

  // Called to retrieve the view rectangle which is relative to screen
  // coordinates. This method must always provide a non-empty rectangle.
  virtual void GetViewRect(CefRefPtr<CefBrowser> browser, CefRect& rect) = 0;

  // Called to retrieve the translation from view coordinates to actual screen
  // coordinates. Return true if the screen coordinates were provided.
  virtual bool GetScreenPoint(CefRefPtr<CefBrowser> browser,
                              int viewX,
                              int viewY,
                              int& screenX,
                              int& screenY) {
    return false;
  }

  // Called to allow the client to fill in the CefScreenInfo object with
  // appropriate values. Return true if the |screen_info| structure has been
  // modified.
  //
  // If the screen info rectangle is left empty the rectangle from GetViewRect
  // will be used. If the rectangle is still empty or invalid popups may not be
  // drawn correctly.
  virtual bool GetScreenInfo(CefRefPtr<CefBrowser> browser,
                             CefScreenInfo& screen_info) {
    return false;
  }

  // Called when the browser wants to show or hide the popup widget. The popup
  // should be shown if |show| is true and hidden if |show| is false.
  virtual void OnPopupShow(CefRefPtr<CefBrowser> browser, bool show) {}

  // Called when the browser wants to move or resize the popup widget. |rect|
  // contains the new location and size in view coordinates.
  virtual void OnPopupSize(CefRefPtr<CefBrowser> browser, const CefRect& rect) {
  }

  // Called when an element should be painted. Pixel values passed to this
  // method are scaled relative to view coordinates based on the value of
  // CefScreenInfo.device_scale_factor returned from GetScreenInfo. |type|
  // indicates whether the element is the view or the popup widget. |buffer|
  // contains the pixel data for the whole image. |dirtyRects| contains the set
  // of rectangles in pixel coordinates that need to be repainted. |buffer| will
  // be |width|*|height|*4 bytes in size and represents a BGRA image with an
  // upper-left origin. This method is only called when
  // CefWindowInfo::shared_texture_enabled is set to false.
  virtual void OnPaint(CefRefPtr<CefBrowser> browser,
                       PaintElementType type,
                       const RectList& dirtyRects,
                       const void* buffer,
                       int width,
                       int height) = 0;

  // Called when an element has been rendered to the shared texture handle.
  // |type| indicates whether the element is the view or the popup widget.
  // |dirtyRects| contains the set of rectangles in pixel coordinates that need
  // to be repainted. |shared_handle| is the handle for a D3D11 Texture2D that
  // can be accessed via ID3D11Device using the OpenSharedResource method. This
  // method is only called when CefWindowInfo::shared_texture_enabled is set to
  // true, and is currently only supported on Windows.
  virtual void OnAcceleratedPaint(CefRefPtr<CefBrowser> browser,
                                  PaintElementType type,
                                  const RectList& dirtyRects,
                                  void* shared_handle) {}

  // Called when the user starts dragging content in the web view. Contextual
  // information about the dragged content is supplied by |drag_data|.
  // (|x|, |y|) is the drag start location in screen coordinates.
  // OS APIs that run a system message loop may be used within the
  // StartDragging call.
  // Return false to abort the drag operation. Don't call any of
  // CefBrowserHost::DragSource*Ended* methods after returning false.
  //
  // Return true to handle the drag operation. Call
  // CefBrowserHost::DragSourceEndedAt and DragSourceSystemDragEnded either
  // synchronously or asynchronously to inform the web view that the drag
  // operation has ended.
  virtual bool StartDragging(CefRefPtr<CefBrowser> browser,
                             CefRefPtr<CefDragData> drag_data,
                             DragOperationsMask allowed_ops,
                             int x,
                             int y) {
    return false;
  }

  // Called when the web view wants to update the mouse cursor during a
  // drag & drop operation. |operation| describes the allowed operation
  // (none, move, copy, link).
  virtual void UpdateDragCursor(CefRefPtr<CefBrowser> browser,
                                DragOperation operation) {}

  // Called when the scroll offset has changed.
  virtual void OnScrollOffsetChanged(CefRefPtr<CefBrowser> browser,
                                     double x,
                                     double y) {}

  // Called when the IME composition range has changed. |selected_range| is the
  // range of characters that have been selected. |character_bounds| is the
  // bounds of each character in view coordinates.
  virtual void OnImeCompositionRangeChanged(CefRefPtr<CefBrowser> browser,
                                            const CefRange& selected_range,
                                            const RectList& character_bounds) {}

  // Called when text selection has changed for the specified |browser|.
  // |selected_text| is the currently selected text and |selected_range| is
  // the character range.
  virtual void OnTextSelectionChanged(CefRefPtr<CefBrowser> browser,
                                      const CefString& selected_text,
                                      const CefRange& selected_range) {}

  // Called when an on-screen keyboard should be shown or hidden for the
  // specified |browser|. |input_mode| specifies what kind of keyboard
  // should be opened. If |input_mode| is CEF_TEXT_INPUT_MODE_NONE, any
  // existing keyboard for this browser should be hidden.
  virtual void OnVirtualKeyboardRequested(CefRefPtr<CefBrowser> browser,
                                          TextInputMode input_mode) {}
};
```



### CefRequestHandler

```c
class CefRequestHandler : public virtual CefBaseRefCounted {
 public:
  typedef cef_termination_status_t TerminationStatus;
  typedef cef_window_open_disposition_t WindowOpenDisposition;
  typedef std::vector<CefRefPtr<CefX509Certificate>> X509CertificateList;

  // 在浏览器发起请求之前调用
  // request对象是只读的
  // 返回false表示允许请求和跳转，true表示取消跳转。
  // 如果允许跳转，之后就会触发CefLoadHandler中的OnLoadStart OnLoadEnd 等回调。
  // 如果跳转被取消，CefLoadHandler::OnLoadError将会被调用，errorCode是ERR_ABORTED。
  // user_gesture同样表示是否是用户操作触发的跳转
  virtual bool OnBeforeBrowse(CefRefPtr<CefBrowser> browser,
                              CefRefPtr<CefFrame> frame,
                              CefRefPtr<CefRequest> request,
                              bool user_gesture,
                              bool is_redirect) {
    return false;
  }

  // 在新的浏览器中跳转时调用，并且是在OnBeforeBrowse之前调用
  // 这包括用户发起的跳转，比如中键点击、Ctrl+左键点击，browser和frame对象代表发起跳转的源，target_disposition代表打开浏览器的位置，比如当前标签、新标签等
  // 返回false表示允许跳转，true表示取消跳转
  virtual bool OnOpenURLFromTab(CefRefPtr<CefBrowser> browser,
                                CefRefPtr<CefFrame> frame,
                                const CefString& target_url,
                                WindowOpenDisposition target_disposition,
                                bool user_gesture) {
    return false;
  }

  // 在浏览器进程的IO线程中初始化CefResourceRequestHandler之前调用。browser和frame对象代表请求源，request代表请求上下文，它是只读的。
  // is_navigation 如果资源请求是跳转，则为true，也就是跳转到新的页面上打开资源，比如图片
  // is_download 如果资源会触发下载，则为true
  // request_initiator 是页面的根地址(scheme+domain,http://www.baidu.com).
  // disable_default_handling 设置为true时禁用请求的默认处理。这种情况下它需要使用CefResourceRequestHandler::GetResourceHandler来处理，或者取消处理。
  // 可以使用它指定一个资源处理器CefResourceRequestHandler对象。如果它返回空，则会调用CefRequestContextHandler的这个方法。
  virtual CefRefPtr<CefResourceRequestHandler> GetResourceRequestHandler(
      CefRefPtr<CefBrowser> browser,
      CefRefPtr<CefFrame> frame,
      CefRefPtr<CefRequest> request,
      bool is_navigation,
      bool is_download,
      const CefString& request_initiator,
      bool& disable_default_handling) {
    return nullptr;
  }

  // 当浏览器需要用户的证书时，在IO线程调用
  // origin_url是发起认证请求的URL，isProxy 表示是否使用代理服务器，host是主机名，port是端口号
  // scheme 是认证的协议，比如"basic"或"digest"，也可能为空
  // 返回true来继续请求，然后调用CefAuthCallback::Continue() ，返回false取消请求
  virtual bool GetAuthCredentials(CefRefPtr<CefBrowser> browser,
                                  const CefString& origin_url,
                                  bool isProxy,
                                  const CefString& host,
                                  int port,
                                  const CefString& realm,
                                  const CefString& scheme,
                                  CefRefPtr<CefAuthCallback> callback) {
    return false;
  }

  // 当JavaScript通过webkitStorageInfo.requestQuota函数请求一个特定的存储限额时调用
  // origin_url是发起请求的原始页地址， new_size 是请求的限额大小
  // 返回true来继续请求，然后调用CefRequestCallback::Continue()，返回false来取消请求
  virtual bool OnQuotaRequest(CefRefPtr<CefBrowser> browser,
                              const CefString& origin_url,
                              int64 new_size,
                              CefRefPtr<CefRequestCallback> callback) {
    return false;
  }

  // 当URL对应的SSL证书无效时调用此方法
  // 返回true，然后调用CefRequestCallback::Continue()来继续请求，返回false来取消请求
  // 可以使用CefSettings.ignore_certificate_errors来忽略证书错误
  virtual bool OnCertificateError(CefRefPtr<CefBrowser> browser,
                                  cef_errorcode_t cert_error,
                                  const CefString& request_url,
                                  CefRefPtr<CefSSLInfo> ssl_info,
                                  CefRefPtr<CefRequestCallback> callback) {
    return false;
  }

  // 当客户端请求证书时调用
  // 返回flase来执行默认操作，并自动选择第一个可用证书，返回true，然后调用CefSelectClientCertificateCallback::Select 
  // 来选择一个证书。isProxy 表示是否是https代理或原始服务器。host和port是SSL服务器的主机名和端口
  // certificates是一个用来选择的证书列表
  virtual bool OnSelectClientCertificate(
      CefRefPtr<CefBrowser> browser,
      bool isProxy,
      const CefString& host,
      int port,
      const X509CertificateList& certificates,
      CefRefPtr<CefSelectClientCertificateCallback> callback) {
    return false;
  }

  // 当插件进程崩溃时调用
  // plugin_path 是插件的路径
  virtual void OnPluginCrashed(CefRefPtr<CefBrowser> browser,
                               const CefString& plugin_path) {}

  // 当渲染视图就绪时调用
  virtual void OnRenderViewReady(CefRefPtr<CefBrowser> browser) {}

  // 当render进程意外关闭时调用。status表示进程关闭的原因
  virtual void OnRenderProcessTerminated(CefRefPtr<CefBrowser> browser,
                                         TerminationStatus status) {}

  // 在window.document对象创建之后调用
  virtual void OnDocumentAvailableInMainFrame(CefRefPtr<CefBrowser> browser) {}
};
```



通多CefApp和CefClient相关接口基本上就可以完成浏览器的绝大部分操作了。下面介绍一些不常用，但功能非常强大的接口



## Request相关

这部分接口在代码上可能并没有很强的关联，但在概念上他们是有关联的，所以放在一起整理

### CefRequest

```c
// 代表Web请求，提供web请求的功能
class CefRequest : public virtual CefBaseRefCounted {
 public:
  typedef std::multimap<CefString, CefString> HeaderMap;
  typedef cef_referrer_policy_t ReferrerPolicy;
  typedef cef_resource_type_t ResourceType;
  typedef cef_transition_type_t TransitionType;

  // 创建一个车CefRequest对象，工厂方法
  static CefRefPtr<CefRequest> Create();

  // 这个对象是否是只读的
  virtual bool IsReadOnly() = 0;

  // 获取请求中的完整的URL
  virtual CefString GetURL() = 0;

  // 设置URL
  virtual void SetURL(const CefString& url) = 0;

  // 获取请求方法(METHOD),如果提供的有post data，则默认是POST，否则默认是GET
  virtual CefString GetMethod() = 0;

  // 设置请求方法
  virtual void SetMethod(const CefString& method) = 0;

  // 设置referrer URL和policy，请求防盗链资源
  virtual void SetReferrer(const CefString& referrer_url,
                           ReferrerPolicy policy) = 0;

  // 获取referrer URL.
  virtual CefString GetReferrerURL() = 0;

  // 获取referrer policy.
  virtual ReferrerPolicy GetReferrerPolicy() = 0;

  // 获取要Post的数据
  virtual CefRefPtr<CefPostData> GetPostData() = 0;

  // 设置要Post的数据
  virtual void SetPostData(CefRefPtr<CefPostData> postData) = 0;

  // 获取请求头信息，不包含referrer
  virtual void GetHeaderMap(HeaderMap& headerMap) = 0;

  // 设置请求头信息，不包含Referrer 
  virtual void SetHeaderMap(const HeaderMap& headerMap) = 0;

  // 使用name属性获取请求头信息
  virtual CefString GetHeaderByName(const CefString& name) = 0;


  // 使用name属性设置头信息，overwrite表示是否覆盖已存在的信息
  virtual void SetHeaderByName(const CefString& name,
                               const CefString& value,
                               bool overwrite) = 0;

  // 一次设置所有的值
  virtual void Set(const CefString& url,
                   const CefString& method,
                   CefRefPtr<CefPostData> postData,
                   const HeaderMap& headerMap) = 0;

  // 获取在CefURLRequest中使用的标记cef_urlrequest_flags_t
  virtual int GetFlags() = 0;

  // 设置请求标记
  virtual void SetFlags(int flags) = 0;

  // 获取与CefURLRequest一起使用的cookies PATH的URL
  virtual CefString GetFirstPartyForCookies() = 0;

  // 设置cookie PATH的URL
  virtual void SetFirstPartyForCookies(const CefString& url) = 0;

  // 获取请求的资源类型
  virtual ResourceType GetResourceType() = 0;

  // 获取请求的过渡类型
  virtual TransitionType GetTransitionType() = 0;

  // 获取请求的全局唯一标识符，可以在CefResourceRequestHandler中使用
  virtual uint64 GetIdentifier() = 0;
};
```



### CefResourceRequestHandler

CEF早期版本中只有CefRequestHandler，后来把资源请求部分拆分出来了

```c
// 处理浏览器请求相关的事件，与CefRequestHandler一起使用
class CefResourceRequestHandler : public virtual CefBaseRefCounted {
 public:
  typedef cef_return_value_t ReturnValue;
  typedef cef_urlrequest_status_t URLRequestStatus;

  // 在资源请求加载之后调用
  // browser和frame代表发起请求的源, request对象时只读的，要选择性筛选请求的Cookie，请返回CefCookieAccessFilter的实现
  virtual CefRefPtr<CefCookieAccessFilter> GetCookieAccessFilter(
      CefRefPtr<CefBrowser> browser,
      CefRefPtr<CefFrame> frame,
      CefRefPtr<CefRequest> request) {
    return nullptr;
  }

  // 在资源加载之前调用 
  // browser和frame代表发起请求的源, request对象是可修改的，修改request的url等价于重定向。
  // 返回RV_CONTINUE来继续请求，返回RV_CONTINUE_ASYNC，然后调用CefRequestCallback:: Continue()，返回RV_CANCEL取消请求
  virtual ReturnValue OnBeforeResourceLoad(
      CefRefPtr<CefBrowser> browser,
      CefRefPtr<CefFrame> frame,
      CefRefPtr<CefRequest> request,
      CefRefPtr<CefRequestCallback> callback) {
    return RV_CONTINUE;
  }

  // 获取CefResourceHandler实现类对象，提供资源加载功能
  // browser和frame代表发起请求的源,返回null表示使用默认资源加载器。request是只读的
  virtual CefRefPtr<CefResourceHandler> GetResourceHandler(
      CefRefPtr<CefBrowser> browser,
      CefRefPtr<CefFrame> frame,
      CefRefPtr<CefRequest> request) {
    return nullptr;
  }

  // 资源加载被重定向后调用
  // browser和frame是请求的发起源，request代表请求对象，response代表响应对象，new_url包含新的URL，可修改
  virtual void OnResourceRedirect(CefRefPtr<CefBrowser> browser,
                                  CefRefPtr<CefFrame> frame,
                                  CefRefPtr<CefRequest> request,
                                  CefRefPtr<CefResponse> response,
                                  CefString& new_url) {}

  // 接收到响应时调用
  // browser和frame是请求的发起源，request代表请求对象，response代表响应对象
  // 返回false时直接返回，可以修改request来重定向或重试，并返回true
  virtual bool OnResourceResponse(CefRefPtr<CefBrowser> browser,
                                  CefRefPtr<CefFrame> frame,
                                  CefRefPtr<CefRequest> request,
                                  CefRefPtr<CefResponse> response) {
    return false;
  }

  // 过滤响应内容
  virtual CefRefPtr<CefResponseFilter> GetResourceResponseFilter(
      CefRefPtr<CefBrowser> browser,
      CefRefPtr<CefFrame> frame,
      CefRefPtr<CefRequest> request,
      CefRefPtr<CefResponse> response) {
    return nullptr;
  }

  // 资源加载完成后调用
  virtual void OnResourceLoadComplete(CefRefPtr<CefBrowser> browser,
                                      CefRefPtr<CefFrame> frame,
                                      CefRefPtr<CefRequest> request,
                                      CefRefPtr<CefResponse> response,
                                      URLRequestStatus status,
                                      int64 received_content_length) {}


  // 处理未知的协议时调用，在自定义协议中使用
  // browser和frame是请求的发起源，request是只读的，allow_os_execution为true时表示执行注册到系统中的协议处理器
  virtual void OnProtocolExecution(CefRefPtr<CefBrowser> browser,
                                   CefRefPtr<CefFrame> frame,
                                   CefRefPtr<CefRequest> request,
                                   bool& allow_os_execution) {}
};
```

### CefRequestContext

```c
// 请求上下文对象为一组相关的浏览器或URL请求对象提供请求处理，请求上下文可以在创建浏览器对象时创建(CefBrowserHost的参数)，也可以在使用CefURLRequest创建新的URL请求时创建。具有不同请求上下文的浏览器对象不会托管到同一个render进程中。使用JavaScript "window.open"函数会共用同一个render进程和同样的请求上下文。 以单进程模式运行时，只有一个render进程，所以所有的浏览器共享同一个请求上下文
class CefRequestContext : public virtual CefBaseRefCounted {
 public:
  // 获取全局请求上下文
  static CefRefPtr<CefRequestContext> GetGlobalContext();

  // 创建一个上下文对象，可以自定义settings和请求上下文处理程序
  static CefRefPtr<CefRequestContext> CreateContext(
      const CefRequestContextSettings& settings,
      CefRefPtr<CefRequestContextHandler> handler);


  // 利用一个已有的上下文上下对象，创建一个新的对象，他们共享存储
  static CefRefPtr<CefRequestContext> CreateContext(
      CefRefPtr<CefRequestContext> other,
      CefRefPtr<CefRequestContextHandler> handler);

  // 判断两个上下文对象是否相同
  virtual bool IsSame(CefRefPtr<CefRequestContext> other) = 0;

  // 判断两个上下文对象是否共享存储
  virtual bool IsSharingWith(CefRefPtr<CefRequestContext> other) = 0;

  // 判断一个上下文对象是否是全局的
  virtual bool IsGlobal() = 0;

  // 获取上下文对象的处理器
  virtual CefRefPtr<CefRequestContextHandler> GetHandler() = 0;

  // 获取缓存路径，如果返回空，则表示使用的是内存缓存，传说中的无痕模式
  virtual CefString GetCachePath() = 0;

  // 返回缓存管理器对象，如果callback是非空的，它会在管理器的存储空间初始化之后异步执行
  virtual CefRefPtr<CefCookieManager> GetCookieManager(
      CefRefPtr<CefCompletionCallback> callback) = 0;

  // 注册一个scheme处理程序工厂
  // scheme_name协议名是必需的，domain_name 可选。如果domain_name为空，在标准scheme下匹配所有域名，在自定义scheme下，则自动忽略。
  // 如果scheme_name是一个内置的，就会调用内置的协议处理工厂类。如果是自定义协议，就必须实现CefApp::OnRegisterCustomSchemes()。
  // 如果发生错误，返回false
  virtual bool RegisterSchemeHandlerFactory(
      const CefString& scheme_name,
      const CefString& domain_name,
      CefRefPtr<CefSchemeHandlerFactory> factory) = 0;

  // 清除所有注册的协议处理工厂
  virtual bool ClearSchemeHandlerFactories() = 0;

  // 通知上下文关联的所有render进程清除插件列表缓存，reload_pages表示是否重新加载页面
  // CefRequestContextHandler::OnBeforePluginLoad 会被调用来重建插件列表缓存
  virtual void PurgePluginListCache(bool reload_pages) = 0;

  //  是否具有指定名称的偏好设置
  virtual bool HasPreference(const CefString& name) = 0;

  // 获取指定名称的偏好设置，不存在时返回NULL。注意，返回的对象只是一个副本，修改不起作用
  virtual CefRefPtr<CefValue> GetPreference(const CefString& name) = 0;

  // 获取所有的偏好设置， include_defaults 表示是否显示默认项
  virtual CefRefPtr<CefDictionaryValue> GetAllPreferences(
      bool include_defaults) = 0;

  // 指定名称的首选项是否可通过SetPreference修改
  virtual bool CanSetPreference(const CefString& name) = 0;

  // 设置首选项的值， 如果value是NULL，则表示恢复默认值。成功返回true，失败返回false
  virtual bool SetPreference(const CefString& name,
                             CefRefPtr<CefValue> value,
                             CefString& error) = 0;

  // 清除所有证书异常，如果callback是非空的，在完成后会自动调用
  virtual void ClearCertificateExceptions(
      CefRefPtr<CefCompletionCallback> callback) = 0;

  // 清除所有HTTP认证信息
  virtual void ClearHttpAuthCredentials(
      CefRefPtr<CefCompletionCallback> callback) = 0;

  // 关闭所有连接
  virtual void CloseAllConnections(
      CefRefPtr<CefCompletionCallback> callback) = 0;

  // 尝试把origin转换为关联的IP列表
  virtual void ResolveHost(const CefString& origin,
                           CefRefPtr<CefResolveCallback> callback) = 0;

  // 加载一个扩展
  // 如果使用默认加载实现从磁盘读取扩展资源，那么root_directory应该是一个包括扩展资源目录的绝对路径，manifest应该为NULL。如果扩展资源通过client(CefRequestHandler CefExtensionHandler)提供,那么root_directory应该是一个路径(可以是绝对路径，也可以是相对PK_DIR_RESOURCES的路径)，manifest应该包含“manifest.json”文件的内容
  //
  // 加载的扩展项可以在所有共享存储的的请求上下文中访问，但只有调用这个方法的上下文对象才被叫做loader(DidLoadExtension->true)
  // 加载成功时调用 CefExtensionHandler::OnExtensionLoaded
  // 加载失败时调用 CefExtensionHandler::OnExtensionLoadFailed
  // 如果扩展指定了后台脚本，CefExtensionHandler::OnBeforeBackgroundBrowser 会被调用创建后台浏览器
  // 为了使扩展可视化，客户端应用应该评估manifest以确定要加载的扩展URL,然后在加载扩展后把该URL传递给CefBrowserHost::CreateBrowser*
  // 比如，客户端可以在https://developer.chrome.com/extensions/browserAction查找"browser_action"
  // 扩展URL的格式为"chrome-extension://<extension_id>/<path>"
  //
  // 托管扩展的浏览器和普通浏览器有以下不同：
  //  - 可以访问chrome.* JavaScript APIs(需要使用manifest允许)。访问
  //    chrome://extensions-support 查看CEF支持的扩展
  //  - Main frame 导航到非扩展内容时被阻塞
  //  - 缩放被禁用
  //  - CefBrowserHost::GetExtension 返回托管扩展
  //  - CefBrowserHost::IsBackgroundHost 判断是否是后台托管
  virtual void LoadExtension(const CefString& root_directory,
                             CefRefPtr<CefDictionaryValue> manifest,
                             CefRefPtr<CefExtensionHandler> handler) = 0;

  ///
  // 如果指定的扩展(extension_id)是在当前上下文中加载的，则返回ture
  // Other contexts sharing the same storage will also have
  // access to the extension (see HasExtension). This method must be called on
  // the browser process UI thread.
  ///
  /*--cef()--*/
  virtual bool DidLoadExtension(const CefString& extension_id) = 0;

  ///
  // Returns true if this context has access to the extension identified by
  // |extension_id|. This may not be the context that was used to load the
  // extension (see DidLoadExtension). This method must be called on the browser
  // process UI thread.
  ///
  /*--cef()--*/
  virtual bool HasExtension(const CefString& extension_id) = 0;

  ///
  // Retrieve the list of all extensions that this context has access to (see
  // HasExtension). |extension_ids| will be populated with the list of extension
  // ID values. Returns true on success. This method must be called on the
  // browser process UI thread.
  ///
  /*--cef()--*/
  virtual bool GetExtensions(std::vector<CefString>& extension_ids) = 0;

  ///
  // Returns the extension matching |extension_id| or NULL if no matching
  // extension is accessible in this context (see HasExtension). This method
  // must be called on the browser process UI thread.
  ///
  /*--cef()--*/
  virtual CefRefPtr<CefExtension> GetExtension(
      const CefString& extension_id) = 0;

  ///
  // Returns the MediaRouter object associated with this context.
  ///
  /*--cef()--*/
  virtual CefRefPtr<CefMediaRouter> GetMediaRouter() = 0;
};

```







