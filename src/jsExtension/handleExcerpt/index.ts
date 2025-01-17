import type { MbBookNote } from "marginnote"
import {
  delayBreak,
  isNoteExist,
  NodeNote,
  undoGroupingWithRefresh
} from "marginnote"

import { RemoveExcerpt } from "~/modules/addon/typings"
import { cacheTransformer } from "~/profile"
import { unique } from "~/utils"
import {
  customOCR,
  genCommentTag,
  modifyTitles,
  genColorStyle,
  genTitleTextCommentTag
} from "./genNewExcerpt"

// 记得初始化
let note: MbBookNote
let node: NodeNote
let nodeNote: MbBookNote
let isPicOCRed = false
let isComment = false
let isPic = false

export default async (n: MbBookNote) => {
  dev.log("Processing Excerpt", "excerpt")
  // Initialize global variables
  note = n
  node = new NodeNote(note)
  nodeNote = node.note
  isPicOCRed = false
  isComment = nodeNote.noteId !== note.noteId
  isComment && dev.log("The Excerpt is a comment", "excerpt")
  isPic = false

  if (note.excerptPic) {
    const autoOCR =
      MN.db.getNotebookById(note.notebookId!)?.options?.autoOCRMode ?? false
    dev.log("The excerpt is image", "ocr")
    if (autoOCR) {
      const success = await delayBreak(50, 0.1, () =>
        note.excerptText ? true : false
      )
      if (success) {
        dev.log("Image to text success", "ocr")
        isPicOCRed = true
        self.excerptStatus.OCROnlineStatus = "free"
      } else {
        isPic = true
        dev.log("Image to text fail, no text", "ocr")
      }
    } else {
      isPic = true
      dev.log("No auto-to-text option on, no image processing", "ocr")
    }
  }

  if (isPic) {
    const { tags, comments } = await genCommentTag(note, node, "@picture")
    addCommentTag({
      comments,
      tags
    })
  } else {
    if (self.docProfile.additional.needOCRWait) {
      self.docProfile.additional.needOCRWait = await delayBreak(
        50,
        0.01,
        () => self.excerptStatus.OCROnlineStatus === "begin"
      )
    }
    if (self.excerptStatus.OCROnlineStatus === "begin") {
      dev.log("Online OCR ing", "ocr")
      const success = await delayBreak(
        50,
        0.1,
        () => self.excerptStatus.OCROnlineStatus === "end"
      )
      if (success) dev.log("Online OCR success", "ocr")
      else dev.log("Online OCR fail", "ocr")
    }

    self.excerptStatus.OCROnlineStatus = "free"

    if (
      self.globalProfile.addon.lockExcerpt &&
      self.excerptStatus.isModify &&
      self.excerptStatus.lastExcerptText !== undefined
    ) {
      addTitleExcerpt({ text: self.excerptStatus.lastExcerptText })
      return dev.log("Locking excerpt is ON, restore excerpt", "excerpt")
    }

    const excerptText = (await customOCR()) ?? note.excerptText?.trim()
    if (!excerptText) return
    const { title, text, comments, tags } = await genTitleTextCommentTag({
      note,
      node,
      text: excerptText,
      isComment
    })
    addTitleExcerpt({
      text,
      title: (await modifyTitles(unique(title))).join("; ")
    })
    addCommentTag({
      comments,
      tags
    })
  }

  decorateExecrpt()
}

function addTitleExcerpt({ text, title }: { text: string; title?: string }) {
  undoGroupingWithRefresh(() => {
    if (text) {
      note.excerptText = text
      if (self.excerptStatus.lastRemovedComment?.note.noteId === note.noteId)
        self.excerptStatus.lastRemovedComment = undefined
    } else {
      // as comment
      if (isComment) {
        const index = node.getCommentIndex(note)
        if (index != -1) {
          const { removeExcerpt } = self.globalProfile.addon
          self.excerptStatus.lastRemovedComment = {
            nodeNote,
            index,
            note
          }
          if (removeExcerpt[0] === RemoveExcerpt.Now) {
            removeLastComment()
          }
        }
        if (
          isPicOCRed &&
          nodeNote.excerptText?.trim() === nodeNote.noteTitle?.trim()
        ) {
          nodeNote.excerptText = title
        }
      }

      // Excerpts can't be cleared after being OCR, otherwise the image will be displayed,
      // and must be set to the same title to not display
      else if (isPicOCRed) note.excerptText = title
      else note.excerptText = ""
    }

    if (title) node.title = title
  })
}

function addCommentTag({
  tags,
  comments
}: {
  tags: string[]
  comments: string[]
}) {
  if (
    self.excerptStatus.lastRemovedComment?.note.noteId === note.noteId ||
    !isNoteExist(note)
  )
    return
  undoGroupingWithRefresh(() => {
    if (comments?.length) {
      comments = unique(comments)
      const { cacheComment } = self.notebookProfile.additional
      const cachedComments = cacheComment[note.noteId!]
      if (cachedComments) {
        const existComments = node.note.comments
        const indexList: number[] = []
        existComments.forEach((h, i) => {
          if (
            h.type === "TextNote" &&
            cachedComments.some(k => cacheTransformer.tell(k, h.text))
          )
            indexList.unshift(i)
        })
        indexList.forEach(i => {
          nodeNote.removeCommentByIndex(i)
        })
      }
      cacheComment[note.noteId!] = comments.reduce((acc, k) => {
        k && acc.push(cacheTransformer.to(k))
        return acc
      }, [] as [string, string, string][])
      node.appendTextComments(...comments)
    }
    if (tags?.length) {
      tags = unique(tags)
      const { cacheTag } = self.notebookProfile.additional
      const cachedTags = cacheTag[note.noteId!]
      const existTags = node.tags.filter(k =>
        cachedTags?.length
          ? !cachedTags.some(h => cacheTransformer.tell(h, k))
          : true
      )
      cacheTag[note.noteId!] = tags.reduce((acc, k) => {
        k && acc.push(cacheTransformer.to(k))
        return acc
      }, [] as [string, string, string][])
      node.tags = [...existTags, ...tags]
    }
  })
}

async function decorateExecrpt() {
  if (
    self.excerptStatus.lastRemovedComment?.note.noteId === note.noteId ||
    !isNoteExist(note)
  )
    return
  const res = await genColorStyle(note)
  if (!res) return
  const { color, style } = res
  if (color === undefined && style == undefined) return
  undoGroupingWithRefresh(() => {
    // The default white color index is -1
    if (color !== undefined) note.colorIndex = color !== -1 ? color : 12
    if (style !== undefined) note.fillIndex = style
  })
}

export function removeLastComment() {
  if (!self.excerptStatus.lastRemovedComment) return
  const { nodeNote, index, note } = self.excerptStatus.lastRemovedComment
  if (isNoteExist(note) && isNoteExist(nodeNote)) {
    undoGroupingWithRefresh(() => {
      nodeNote.removeCommentByIndex(index)
    })
  }
  self.excerptStatus.lastRemovedComment = undefined
  const noteid = note.noteId!
  const { cacheTitle, cacheComment, cacheTag } = self.notebookProfile.additional
  if (cacheTitle[noteid]) cacheTitle[noteid] = undefined
  if (cacheComment[noteid]) cacheTitle[noteid] = undefined
  if (cacheTag[noteid]) cacheTitle[noteid] = undefined
}
