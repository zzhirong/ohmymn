import { Addon } from "~/addon"
import { dataSourcePreset } from "~/dataSource"
import lang from "~/lang"
import {
  docProfilePreset,
  globalProfilePreset,
  notebookProfilePreset,
  tempProfilePreset,
  Range
} from "~/profile"
import { settingViewControllerInst } from "~/settingViewController"
import { UIWindow } from "~/typings"
import {
  getObjCClassDeclar,
  isfileExists,
  openUrl,
  showHUD,
  popup
} from "~/sdk"
import { deepCopy, readProfile, removeProfile } from "~/utils"
import { removeLastCommentCacheTitle } from "./excerptHandler"
import { gestureHandlers } from "./handleGestureEvent"
import { eventHandlers } from "./handleReceivedEvent"
import { closePanel, layoutViewController } from "./switchPanel"

/**
 * Addon life cycle
 * If you close the window directly, it will not trigger the closing of notebooks and documents
 * 1. Addon connected
 * 2. Open a new window
 * 3. Open a notebook
 * 4. Open a document
 * 5. Close a notebook
 * 6. Close a document
 * 7. Close a window
 */

/** Cache window */
let _window: UIWindow

export const clsMethons = {
  async addonWillDisconnect() {
    console.log("Addon disconected", "lifeCycle")
    const { option } = await popup(
      {
        message: "遇到 bug 了吗，是否清空配置？",
        buttons: ["确定", "去论坛更新"]
      },
      ({ buttonIndex }) => ({
        option: buttonIndex
      })
    )
    switch (option) {
      case 0: {
        removeProfile()
        // could not get the value of self.window
        showHUD(lang.disconnect_addon, 2, _window)
        break
      }
      case 1: {
        openUrl("https://bbs.marginnote.cn/t/topic/20501")
      }
    }
  },
  addonDidConnect() {
    console.log("Addon connected", "lifeCycle")
    if (
      !isfileExists(`${Addon.path}/dict.db`) &&
      isfileExists(`${Addon.path}/dict.zip`)
    )
      ZipArchive.unzipFileAtPathToDestination(
        `${Addon.path}/dict.zip`,
        Addon.path
      )
  }
}

export default {
  sceneWillConnect() {
    console.log("Open a new window", "lifeCycle")
    _window = self.window
    // Multiple windows will share global variables, so they need to be saved to self.
    self.panelStatus = false
    self.addon = {
      key: Addon.key,
      title: Addon.title
    }
    self.globalProfile = deepCopy(globalProfilePreset)
    self.docProfile = deepCopy(docProfilePreset)
    self.notebookProfile = deepCopy(notebookProfilePreset)
    self.tempProfile = deepCopy(tempProfilePreset)
    self.dataSource = deepCopy(dataSourcePreset)

    self.OCROnline = { times: 0, status: "free" }
    self.customSelectedNodes = []
    const SettingViewController = JSB.defineClass(
      getObjCClassDeclar("SettingViewController", "UITableViewController"),
      settingViewControllerInst
    )
    self.settingViewController = new SettingViewController()
    self.settingViewController.dataSource = self.dataSource
    self.settingViewController.window = self.window
    self.settingViewController.profile = self.globalProfile
    self.settingViewController.docProfile = self.docProfile
    self.settingViewController.notebookProfile = self.notebookProfile
  },
  notebookWillOpen(notebookid: string) {
    console.log("Open a notebook", "lifeCycle")
    self.notebookid = notebookid
    if (self.docmd5)
      readProfile({
        range: Range.Notebook,
        notebookid
      })
    // Add hooks, aka observers
    eventHandlers.add()
    gestureHandlers().add()
  },
  documentDidOpen(docmd5: string) {
    // Switch document, read doc profile
    if (self.docmd5)
      readProfile({
        range: Range.Doc,
        docmd5
      })
    else {
      // First open a document, init all profile
      readProfile({
        range: Range.All,
        docmd5,
        notebookid: self.notebookid
      })
    }
    self.docmd5 = docmd5
    console.log("Open a document", "lifeCycle")
  },
  notebookWillClose(notebookid: string) {
    console.log("Close a notebook", "lifeCycle")
    removeLastCommentCacheTitle()
    closePanel()
    // Remove hooks, aka observers
    eventHandlers.remove()
    gestureHandlers().remove()
  },
  documentWillClose(docmd5: string) {
    console.log("Close a document", "lifeCycle")
  },
  // Not triggered on ipad
  sceneDidDisconnect() {
    console.log("Close a window", "lifeCycle")
  },
  sceneWillResignActive() {
    // or go to the background
    console.log("Window is inactivation", "lifeCycle")
    removeLastCommentCacheTitle()
    // !MN.isMac && closePanel()
  },
  sceneDidBecomeActive() {
    layoutViewController()
    // or go to the foreground
    console.log("Window is activated", "lifeCycle")
  }
}
