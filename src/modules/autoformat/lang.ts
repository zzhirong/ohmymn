import { MN } from "~/sdk"

const zh = {
  intro: "优化摘录和标题的排版与格式",
  link: "https://ohmymn.marginnote.cn/guide/modules/autoformat.html",
  on: "摘录时自动执行",
  custom_format: "自定义，点击查看具体格式",
  preset: {
    label: "选择需要的预设",
    $option6: [
      "自定义",
      "去除全部空格",
      "半角转全角",
      "中英文加空格",
      "去除中文间空格",
      "去除重复空格"
    ]
  },
  format_selected: {
    label: "优化排版格式",
    $option3: ["标题和摘录", "仅标题", "仅摘录"]
  },
  format_title: {
    help: "涉及到首字母大写，点击查看具体规范",
    label: "英文标题规范化"
  }
}

const en: typeof zh = {
  intro: "Optimize the typography and formatting of excerpts & titles",
  link: "https://ohmymn.marginnote.cn/guide/modules/autoformat.html",
  on: "Auto Executed",
  custom_format: "Customize. Click for specific formats",
  preset: {
    label: "Select Presets",
    $option6: [
      "Custom",
      "Remove All Spaces",
      "Half Width To Full Width",
      "Add Space Between Chinese&English",
      "Remove Spaces Between Chinese",
      "Remove Multiple Spaces"
    ]
  },
  format_selected: {
    label: "Optimize Typography",
    $option3: [
      "Optimize All",
      "Only Optimize Title",
      "Only Optimize Excerption"
    ]
  },
  format_title: {
    label: " Normalize English Title",
    help: "Click for  specific specifications"
  }
}

export const lang = MN.isZH ? zh : en
