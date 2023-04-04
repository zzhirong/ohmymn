import { i18n } from "marginnote"

export default i18n({
  zh: {
    intro: "使用 OpenAI 辅助摘录",
    on: "摘录时自动执行",
    onSelection: "选择时自动执行",
    preset: {
      label: "选择需要的预设",
      $option1: ["自定义"] as StringTuple<1>
    },
    word_count: "[类中文字数，类英文单词数]，超过才会翻译。      ",
    openai_url: {
      help: "服务器地址",
      link: ""
    },
    openai_secretkey: {
      help: "API Key",
      link: ""
    },
    custom_prompt: "自定义提示",
    openai_to_lang: {
      label: "输出语言",
      $option4: ["简体中文", "繁体英文", "英语", "日语"] as StringTuple<4>
    },
    openai_prompt: {
      label: "功能",
      $option6: [
        "翻译",
        "润色",
        "总结",
        "分析",
        "解释代码",
        "自定义"
      ] as StringTuple<6>
    },
    no_result: "没有获取到结果",
    process_card: {
      label: "AI处理摘录内容",
      help: "根据 AIAssistant 设置中的功能处理卡片中所有的摘录，注意不要同时提交太多内容。"
    },
    loading: "AI 处理中, 可能会有点慢...",
    translate_text: "翻译",
    polishing_text: "润色",
    summarize_text: "总结",
    analyze_text: "解析句子",
    explain_code: "解释代码",
    no_openai_secretkey: "没有设置OpenAI API Key"
  },
  en: {
    intro: "Using OpenAI to assist in excerpting",
    on: "Auto Run When Excerpting",
    onSelection: "translate on selection",
    preset: {
      label: "Select Preset",
      $option1: ["Custom"]
    },
    word_count: "[Chinese words, English words], if exceeded, then translate.",
    openai_url: {
      help: "Server Address",
      link: ""
    },
    openai_secretkey: {
      help: "API Key",
      link: ""
    },
    custom_prompt: "Custom prompt",
    openai_to_lang: {
      label: "Output Language",
      $option4: [
        "Simplified Chinese",
        "Traditional Chinese",
        "English",
        "Japanese"
      ] as StringTuple<4>
    },
    openai_prompt: {
      label: "Function",
      $option6: [
        "Translate",
        "Polishing",
        "Summarize",
        "Analyze",
        "Explain-Code",
        "CustomPrompt"
      ] as StringTuple<6>
    },
    no_result: "No Result",
    process_card: {
      label: "Processing Excerpt with AI",
      help: "Process all excerpts on the card based on the settings in the function field. Please note that processing too much text simultaneously may result in failure."
    },
    translate_text: "Translate",
    polishing_text: "Polish",
    summarize_text: "Summarize",
    analyze_text: "Analyze",
    explain_code: "Explain code",
    loading: "Processing...",
    no_openai_secretkey: "No API Key"
  }
})
