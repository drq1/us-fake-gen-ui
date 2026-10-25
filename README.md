# 🇺🇸 美国真实地址与身份信息生成器 (US Real Profile Generator)

> 现代化、高精度的美国真实物理地址与虚拟身份生成工具。专为美区账户注册、海淘转运仓填写、跨境电商防风控、外贸测试与账单对齐量身打造。

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Checked-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](#)

---

## ✨ 核心特性

### 1. 📍 100% 真实物理建筑地址
- **严密物理对齐**：街道（Street）、城市（City）、州（State）和五位邮编（ZIP Code）在现实世界中 100% 真实对齐，可通过 USPS 官网或 Google Maps 真实导航查验。
- **全美覆盖**：完整覆盖全美 50 个州及华盛顿特区（DC）。

### 2. 🏷️ 5 大免税州一键直达
- 针对海淘转运仓及美区数字消费（Apple ID、Steam、Google Play、Amazon），内置 5 个 0% 消费税州的专属预设与高亮免税标签：
  - **特拉华州 (DE)**：海淘转运仓第一首选
  - **俄勒冈州 (OR)**：西海岸海淘与物流首选
  - **蒙大拿州 (MT)**：免税数字服务首选
  - **新罕布什尔州 (NH)**：东北部免税州
  - **阿拉斯加州 (AK)**：免州消费税

### 3. 🔍 智能模糊搜索下拉框 (State Combobox)
- **多维度检索**：下拉框支持输入中文名（如 `加州`、`麻省`、`纽约`）、拼音、两位官方缩写（如 `CA`、`NY`、`OR`）以及英文全称。
- **标签快捷聚合**：直接在搜索框输入 `免税`，立即聚合过滤出所有免税州。
- **无障碍与全键盘**：支持方向键导航、回车选中与 ESC 退出。

### 4. ⚡ 纯本地离线高可用架构
- 内置全美各州核心真实城市字典与教育部权威认证大学数据库（含真实 IPEDS 代码、地址、官网与联系方式）。
- **零网络请求依赖**：脱离不可靠的第三方接口，杜绝 404 报错与跨域网络延迟，0ms 瞬间响应。

### 5. 📱 移动端与现代化 UI 设计规范
- **响应式排版**：预设场景卡片在手机端自动折叠为紧凑横向滑动胶囊栏，节省首屏空间超过 300px。
- **防止文字截断**：长地址独占整行排版，操作按钮文案精准提炼，杜绝省略号尴尬截断。
- **快捷交互**：全卡片各字段单键一键复制、亚马逊/苹果账单地址对照拆解、格式化 JSON 结构化数据导出。

---

## 🛠️ 技术栈

| 模块 | 技术选型 | 说明 |
| :--- | :--- | :--- |
| **前端框架** | Next.js 15.2 (App Router) | 高性能 React 全栈框架 |
| **视图层** | React 19 | 最新 React 核心 |
| **样式与系统** | Tailwind CSS + Radix UI | 无障碍 UI 与现代设计规范 |
| **交互组件** | `cmdk` + Lucide Icons | 极速命令面板式模糊搜索与矢量图标库 |
| **语言规范** | TypeScript (Strict Mode) | 0 报错、严格类型推断 |
| **包管理器** | pnpm | 极速依赖安装与幽灵依赖防护 |

---

## 🚀 本地开发与运行

### 1. 克隆代码仓库
```bash
git clone https://github.com/drq1/us-fake-gen-ui.git
cd us-fake-gen-ui
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 启动开发服务器
```bash
pnpm dev
```
打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可开始使用。

### 4. 生产构建验证
```bash
pnpm build
```

---

## 📁 目录结构

```text
us-fake-gen-ui/
├── app/
│   ├── api/generate/route.ts      # 本地数据生成服务端 API
│   ├── globals.css                # 全局样式与变量定义
│   ├── layout.tsx                 # 根布局与元数据配置
│   └── page.tsx                   # 核心主页面
├── components/
│   ├── address-info-card.tsx      # 真实物理地址核心展示与电商对照
│   ├── category-bento-grid.tsx    # 便捷 Bento 栅格展示
│   ├── config-dialog.tsx          # 高级生成参数配置弹窗
│   ├── credit-card-widget.tsx     # 信用卡卡面真实拟态展示
│   ├── detail-info-card.tsx       # 个人、就业、财务、网络详细信息卡片
│   ├── header-toolbar.tsx         # 顶栏导航与主题工具条
│   ├── hero-profile.tsx           # 个人头像与核心档案概要
│   ├── json-download-dialog.tsx   # 格式化 JSON 数据导出弹窗
│   ├── preset-scenarios.tsx       # 场景化快速预设栏（免税/海淘/学生等）
│   ├── quick-filter-bar.tsx       # 快速筛选栏（州/性别/年龄段）
│   └── state-combobox.tsx         # 带即时输入搜索的州选择组件
└── lib/
    ├── constants.ts               # 全美各州、消费税率与中英文常量
    ├── generator.ts               # 离线虚拟人偶信息生成核心算法
    ├── real-addresses.ts          # 全美已验证真实物理建筑地址库
    ├── real-universities.ts       # 全美权威大学与教育机构数据库
    ├── types.ts                   # 严格 TypeScript 领域类型定义
    └── us-cities.ts               # 全美 50 州核心城市离线数据字典
```

---

## ⚖️ 免责声明 (Disclaimer)

本项目生成的全部个人身份信息、电话号码、虚拟卡号及社保号（SSN）均为符合算法规则的**虚拟模拟数据**，仅供软件测试、跨境 UI 布局对齐、表单开发及合规海外购物转运地址格式参考使用。严禁用于任何形式的非法用途。
