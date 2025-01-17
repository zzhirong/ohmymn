import { Addon } from "~/addon"
export default {
  viewDidLoad() {
    self.tableView.allowsSelection = true
    self.view.layer.cornerRadius = 10
    self.view.layer.borderWidth = 2
    self.expandSections = new Set()
  },
  //Execute when each time it is opened
  viewWillAppear() {
    self.tableView.reloadData()
    if (MN.isMacMN3) {
      self.tableView.backgroundColor = MN.currentThemeColor
      Addon.textColor =
        MN.app.currentTheme == "Gray" || MN.app.currentTheme == "Dark"
          ? UIColor.whiteColor()
          : UIColor.blackColor()
    }
    self.view.layer.borderColor = Addon.buttonColor
  }
  // viewWillDisappear() {
  // self.tableView.setContentOffsetAnimated({ x: 0, y: 0 }, false)
  // self.expandSections.forEach(k => {
  //   const t = self.dataSource.find(h => h.key === k)?.rows[0]
  //   if (t?.type === CellViewType.PlainText) t.label = "▶ 点击展开所有选项"
  // })
  // }
}
