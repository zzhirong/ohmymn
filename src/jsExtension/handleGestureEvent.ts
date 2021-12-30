import type { gestureHandler } from "types/Addon"
import { UISwipeGestureRecognizerDirection } from "types/UIKit"
import { MN } from "const"
import { magicAction } from "settingViewController/handleUserAction"
import { studyMode } from "types/MarginNote"
import { util as gesture } from "addons/gesture"
import { dataSourceIndex } from "synthesizer"
import { profile } from "profile"

const actionKey = [
  "none",
  "filterCards",
  "changeFillSelected",
  "changeColorSelected",
  "completeSelected",
  "listSelected",
  "mergeTextSelected",
  "renameSelected",
  "switchTitleorExcerpt",
  "standardizeSelected",
  "replaceSelected",
  "extractTitle"
]

// Mac 上无法使用触摸
export const gestureHandlers = gesture.gestureHandlerController([
  {
    // 如果直接传递 view 和 gesture，此时无法获取到 self
    view: () => MN.studyController.view,
    gesture: () =>
      gesture.initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Up,
        "SwipeUpOnMindMapView"
      )
  },
  {
    view: () => MN.studyController.view,
    gesture: () =>
      gesture.initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Down,
        "SwipeDownOnMindMapView"
      )
  },
  {
    view: () => MN.studyController.view,
    gesture: () =>
      gesture.initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Left,
        "SwipeLeftOnMindMapView"
      )
  },
  {
    view: () => MN.studyController.view,
    gesture: () =>
      gesture.initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Right,
        "SwipeRightOnMindMapView"
      )
  }
])

const enum swipePositon {
  None = 0,
  SingleBar,
  MuiltBar
}

const checkSwipePosition = (sender: UIGestureRecognizer): swipePositon => {
  const MindMapNodeViews = MN.notebookController.mindmapView.selViewLst
  // 必须打开脑图，并且选中卡片
  if (
    MN.studyController.studyMode != studyMode.study ||
    !MindMapNodeViews?.length
  )
    return swipePositon.None
  const { y: swipeY } = sender.locationInView(MN.studyController.view)
  if (MindMapNodeViews.length == 1) {
    const view = MindMapNodeViews![0].view
    const { x, y, height } =
      MN.notebookController.mindmapView.subviews[0].subviews[0].convertRectToView(
        view.frame,
        MN.studyController.view
      )
    // 工具栏在上面
    return (y - swipeY < 50 && y - swipeY > 0) ||
      // 工具栏在下面
      (swipeY - y < height + 50 && swipeY - y > height)
      ? swipePositon.SingleBar
      : swipePositon.None
  } else {
    const { height } = MN.studyController.view.bounds
    return height - swipeY > 50 && height - swipeY < 150
      ? swipePositon.MuiltBar
      : swipePositon.None
    // alert(JSON.stringify({ swipeX, swipeY, height}))
  }
}

const getActionIndex = (key: string) => dataSourceIndex.magicaction[key]
const trigger = async (
  sigleOption: number,
  muiltOption: number,
  sender: UIGestureRecognizer
) => {
  switch (checkSwipePosition(sender)) {
    case swipePositon.None:
      return
    case swipePositon.SingleBar: {
      if (!sigleOption) return
      const [sec, row] = getActionIndex(actionKey[sigleOption])
      await magicAction(NSIndexPath.indexPathForRowInSection(row, sec))
      break
    }
    case swipePositon.MuiltBar: {
      if (!muiltOption) return
      const [sec, row] = getActionIndex(actionKey[muiltOption])
      await magicAction(NSIndexPath.indexPathForRowInSection(row, sec))
      break
    }
  }
}

const onSwipeUpOnMindMapView: gestureHandler = sender => {
  const { singleBarSwipeUp, muiltBarSwipeUp } = profile.gesture
  trigger(singleBarSwipeUp[0], muiltBarSwipeUp[0], sender)
}
const onSwipeDownOnMindMapView: gestureHandler = sender => {
  const { singleBarSwipeDown, muiltBarSwipeDown } = profile.gesture
  trigger(singleBarSwipeDown[0], muiltBarSwipeDown[0], sender)
}
const onSwipeLeftOnMindMapView: gestureHandler = sender => {
  const { singleBarSwipeLeft, muiltBarSwipeLeft } = profile.gesture
  trigger(singleBarSwipeLeft[0], muiltBarSwipeLeft[0], sender)
}
const onSwipeRightOnMindMapView: gestureHandler = sender => {
  const { singleBarSwipeRight, muiltBarSwipeRight } = profile.gesture
  trigger(singleBarSwipeRight[0], muiltBarSwipeRight[0], sender)
}

export default {
  onSwipeUpOnMindMapView,
  onSwipeDownOnMindMapView,
  onSwipeLeftOnMindMapView,
  onSwipeRightOnMindMapView
}