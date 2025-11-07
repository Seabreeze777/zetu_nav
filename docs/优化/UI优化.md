泽途网 (Zetu Nav) UI设计感优化方案
核心目标： 在不改动你强大后台功能 和灵活卡片逻辑 的前提下，通过优化布局、排版、交互三个维度，实现“眼前一亮”的专业设计感。

一、 核心策略：创造“呼吸感”与“层次感”
你现在的UI 主要问题是“平”和“挤”。所有元素都漂浮在同一个浅灰色背景上，缺乏焦点和呼吸空间。

我们将采用现代UI设计中常见的“灰底白板”布局：

灰色背景 (Aerate): 将 body 背景色设为更清晰的浅灰（如 bg-gray-100 或 bg-slate-100）。

白色面板 (Hierarchy): 将主要内容区（右侧的卡片列表）和左侧边栏分别放置在 bg-white 的“面板”上，并加上轻微阴影（shadow-sm）和圆角（rounded-2xl）。

结果： 页面立刻拥有了清晰的 背景层 -> 内容层 结构，显得干净、高级且有条理。

二、 优化方案详情 (8项)
区域一：全局 (Global)
1. 【高优先级】升级全局字体排版

问题： 默认的系统字体 显得廉价且缺乏设计感。

方案： 在 src/app/layout.tsx 中，引入 Google Font 的 Inter 字体，并将其应用到 <body>。这是 Vercel、Figma 等现代网站的标配字体，能瞬间提升网站的专业气质。

补充： 将所有分类标题 <h2> 的字号从 text-lg 提升至 text-xl，并增加 tracking-tight（收紧字距），使标题更醒目。

2. 增加“微交互”与加载动画

问题： 页面加载和按钮点击很“静态”，缺乏反馈。

方案 A (页面加载): 利用你已有的 animate-fade-in 动画，将其应用到首页的 <main> 标签，实现内容区的平滑淡入。

方案 B (顶部导航): 为 TopNav.tsx 的“首页”、“资讯中心”等链接添加 hover:bg-gray-100 和 rounded-lg，提供清晰的悬停反馈。

方案 C (悬浮按钮): FloatingButtons.tsx 上的 hover:scale-110 动效很好。为弹出的提示 <span> 增加 shadow-lg，使其更有层次感。

区域二：Hero 区域
3. 【高优先级】实现“双搜索”功能

问题： Hero 区域 作为视觉焦点，却没有承担导航站最核心的“搜索”功能。

方案（按你的思路）：

Hero 区 (HeroSection.tsx)： 移除“热门标签”，替换为一个带 Tab 切换（如 百度、Google、Bing）的大型外部搜索引擎。这是导航站用户的核心需求。

顶栏 (TopNav.tsx)： 保留现有的 GlobalSearch，并明确其为“站内资源搜索”。

4. 优化 Hero 区域背景

问题： 现有的网格背景 bg-[url(...)] 略显过时。

方案： 移除网格背景 <div>。在 Hero 卡片的 div 上添加现代的“径向渐变”光晕（例如 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.15),_transparent_30%)]），营造更高级的氛围感。

区域三：内容与侧边栏
5. 【高优先级】重构“灰底白板”布局

问题： 如核心策略所述，bg-gray-50 搭配 bg-white 卡片，层次不清。

方案：

页面 body 或最外层容器使用 bg-gray-100。

左侧边栏 <aside>： 应用 bg-white, rounded-2xl, shadow-sm, p-2。

右侧内容区 <main>： 移除 space-y-8，改为给每一个 <section> 加上 bg-white, rounded-2xl, shadow-sm, p-6，并在 main 标签上设置 space-y-6。

效果： 这样就形成了左侧一个“白板”（边栏）和右侧一堆“白板”（内容块），它们共同“浮动”在灰色背景之上，非常清晰。

6. 统一卡片“交互”而非“样式” (保留灵活性)

问题： 既然卡片样式灵活（compact, button, large），它们的交互方式也应该统一。

方案：

移除 WebsiteCard.tsx 上的 bg-white 和 shadow 样式（因为父级 <section> 已经是白色了）。

为卡片添加 rounded-xl, border, border-transparent。

为卡片添加统一的 hover 效果：hover:bg-gray-50 (或 hover:bg-indigo-50) 和 hover:border-gray-200。

效果： 无论卡片长什么样，它们平时都“融合”在白色面板中，鼠标悬停时才会“浮现”出来，交互体验一致且高级。

7. 优化“大图卡片”的图片占位符

问题： 截图 中，“AI工具”分类的 Copilot 卡片，由于没有 Banner 大图，导致 Logo 被错误地拉伸，非常难看。

方案：

优化 ImageWithFallback.tsx 组件，使其在 type="article" (或新增 type="banner") 时，如果图片加载失败，显示一个设计过的（例如大图标+文字）占位符，而不是 type="website" 那样的小图标。

在 WebsiteCard.tsx 中，为 large 模式的 ImageWithFallback 指定 type="article"。

(推荐的后端优化): 在 Website 数据库模型 中增加一个 bannerUrl 字段 。large 模式优先使用此字段，compact 模式使用 logoUrl 字段 ，彻底解决此问题。

8. 优化页脚设计 (Footer)

问题： 页脚 的深色背景与浅色内容区域对比过强，且4列布局在宽屏下显得松散。

方案：

(简单) 保持深色背景，但将内容区的最大宽度（container）收紧，使其与顶部内容区对齐。

(推荐) 放弃深色页脚，改用与 body 相同的 bg-gray-100 背景，只用 border-t 分割线。页脚内容使用 text-gray-500，实现更简约、一体化的现代风格。