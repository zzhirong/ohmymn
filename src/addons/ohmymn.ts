import { Addon } from "const"
import { cellViewType, IConfig } from "types/Addon"

const config: IConfig = {
  name: Addon.title,
  intro: `version: ${Addon.version} \nmade by ${Addon.author}`,
  link: "https://github.com/ourongxing/ohmymn",
  settings: [
    {
      help: "【当前文档生效】可用于不同情景",
      key: "profile",
      type: cellViewType.select,
      option: ["配置 1", "配置 2", "配置 3", "配置 4", "配置 5"],
      label: "选择配置文件"
    },
    {
      label: "插件快捷开关",
      key: "quickSwitch",
      type: cellViewType.muiltSelect,
      option: [
        "AnotherAutoTitle",
        "AnotherAutoDef",
        "AutoStandardize",
        "AutoComplete",
        "AutoReplace",
        "AutoList"
      ].map((value, index) => "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳"[index] + " " + value)
    },
    {
      key: "panelPostion",
      type: cellViewType.select,
      option: ["自动", "靠左", "中间", "靠右"],
      label: "面板显示位置"
    },
    {
      key: "panelHeight",
      type: cellViewType.select,
      option: ["高点", "标准", "矮点"],
      label: "面板显示高度"
    },
    {
      key: "doubleClick",
      type: cellViewType.switch,
      label: "双击打开面板"
    },
    {
      key: "clickHidden",
      type: cellViewType.switch,
      label: "自动关闭面板"
    },
    {
      key: "screenAlwaysOn",
      type: cellViewType.switch,
      label: "保持屏幕常亮"
    },
    {
      key: "lockExcerpt",
      type: cellViewType.switch,
      label: "锁定摘录文字"
    },
    {
      help: "【当前文档生效】开启后会在矫正后执行处理",
      key: "autoCorrect",
      type: cellViewType.switch,
      label: "是否开启自动在线矫正"
    }
  ],
  actions: []
}

const util = {}
const action = {}
export { config, util, action }
