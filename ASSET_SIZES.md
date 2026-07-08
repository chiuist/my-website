# HEYHONG Website Asset Sizes

把素材按下面文件名放到对应目录即可，页面会自动调用。

## 顶部 Banner 宣传图

- `assets/banners/banner-01.jpg`

建议尺寸：`2880 x 1500px`

页面桌面端显示槽约为 `1440 x 650-760px`，比例建议接近 `1.9:1`。移动端会使用 `cover` 居中裁切，所以核心视觉和文字尽量放在画面中间 `60%` 区域内。

## 第二部分：发行文章图片矩阵

- `assets/articles/article-01.jpg`：全球发行流程手册
- `assets/articles/article-02.jpg`：海外发行基建
- `assets/articles/article-03.jpg`：海外社区搭建 SOP
- `assets/articles/article-04.jpg`：AI 对发行运营的增效

建议尺寸：`640 x 346px`

页面桌面端每张显示槽约为 `314 x 170px`，比例约 `1.85:1`。

## 第三部分：AI 开发产品

头像：

- `assets/products/product-01-avatar.jpg`
- `assets/products/product-02-avatar.jpg`
- `assets/products/product-03-avatar.jpg`
- `assets/products/product-04-avatar.jpg`

建议尺寸：`164 x 164px`

产品横图：

- `assets/products/product-01-cover.jpg`
- `assets/products/product-02-cover.jpg`
- `assets/products/product-03-cover.jpg`
- `assets/products/product-04-cover.jpg`

建议尺寸：`636 x 300px`

页面桌面端每张横图显示槽约为 `160 x 76px`，比例约 `2.12:1`。移动端一排两个，横图会进一步收窄裁切。

## 配置提示

首页文章和 AI 产品卡片内容在 `index.html` 底部的 `articleConfig`、`productConfig` 数组里配置。

- 首页第二部分是固定 4 个展示位，主要用于设计展示和重点文章露出；后续新增的其他文章可以继续收录到 `articles.html` 的 `See all` 列表页里。
- `articleConfig[].meta` 是可选标签数组，不填或留空就不会显示标签。
- `productConfig[].platforms` 是可选平台标签数组，不填或留空时会使用 `platform` 文本；如果 `platform` 也留空，就不会显示平台信息。
