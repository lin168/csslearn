# 常用类



## Browser &Frame



### CefBrowserHost

```c
// 表示浏览器进程中浏览器窗口，只能在browser进程调用
class CefBrowserHost : public virtual CefBaseRefCounted {
 public:
  typedef cef_drag_operations_mask_t DragOperationsMask;
  typedef cef_file_dialog_mode_t FileDialogMode;
  typedef cef_mouse_button_type_t MouseButtonType;
  typedef cef_paint_element_type_t PaintElementType;

  // 使用windowInfo指定的窗口信息创建一个浏览器窗口。
  // 所有的参数都会进行内部拷贝，实际的窗口会在browser进程的UI线程创建，如果request_context是空的，则使用全局请求上下文
  // 这个方法可以在browser进程的任意线程中调用，并且不会阻塞，extra_info参数是可选的，它可以给CefRenderProcessHandler::OnBrowserCreated()传递数据
  static bool CreateBrowser(const CefWindowInfo& windowInfo,
                            CefRefPtr<CefClient> client,
                            const CefString& url,
                            const CefBrowserSettings& settings,
                            CefRefPtr<CefDictionaryValue> extra_info,
                            CefRefPtr<CefRequestContext> request_context);

  // 与CreateBrowser基本一样，唯一的不同是它是同步的，直到浏览器创建成功后才会返回
  static CefRefPtr<CefBrowser> CreateBrowserSync(
      const CefWindowInfo& windowInfo,
      CefRefPtr<CefClient> client,
      const CefString& url,
      const CefBrowserSettings& settings,
      CefRefPtr<CefDictionaryValue> extra_info,
      CefRefPtr<CefRequestContext> request_context);

  // 获取托管的browser对象
  virtual CefRefPtr<CefBrowser> GetBrowser() = 0;

  // 请求浏览器关闭，JavaScript中的onbeforeunload事件会触发，如果force_close是false，则允许弹出提示框让用户选择是否关闭
  // 如果为true，则直接执行关闭操作，无法进行提示，然后导致CefLifeSpanHandler::DoClose()被调用
  virtual void CloseBrowser(bool force_close) = 0;

  // 帮助关闭浏览器。可以在顶级窗口的关闭消息中调用此方法，它内部调用CloseBrowser(false),然后执行关闭操作并返回false
  // 再次调用时则返回true
  virtual bool TryCloseBrowser() = 0;


  // 设置浏览器是否获取焦点
  virtual void SetFocus(bool focus) = 0;

  // 获取浏览器所在窗口句柄，如果浏览器包裹在CefBrowserView，那么他会返回定级的本地窗口
  virtual CefWindowHandle GetWindowHandle() = 0;

  // 获取打开此浏览器的浏览器所在窗口的句柄，对于非弹出式窗口返回NULL
  virtual CefWindowHandle GetOpenerWindowHandle() = 0;

  // 浏览器是否包裹在CefBrowserView中
  virtual bool HasView() = 0;

  // 获取browser关联的client对象
  virtual CefRefPtr<CefClient> GetClient() = 0;

  // 获取浏览器的请求上下文
  virtual CefRefPtr<CefRequestContext> GetRequestContext() = 0;

  // 获取当前缩放等级，默认是0.0
  virtual double GetZoomLevel() = 0;

  // 修改缩放等级，0.0表示默认值
  virtual void SetZoomLevel(double zoomLevel) = 0;

  // 打开一个文件选择、保存对话框，在任何时候，都只能有一个文件选择对话框处于打开的状态，
  // mode表示打开的模式,title 是对话框的标题，default_file_path默认文件路径，accept_filters 是选择过滤器
  // 格式可以是下面三种的联合a. 小写的MIME类型("text/*") b.单独的文件后缀".txt" c.描述和文件后缀的集合("Image Types|.png;.gif;.jpg")
  // selected_accept_filer是基于0的选择过滤器
  // 在点击对话框的确定或取消按钮时会执行callback的OnFileDialogDismissed()方法
  virtual void RunFileDialog(FileDialogMode mode,
                             const CefString& title,
                             const CefString& default_file_path,
                             const std::vector<CefString>& accept_filters,
                             int selected_accept_filter,
                             CefRefPtr<CefRunFileDialogCallback> callback) = 0;

  // 使用CefDownloadHandler下载指定URL的文件
  virtual void StartDownload(const CefString& url) = 0;

  // 下载image_url指向的图像，下载完成后执行callback中的回调方法。
  // 如果is_favicon为true，就不会发送cookies，也不接收cookies。
  // 如果图片分辨率大于max_image_size,则自动过滤，如果没有小于max_image_size的图像，则下载尺寸最小的图像,并修改大小为max_image_size
  // 如果max_image_size为0，则表示不限制
  // bypass_cache 表示是否绕过缓存
  virtual void DownloadImage(const CefString& image_url,
                             bool is_favicon,
                             uint32 max_image_size,
                             bool bypass_cache,
                             CefRefPtr<CefDownloadImageCallback> callback) = 0;

  // Print the current browser contents.
  virtual void Print() = 0;

  ///
  // Print the current browser contents to the PDF file specified by |path| and
  // execute |callback| on completion. The caller is responsible for deleting
  // |path| when done. For PDF printing to work on Linux you must implement the
  // CefPrintHandler::GetPdfPaperSize method.
  ///
  /*--cef(optional_param=callback)--*/
  virtual void PrintToPDF(const CefString& path,
                          const CefPdfPrintSettings& settings,
                          CefRefPtr<CefPdfPrintCallback> callback) = 0;

  ///
  // Search for |searchText|. |identifier| must be a unique ID and these IDs
  // must strictly increase so that newer requests always have greater IDs than
  // older requests. If |identifier| is zero or less than the previous ID value
  // then it will be automatically assigned a new valid ID. |forward| indicates
  // whether to search forward or backward within the page. |matchCase|
  // indicates whether the search should be case-sensitive. |findNext| indicates
  // whether this is the first request or a follow-up. The CefFindHandler
  // instance, if any, returned via CefClient::GetFindHandler will be called to
  // report find results.
  ///
  /*--cef()--*/
  virtual void Find(int identifier,
                    const CefString& searchText,
                    bool forward,
                    bool matchCase,
                    bool findNext) = 0;

  ///
  // Cancel all searches that are currently going on.
  ///
  /*--cef()--*/
  virtual void StopFinding(bool clearSelection) = 0;

  ///
  // Open developer tools (DevTools) in its own browser. The DevTools browser
  // will remain associated with this browser. If the DevTools browser is
  // already open then it will be focused, in which case the |windowInfo|,
  // |client| and |settings| parameters will be ignored. If |inspect_element_at|
  // is non-empty then the element at the specified (x,y) location will be
  // inspected. The |windowInfo| parameter will be ignored if this browser is
  // wrapped in a CefBrowserView.
  ///
  /*--cef(optional_param=windowInfo,optional_param=client,
          optional_param=settings,optional_param=inspect_element_at)--*/
  virtual void ShowDevTools(const CefWindowInfo& windowInfo,
                            CefRefPtr<CefClient> client,
                            const CefBrowserSettings& settings,
                            const CefPoint& inspect_element_at) = 0;

  ///
  // Explicitly close the associated DevTools browser, if any.
  ///
  /*--cef()--*/
  virtual void CloseDevTools() = 0;

  ///
  // Returns true if this browser currently has an associated DevTools browser.
  // Must be called on the browser process UI thread.
  ///
  /*--cef()--*/
  virtual bool HasDevTools() = 0;

  ///
  // Send a method call message over the DevTools protocol. |message| must be a
  // UTF8-encoded JSON dictionary that contains "id" (int), "method" (string)
  // and "params" (dictionary, optional) values. See the DevTools protocol
  // documentation at https://chromedevtools.github.io/devtools-protocol/ for
  // details of supported methods and the expected "params" dictionary contents.
  // |message| will be copied if necessary. This method will return true if
  // called on the UI thread and the message was successfully submitted for
  // validation, otherwise false. Validation will be applied asynchronously and
  // any messages that fail due to formatting errors or missing parameters may
  // be discarded without notification. Prefer ExecuteDevToolsMethod if a more
  // structured approach to message formatting is desired.
  //
  // Every valid method call will result in an asynchronous method result or
  // error message that references the sent message "id". Event messages are
  // received while notifications are enabled (for example, between method calls
  // for "Page.enable" and "Page.disable"). All received messages will be
  // delivered to the observer(s) registered with AddDevToolsMessageObserver.
  // See CefDevToolsMessageObserver::OnDevToolsMessage documentation for details
  // of received message contents.
  //
  // Usage of the SendDevToolsMessage, ExecuteDevToolsMethod and
  // AddDevToolsMessageObserver methods does not require an active DevTools
  // front-end or remote-debugging session. Other active DevTools sessions will
  // continue to function independently. However, any modification of global
  // browser state by one session may not be reflected in the UI of other
  // sessions.
  //
  // Communication with the DevTools front-end (when displayed) can be logged
  // for development purposes by passing the
  // `--devtools-protocol-log-file=<path>` command-line flag.
  ///
  /*--cef()--*/
  virtual bool SendDevToolsMessage(const void* message,
                                   size_t message_size) = 0;

  ///
  // Execute a method call over the DevTools protocol. This is a more structured
  // version of SendDevToolsMessage. |message_id| is an incremental number that
  // uniquely identifies the message (pass 0 to have the next number assigned
  // automatically based on previous values). |method| is the method name.
  // |params| are the method parameters, which may be empty. See the DevTools
  // protocol documentation (linked above) for details of supported methods and
  // the expected |params| dictionary contents. This method will return the
  // assigned message ID if called on the UI thread and the message was
  // successfully submitted for validation, otherwise 0. See the
  // SendDevToolsMessage documentation for additional usage information.
  ///
  /*--cef(optional_param=params)--*/
  virtual int ExecuteDevToolsMethod(int message_id,
                                    const CefString& method,
                                    CefRefPtr<CefDictionaryValue> params) = 0;

  ///
  // Add an observer for DevTools protocol messages (method results and events).
  // The observer will remain registered until the returned Registration object
  // is destroyed. See the SendDevToolsMessage documentation for additional
  // usage information.
  ///
  /*--cef()--*/
  virtual CefRefPtr<CefRegistration> AddDevToolsMessageObserver(
      CefRefPtr<CefDevToolsMessageObserver> observer) = 0;

  ///
  // Retrieve a snapshot of current navigation entries as values sent to the
  // specified visitor. If |current_only| is true only the current navigation
  // entry will be sent, otherwise all navigation entries will be sent.
  ///
  /*--cef()--*/
  virtual void GetNavigationEntries(
      CefRefPtr<CefNavigationEntryVisitor> visitor,
      bool current_only) = 0;

  ///
  // If a misspelled word is currently selected in an editable node calling
  // this method will replace it with the specified |word|.
  ///
  /*--cef()--*/
  virtual void ReplaceMisspelling(const CefString& word) = 0;

  ///
  // Add the specified |word| to the spelling dictionary.
  ///
  /*--cef()--*/
  virtual void AddWordToDictionary(const CefString& word) = 0;

  ///
  // Returns true if window rendering is disabled.
  ///
  /*--cef()--*/
  virtual bool IsWindowRenderingDisabled() = 0;

  ///
  // Notify the browser that the widget has been resized. The browser will first
  // call CefRenderHandler::GetViewRect to get the new size and then call
  // CefRenderHandler::OnPaint asynchronously with the updated regions. This
  // method is only used when window rendering is disabled.
  ///
  /*--cef()--*/
  virtual void WasResized() = 0;

  ///
  // Notify the browser that it has been hidden or shown. Layouting and
  // CefRenderHandler::OnPaint notification will stop when the browser is
  // hidden. This method is only used when window rendering is disabled.
  ///
  /*--cef()--*/
  virtual void WasHidden(bool hidden) = 0;

  ///
  // Send a notification to the browser that the screen info has changed. The
  // browser will then call CefRenderHandler::GetScreenInfo to update the
  // screen information with the new values. This simulates moving the webview
  // window from one display to another, or changing the properties of the
  // current display. This method is only used when window rendering is
  // disabled.
  ///
  /*--cef()--*/
  virtual void NotifyScreenInfoChanged() = 0;

  ///
  // Invalidate the view. The browser will call CefRenderHandler::OnPaint
  // asynchronously. This method is only used when window rendering is
  // disabled.
  ///
  /*--cef()--*/
  virtual void Invalidate(PaintElementType type) = 0;

  ///
  // Issue a BeginFrame request to Chromium.  Only valid when
  // CefWindowInfo::external_begin_frame_enabled is set to true.
  ///
  /*--cef()--*/
  virtual void SendExternalBeginFrame() = 0;

  ///
  // Send a key event to the browser.
  ///
  /*--cef()--*/
  virtual void SendKeyEvent(const CefKeyEvent& event) = 0;

  ///
  // Send a mouse click event to the browser. The |x| and |y| coordinates are
  // relative to the upper-left corner of the view.
  ///
  /*--cef()--*/
  virtual void SendMouseClickEvent(const CefMouseEvent& event,
                                   MouseButtonType type,
                                   bool mouseUp,
                                   int clickCount) = 0;

  ///
  // Send a mouse move event to the browser. The |x| and |y| coordinates are
  // relative to the upper-left corner of the view.
  ///
  /*--cef()--*/
  virtual void SendMouseMoveEvent(const CefMouseEvent& event,
                                  bool mouseLeave) = 0;

  ///
  // Send a mouse wheel event to the browser. The |x| and |y| coordinates are
  // relative to the upper-left corner of the view. The |deltaX| and |deltaY|
  // values represent the movement delta in the X and Y directions respectively.
  // In order to scroll inside select popups with window rendering disabled
  // CefRenderHandler::GetScreenPoint should be implemented properly.
  ///
  /*--cef()--*/
  virtual void SendMouseWheelEvent(const CefMouseEvent& event,
                                   int deltaX,
                                   int deltaY) = 0;

  ///
  // Send a touch event to the browser for a windowless browser.
  ///
  /*--cef()--*/
  virtual void SendTouchEvent(const CefTouchEvent& event) = 0;

  ///
  // Send a focus event to the browser.
  ///
  /*--cef()--*/
  virtual void SendFocusEvent(bool setFocus) = 0;

  ///
  // Send a capture lost event to the browser.
  ///
  /*--cef()--*/
  virtual void SendCaptureLostEvent() = 0;

  ///
  // Notify the browser that the window hosting it is about to be moved or
  // resized. This method is only used on Windows and Linux.
  ///
  /*--cef()--*/
  virtual void NotifyMoveOrResizeStarted() = 0;

  ///
  // Returns the maximum rate in frames per second (fps) that CefRenderHandler::
  // OnPaint will be called for a windowless browser. The actual fps may be
  // lower if the browser cannot generate frames at the requested rate. The
  // minimum value is 1 and the maximum value is 60 (default 30). This method
  // can only be called on the UI thread.
  ///
  /*--cef()--*/
  virtual int GetWindowlessFrameRate() = 0;

  ///
  // Set the maximum rate in frames per second (fps) that CefRenderHandler::
  // OnPaint will be called for a windowless browser. The actual fps may be
  // lower if the browser cannot generate frames at the requested rate. The
  // minimum value is 1 and the maximum value is 60 (default 30). Can also be
  // set at browser creation via CefBrowserSettings.windowless_frame_rate.
  ///
  /*--cef()--*/
  virtual void SetWindowlessFrameRate(int frame_rate) = 0;

  ///
  // Begins a new composition or updates the existing composition. Blink has a
  // special node (a composition node) that allows the input method to change
  // text without affecting other DOM nodes. |text| is the optional text that
  // will be inserted into the composition node. |underlines| is an optional set
  // of ranges that will be underlined in the resulting text.
  // |replacement_range| is an optional range of the existing text that will be
  // replaced. |selection_range| is an optional range of the resulting text that
  // will be selected after insertion or replacement. The |replacement_range|
  // value is only used on OS X.
  //
  // This method may be called multiple times as the composition changes. When
  // the client is done making changes the composition should either be canceled
  // or completed. To cancel the composition call ImeCancelComposition. To
  // complete the composition call either ImeCommitText or
  // ImeFinishComposingText. Completion is usually signaled when:
  //   A. The client receives a WM_IME_COMPOSITION message with a GCS_RESULTSTR
  //      flag (on Windows), or;
  //   B. The client receives a "commit" signal of GtkIMContext (on Linux), or;
  //   C. insertText of NSTextInput is called (on Mac).
  //
  // This method is only used when window rendering is disabled.
  ///
  /*--cef(optional_param=text, optional_param=underlines)--*/
  virtual void ImeSetComposition(
      const CefString& text,
      const std::vector<CefCompositionUnderline>& underlines,
      const CefRange& replacement_range,
      const CefRange& selection_range) = 0;

  ///
  // Completes the existing composition by optionally inserting the specified
  // |text| into the composition node. |replacement_range| is an optional range
  // of the existing text that will be replaced. |relative_cursor_pos| is where
  // the cursor will be positioned relative to the current cursor position. See
  // comments on ImeSetComposition for usage. The |replacement_range| and
  // |relative_cursor_pos| values are only used on OS X.
  // This method is only used when window rendering is disabled.
  ///
  /*--cef(optional_param=text)--*/
  virtual void ImeCommitText(const CefString& text,
                             const CefRange& replacement_range,
                             int relative_cursor_pos) = 0;

  ///
  // Completes the existing composition by applying the current composition node
  // contents. If |keep_selection| is false the current selection, if any, will
  // be discarded. See comments on ImeSetComposition for usage.
  // This method is only used when window rendering is disabled.
  ///
  /*--cef()--*/
  virtual void ImeFinishComposingText(bool keep_selection) = 0;

  ///
  // Cancels the existing composition and discards the composition node
  // contents without applying them. See comments on ImeSetComposition for
  // usage.
  // This method is only used when window rendering is disabled.
  ///
  /*--cef()--*/
  virtual void ImeCancelComposition() = 0;

  ///
  // Call this method when the user drags the mouse into the web view (before
  // calling DragTargetDragOver/DragTargetLeave/DragTargetDrop).
  // |drag_data| should not contain file contents as this type of data is not
  // allowed to be dragged into the web view. File contents can be removed using
  // CefDragData::ResetFileContents (for example, if |drag_data| comes from
  // CefRenderHandler::StartDragging).
  // This method is only used when window rendering is disabled.
  ///
  /*--cef()--*/
  virtual void DragTargetDragEnter(CefRefPtr<CefDragData> drag_data,
                                   const CefMouseEvent& event,
                                   DragOperationsMask allowed_ops) = 0;

  ///
  // Call this method each time the mouse is moved across the web view during
  // a drag operation (after calling DragTargetDragEnter and before calling
  // DragTargetDragLeave/DragTargetDrop).
  // This method is only used when window rendering is disabled.
  ///
  /*--cef()--*/
  virtual void DragTargetDragOver(const CefMouseEvent& event,
                                  DragOperationsMask allowed_ops) = 0;

  ///
  // Call this method when the user drags the mouse out of the web view (after
  // calling DragTargetDragEnter).
  // This method is only used when window rendering is disabled.
  ///
  /*--cef()--*/
  virtual void DragTargetDragLeave() = 0;

  ///
  // Call this method when the user completes the drag operation by dropping
  // the object onto the web view (after calling DragTargetDragEnter).
  // The object being dropped is |drag_data|, given as an argument to
  // the previous DragTargetDragEnter call.
  // This method is only used when window rendering is disabled.
  ///
  /*--cef()--*/
  virtual void DragTargetDrop(const CefMouseEvent& event) = 0;

  ///
  // Call this method when the drag operation started by a
  // CefRenderHandler::StartDragging call has ended either in a drop or
  // by being cancelled. |x| and |y| are mouse coordinates relative to the
  // upper-left corner of the view. If the web view is both the drag source
  // and the drag target then all DragTarget* methods should be called before
  // DragSource* mthods.
  // This method is only used when window rendering is disabled.
  ///
  /*--cef()--*/
  virtual void DragSourceEndedAt(int x, int y, DragOperationsMask op) = 0;

  ///
  // Call this method when the drag operation started by a
  // CefRenderHandler::StartDragging call has completed. This method may be
  // called immediately without first calling DragSourceEndedAt to cancel a
  // drag operation. If the web view is both the drag source and the drag
  // target then all DragTarget* methods should be called before DragSource*
  // mthods.
  // This method is only used when window rendering is disabled.
  ///
  /*--cef()--*/
  virtual void DragSourceSystemDragEnded() = 0;

  ///
  // Returns the current visible navigation entry for this browser. This method
  // can only be called on the UI thread.
  ///
  /*--cef()--*/
  virtual CefRefPtr<CefNavigationEntry> GetVisibleNavigationEntry() = 0;

  ///
  // Set accessibility state for all frames. |accessibility_state| may be
  // default, enabled or disabled. If |accessibility_state| is STATE_DEFAULT
  // then accessibility will be disabled by default and the state may be further
  // controlled with the "force-renderer-accessibility" and
  // "disable-renderer-accessibility" command-line switches. If
  // |accessibility_state| is STATE_ENABLED then accessibility will be enabled.
  // If |accessibility_state| is STATE_DISABLED then accessibility will be
  // completely disabled.
  //
  // For windowed browsers accessibility will be enabled in Complete mode (which
  // corresponds to kAccessibilityModeComplete in Chromium). In this mode all
  // platform accessibility objects will be created and managed by Chromium's
  // internal implementation. The client needs only to detect the screen reader
  // and call this method appropriately. For example, on macOS the client can
  // handle the @"AXEnhancedUserInterface" accessibility attribute to detect
  // VoiceOver state changes and on Windows the client can handle WM_GETOBJECT
  // with OBJID_CLIENT to detect accessibility readers.
  //
  // For windowless browsers accessibility will be enabled in TreeOnly mode
  // (which corresponds to kAccessibilityModeWebContentsOnly in Chromium). In
  // this mode renderer accessibility is enabled, the full tree is computed, and
  // events are passed to CefAccessibiltyHandler, but platform accessibility
  // objects are not created. The client may implement platform accessibility
  // objects using CefAccessibiltyHandler callbacks if desired.
  ///
  /*--cef()--*/
  virtual void SetAccessibilityState(cef_state_t accessibility_state) = 0;

  ///
  // Enable notifications of auto resize via CefDisplayHandler::OnAutoResize.
  // Notifications are disabled by default. |min_size| and |max_size| define the
  // range of allowed sizes.
  ///
  /*--cef()--*/
  virtual void SetAutoResizeEnabled(bool enabled,
                                    const CefSize& min_size,
                                    const CefSize& max_size) = 0;

  ///
  // Returns the extension hosted in this browser or NULL if no extension is
  // hosted. See CefRequestContext::LoadExtension for details.
  ///
  /*--cef()--*/
  virtual CefRefPtr<CefExtension> GetExtension() = 0;

  ///
  // Returns true if this browser is hosting an extension background script.
  // Background hosts do not have a window and are not displayable. See
  // CefRequestContext::LoadExtension for details.
  ///
  /*--cef()--*/
  virtual bool IsBackgroundHost() = 0;

  ///
  //  Set whether the browser's audio is muted.
  ///
  /*--cef()--*/
  virtual void SetAudioMuted(bool mute) = 0;

  ///
  // Returns true if the browser's audio is muted.  This method can only be
  // called on the UI thread.
  ///
  /*--cef()--*/
  virtual bool IsAudioMuted() = 0;
};
```



















