<!-- sparkle-sign-warning:
IMPORTANT: This file was signed by Sparkle. Any modifications to this file requires updating signatures in appcasts that reference this file! This will involve re-running generate_appcast or sign_update.
-->
# DropEdge 2.6

新功能
- 晃动呼出：拖拽文件时轻晃光标，托盘直接出现在光标下方，原地松手即可放入。
- 托盘可自由移动：按住托盘空白处即可拖到任意位置，靠近屏幕左右边缘松开会自动吸附停靠。
- 设置中可查看并清除已授权的文件位置。

改进
- 压缩包命名与访达一致（单项为“原名.zip”，多项为“归档.zip”），解压后不再多出一层文件夹，体积也更小。
- 格式转换后的图片和拖入的图片保留原文件名。
- 晃动灵敏度滑条的每一档都会生效。
- 多个文件拖入后保持原有顺序；大图缩略图在后台加载，拖入更流畅。
- 错误提示不再遮挡托盘中的文件；托盘上下留白更均匀。
- 补全标准菜单：⌘W 关闭窗口、⌘M 最小化、拷贝与粘贴等；菜单栏图标按下即打开菜单。
- 设置页改为与“系统设置”一致的原生布局，更紧凑清晰；购买页面外观更贴近系统，托盘中的小字更易读。
- 「Liquid Glass 透明外观」改为跟随系统的透明度设置：系统调到最透明时托盘文字依然清晰，点击托盘时背景也不再变化。
- 针对 macOS 27 构建。

修复
- 在两块并排的显示器之间拖动文件时误弹出托盘。
- “跟随系统”外观下切换深浅色时，托盘颜色未随之更新。
- 断开外接显示器后，托盘可能显示在屏幕之外。
- 托盘刚出现时无法用方向键选择项目。
- 托盘列表的滚动条过粗、一直显示并占用卡片宽度（现为滚动时出现的细滚动条）。
- SVG 文件导致整批图片转换失败。
- 长时间运行后临时文件未及时清理。
- 官网版一次拖入过多文件时重复弹出提示。

官网版为免费版；Pro、试用和购买恢复请在 Mac App Store 版本中使用。

---

New
- Shake to summon: shake the cursor while dragging and the shelf appears right under it. Just let go to drop.
- Move the shelf anywhere by dragging any blank area. Release it near the left or right edge of the screen to dock it.
- View and clear saved file-location authorizations in Settings.

Improvements
- Archives are named like Finder’s (“Name.zip” for one item, “Archive.zip” for several), unzip without an extra folder, and are smaller.
- Converted and dropped images keep their original file names.
- Every step of the shake sensitivity slider now takes effect.
- Multiple dropped files keep their order, and large image thumbnails load in the background for smoother drops.
- Error messages no longer cover items on the shelf, and spacing around the list is more even.
- Standard menus: ⌘W to close windows, ⌘M to minimize, Copy and Paste, and more. The menu bar icon opens its menu on click.
- Settings now uses the same compact native layout as System Settings, the purchase window looks more native, and small text on the shelf is easier to read.
- The Liquid Glass appearance now follows the system transparency setting: shelf text stays legible at the clearest setting, and the background no longer changes when you click the shelf.
- Built for macOS 27.

Fixes
- The shelf no longer appears when dragging files between side-by-side displays.
- The shelf now updates when macOS switches between light and dark while set to Follow System.
- The shelf can no longer appear off-screen after an external display is disconnected.
- Arrow keys now select items as soon as the shelf appears.
- The shelf list now uses a thin scroll bar that appears while scrolling, instead of a wide bar that was always visible.
- An SVG file no longer makes a whole image conversion fail.
- Temporary files are now cleaned up while the app keeps running.
- Website edition: dropping too many files no longer shows the upgrade prompt repeatedly.

The website edition is free. Pro, trials, and purchase restoration are available in the Mac App Store edition.
