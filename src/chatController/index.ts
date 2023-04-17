import { delayBreak, showHUD, HUDController } from "marginnote"

export const chatViewController = JSB.defineClass(
  "chatViewController : UIViewController <UIWebViewDelegate>",
  {
    viewDidLoad: function () {
      self.view.backgroundColor = UIColor.whiteColor()

      // var textFieldFrame = {x: 20, y: 6, width: self.view.bounds.width - (20 * 2), height: 30};

      // var urlField = new UITextField(textFieldFrame);
      // urlField.borderStyle = 2;
      // urlField.textColor = UIColor.blackColor();
      // urlField.delegate = self;
      // urlField.placeholder = '<enter a full URL>';
      // urlField.text = '';
      // urlField.backgroundColor = UIColor.whiteColor();
      // urlField.autoresizingMask = 1 << 1 | 1 << 5;
      // urlField.returnKeyType = 1;
      // urlField.keyboardType = 3;
      // urlField.autocapitalizationType = 0;
      // urlField.autocorrectionType = 1;
      // urlField.clearButtonMode = 3;
      // self.view.addSubview(urlField);

      // var urlField = new UITextField(textFieldFrame);

      const webFrame = self.view.frame
      // webFrame.y += (6 * 2) + 30;
      // webFrame.height -= 40;

      self.webView = new UIWebView(webFrame)

      self.view.layer.cornerRadius = 10
      self.view.layer.borderWidth = 1
      self.view.layer.borderColor = UIColor.lightGrayColor()

      self.webView.backgroundColor = UIColor.whiteColor()
      self.webView.scalesPageToFit = true
      self.webView.layer.cornerRadius = 10
      self.webView.autoresizingMask = (1 << 1) | (1 << 4) | (1 << 5)
      self.webView.delegate = self
      self.view.addSubview(self.webView)

      const langButton = UIButton.buttonWithType(0)
      langButton.autoresizingMask = 1 << 3
      // langButton.setTitleForState('Language', 0);

      // langButton.setTitleForState('🔄', 0);
      langButton.setTitleForState("🤖", 0)
      langButton.layer.cornerRadius = 10
      // langButton.layer.masksToBounds = true;
      langButton.titleLabel.font = UIFont.systemFontOfSize(14)
      langButton.addTargetActionForControlEvents(self, "toggle:", 1 << 6)
      // self.webView.langButton = langButton
      self.langButton = langButton
      // self.webView.addSubview(langButton)
      self.view.addSubview(langButton)

      // self.webView.loadRequest(NSURLRequest.requestWithURL(NSURL.URLWithString('https://chat-mn-note.vercel.app')));
      self.webView.loadRequest(
        NSURLRequest.requestWithURL(
          NSURL.URLWithString("https://mn-aiassistant-chat.vercel.app")
        )
      )
    },
    viewWillAppear: function (animated) {
      self.webView.delegate = self
    },

    viewWillLayoutSubviews: function () {
      dev.log("DEBUGPRINT[1]: index.ts:60 (after )")
      const viewFrame = self.view.bounds
      // let viewFrame = self.view.frame;

      self.langButton.frame = {
        x: viewFrame.x + 1,
        y: viewFrame.y + 1,
        width: 30,
        height: 30
      }
      self.webView.frame = viewFrame
    },
    viewWillDisappear: function (animated) {
      self.webView.stopLoading()
      self.webView.delegate = null

      UIApplication.sharedApplication().networkActivityIndicatorVisible = false
    },
    webViewDidStartLoad: function (webView) {
      UIApplication.sharedApplication().networkActivityIndicatorVisible = true
    },
    webViewDidFinishLoad: function (webView) {
      self.setToken(self.token)
      UIApplication.sharedApplication().networkActivityIndicatorVisible = false
    },
    webViewDidFailLoadWithError: function (webView, error) {
      dev.log(
        "DEBUGPRINT[3]: index.ts:73 (after webViewDidFailLoadWithError: function(we…)"
      )
      UIApplication.sharedApplication().networkActivityIndicatorVisible = false

      let errorString =
        "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\"><html><head><meta http-equiv='Content-Type' content='text/html;charset=utf-8'><title></title></head><body><div style='width: 100%%; text-align: center; font-size: 36pt; color: red;'>An error occurred:<br>%@</div></body></html>"
      errorString = errorString.replace("%@", error.localizedDescription)

      self.webView.loadHTMLStringBaseURL(errorString, null)
    },
    webViewShouldStartLoadWithRequestNavigationType: function (
      webView,
      request,
      type
    ) {
      JSB.log("MNLOG %@", request)
      return true
    },
    toggle: function (sender) {
      const lastViewFrame = self.lastViewFrame
      // const lastWebViewFrame = self.webView.frame
      self.lastViewFrame = self.view.frame
      // self.lastWebViewFrame = self.webView.frame
      self.view.frame = lastViewFrame
      // self.webView.frame = lastViewFrame
    }
  }
)

