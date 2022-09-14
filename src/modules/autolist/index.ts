import { CellViewType } from "~/enum"
import {
  string2ReplaceParam,
  checkReplaceParamFromMNLink,
  checkReplaceParam
} from "~/utils"
import { defineConfig } from "~/profile"
import { getExcerptNotes } from "~/sdk"
import { lang } from "./lang"
import { ListSelected } from "./typings"
import { addLineBreak, addNumber } from "./utils"

export default defineConfig({
  name: "AutoList",
  key: "autolist",
  intro: lang.intro,
  link: lang.link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: lang.on,
      auto: {
        modifyExcerptText({ text }) {
          return addLineBreak(text)
        }
      }
    },
    {
      key: "preset",
      type: CellViewType.MuiltSelect,
      option: lang.preset.$option4,
      label: lang.preset.label
    },
    {
      key: "customList",
      type: CellViewType.Input,
      help: lang.custom_list,
      bind: ["preset", 0],
      link: lang.link,
      check({ input }) {
        checkReplaceParamFromMNLink(input)
      }
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: lang.list_selected.label,
      key: "listSelected",
      option: lang.list_selected.$option2,
      method({ nodes, content, option }) {
        if (option == ListSelected.UseAutoList) {
          nodes.forEach(node => {
            getExcerptNotes(node).forEach(note => {
              const text = note.excerptText
              if (text) note.excerptText = addLineBreak(text)
            })
          })
        } else if (content) {
          const params = string2ReplaceParam(content)
          const { regexp, fnKey, newSubStr } = params[0]
          nodes.forEach(node => {
            getExcerptNotes(node).forEach(note => {
              const text = note.excerptText
              if (text)
                note.excerptText = addNumber(
                  text
                    .replace(regexp, newSubStr)
                    .replace(/\n{2,}/g, "\n")
                    .trim(),
                  fnKey
                )
            })
          })
        }
      },
      check({ input }) {
        checkReplaceParam(input)
      }
    }
  ]
})
