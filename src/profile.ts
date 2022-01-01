const profilePreset = {
  ohmymn: {
    quickSwitch: [] as number[],
    doubleClick: false,
    clickHidden: false,
    lockExcerpt: false,
    screenAlwaysOn: false,
    panelPostion: [0],
    panelHeight: [1]
  },
  gesture: {
    // 单选不允许为空，一般设置一个选项为空
    singleBarSwipeUp: [0],
    singleBarSwipeDown: [0],
    singleBarSwipeRight: [0],
    singleBarSwipeLeft: [0],
    muiltBarSwipeUp: [0],
    muiltBarSwipeDown: [0],
    muiltBarSwipeRight: [0],
    muiltBarSwipeLeft: [0]
  },
  autocomplete: {
    customComplete: `"{{zh}}"`
  },
  autostandardize: {
    preset: [] as number[]
  },
  anotherautotitle: {
    preset: [] as number[],
    mergeTitle: false,
    changeTitleNoLimit: false,
    wordCount: "[10,5]",
    customBeTitle: ""
  },
  anotherautodef: {
    preset: [] as number[],
    onlyDesc: false,
    toTitleLink: false,
    customSplit: "",
    customSplitName: "",
    customDefTitle: ""
  },
  autolist: {
    preset: [] as number[],
    customList: ""
  },
  autoreplace: {
    preset: [0],
    customReplace: ""
  }
}

const docProfilePreset = {
  ohmymn: {
    profile: [0],
    autoCorrect: false
  }
}

/**
 * 单个插件开关
 */
export const enum on {
  anotherautotitle = 0,
  anotherautodef = 1,
  autostandardize = 2,
  autocomplete = 3,
  autoreplace = 4,
  autolist = 5
}

type IProfile = typeof profilePreset
type IDocProfile = typeof docProfilePreset

const profile: {
  [k: string]: { [k: string]: boolean | string | number[] }
} & IProfile = JSON.parse(JSON.stringify(profilePreset))
const docProfile: {
  [k: string]: { [k: string]: boolean | string | number[] }
} & IDocProfile = JSON.parse(JSON.stringify(docProfilePreset))

export {
  profile,
  profilePreset,
  docProfile,
  docProfilePreset,
  IProfile,
  IDocProfile
}
