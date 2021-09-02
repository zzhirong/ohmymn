const config: IConfig = {
  name: "OhMyMN",
  intro: "version: beta 1.0.0 \nmade by @ourongxing",
  link: "https://github.com/ourongxing/ohmymn",
  settings: [
    {
      key: "rightMode",
      type: cellViewType.switch,
      label: "面板置于右侧"
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
      help: "【当前文档】开启后会在矫正后执行处理",
      key: "autoCorrect",
      type: cellViewType.switch,
      label: "是否开启了自动在线矫正",
    }

  ],
  actions: [
  ]
}

const util = { }
const action = { }
export default { config, util, action }