chatViewController.prototype.openURL = function (
  url = self.globalProfile.aiassistant.chatURL
) {
  this.webView.loadRequest(
    NSURLRequest.requestWithURL(NSURL.URLWithString(url))
  )
}

chatViewController.prototype.lookup = function (text: string) {
  text = text.replace("`", "`")
  const inputId = "input-from-external"
  const js = `
    document.getElementById("${inputId}").value = \`${text}\`;
    document.getElementById("${inputId}").click();
    `
  this.webView.evaluateJavaScript(js, undefined)
}

chatViewController.prototype.setToken = function (text: string) {
  const inputId = "input-openai-api-key"
  const check = `
    document.getElementById("${inputId}") !== null 
    `
  const apply = `
    document.getElementById("${inputId}").value = \`${text}\`;
    document.getElementById("${inputId}").click();
    `
  let ready = false
  HUDController.show("Loading")
  delayBreak(50, 0.1, () => {
    this.webView.evaluateJavaScript(check, (res: string) => {
      ready = res === "1"
    })
    if (ready) {
      this.webView.evaluateJavaScript(apply, undefined)
    }
    return ready
  })
  HUDController.hidden()
}

export function layoutChatView() {
  // const {openaiSecretKey} = self.globalProfile.aiassistant
  self.chatViewController = chatViewController.new()
  // self.chatViewController.webView.token = openaiSecretKey
  const frame = Application.sharedInstance().studyController(self.window).view
    .bounds
  let width = frame.width / 3 - 80 // ChatGPT Next mobile screen size is 600
  if (width < 0) width = 80
  const height = Number(width * 1.618)
  self.chatViewController.view.frame = {
    x: 0,
    y: (frame.height - height) / 2,
    width: width,
    height: height
  }
  const vf = self.chatViewController.view.frame
  Application.sharedInstance()
    .studyController(self.window)
    .view.addSubview(self.chatViewController.view)
  self.chatViewController.lastViewFrame = {
    x: vf.x,
    y: vf.y,
    width: 46,
    height: 46
  }

  self.chatViewController.token = self.globalProfile.aiassistant.openaiSecretKey
  layoutChatViewController()
}

export function layoutChatViewController(
  heightNum = self.globalProfile.aiassistant.chatUIHeight[0],
  widthNum = self.globalProfile.aiassistant.chatUIWidth[0],
  positionNum = self.globalProfile.aiassistant.chatUIPosition[0]
) {
  const { studyController } = MN
  const readerView = studyController.readerController.view
  self.chatViewController.lastViewFrame = readerView.frame.width
  const frame = studyController.view.bounds
  const width = [400, 500, 600][widthNum]
  const height = [500, 650, 810][heightNum]

  const x = [() => 15, () => frame.width - width - 50][positionNum]()
  const y = MN.isMNE ? 70 : 70
  self.chatViewController.view.frame = {
    x,
    y,
    height,
    width
  }
  self.chatViewController.lastViewFrame = {
    x: x,
    y: y,
    width: 32,
    height: 32
  }
  self.chatViewController.viewWillLayoutSubviews()
}
