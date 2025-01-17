import { author, version } from "package.json"
import { defineMainfest } from "scripts/utils"

export default defineMainfest({
  author,
  version,
  key: "ohmymn",
  title: "OhMyMN",
  minMarginNoteVersion: "3.7.21",
  profileKey: {
    global: "ohmymn_profile_global_v4",
    doc: "ohmymn_profile_doc_v4",
    notebook: "ohmymn_profile_notebook_v4"
  },
  color: {
    border: "#8A95A2",
    button: "#8A95A2"
  },
  github: "https://github.com/marginnoteapp/ohmymn",
  forumZH: "https://bbs.marginnote.cn/t/topic/20501",
  forum: "https://forum.marginnote.com/t/5883",
  docZH: "https://ohmymn.marginnote.cn",
  doc: "https://ohmymn.vercel.app",
  files: [
    "assets/logo.png",
    "assets/icon",
    "assets/AutoSimplifyData.json"
    // "assets/AutoCompleteData.db"
    // "assets/AutoCompleteData.zip"
  ]
})
