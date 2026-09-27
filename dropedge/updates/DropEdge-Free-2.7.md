<!-- sparkle-sign-warning:
IMPORTANT: This file was signed by Sparkle. Any modifications to this file requires updating signatures in appcasts that reference this file! This will involve re-running generate_appcast or sign_update.
-->
# DropEdge 2.7

新功能
- 托盘内容在退出、重启或更新后自动恢复；可在设置中关闭，关闭后立即清除已保存的内容。
- 支持拖入文字：选中一段文字拖进托盘即保存为文本条目，拖出时既可作为文字粘贴，也可作为 .txt 文件。
- 全局快捷键 ⌃⌥D 随时显示或隐藏托盘，可在设置中录制新的组合或移除。
- 右键菜单新增“共享”，可通过 AirDrop、信息、邮件等系统方式发送。
- 多选：⌘ 点击、⇧ 点击或 ⌘A 选择多项，一次拖出、共享或移除。
- 在托盘内上下拖动即可调整顺序。
- 可指定在哪些 App 中忽略晃动呼出，避免在设计类软件中误触发。
- 首次启动时显示简短提示，说明如何呼出托盘。

改进
- 撤销或重做只在涉及正在处理的文件时才取消打包或转换，并给出提示。
- 采用 Swift 6 严格并发检查构建，提升稳定性。

修复
- 官网版“检查更新”在某些情况下一直显示“正在检查”。

官网版为免费版；Pro、试用和购买恢复请在 Mac App Store 版本中使用。

---

New
- The shelf is restored after quitting, restarting, or updating. You can turn this off in Settings, which deletes the saved shelf immediately.
- Drag in text: selected text becomes a text item that drags out as text or as a .txt file.
- Show or hide the shelf anytime with ⌃⌥D. Record a different shortcut or remove it in Settings.
- Share items with AirDrop, Messages, Mail, and more from the context menu.
- Select several items with ⌘-click, ⇧-click, or ⌘A, then drag, share, or remove them together.
- Drag items up or down inside the shelf to reorder them.
- Choose apps in which shaking the cursor won’t open the shelf, such as design tools.
- A short tip on first launch explains how to open the shelf.

Improvements
- Undo and redo only cancel a ZIP or conversion when they affect the files being processed, and say so when they do.
- Built with Swift 6 strict concurrency checking for improved reliability.

Fixes
- Website edition: “Check for Updates” could remain stuck on “Checking…”.

The website edition is free. Pro, trials, and purchase restoration are available in the Mac App Store edition.
