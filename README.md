
<p align="center">
  <img src="https://img.shields.io/badge/SYSUBooking-智能羽毛球抢场脚本-blue.svg?style=flat-square" alt="SYSUBooking">
</p>

# 🏸 SYSU羽毛球预约系统 · 小白也能用的终极教程

欢迎使用本项目！这是一个能自动抢 SYSU 羽毛球场地、抢到自动付款、抢不到自动刷新、还能推送消息到微信群的神奇脚本工具。

---

## 🧩 它能做什么？

- 自动在指定日期/时间段抢场地 ✅
- 抢到一个立刻自动提交 + 自动确认 ✅
- 抢不到会自动刷新页面再抢 ✅
- 抢成功后推送消息到微信群 ✅
- 无需改代码，只用浏览器和微信就能搞定 ✅

---

## 🚀 第一步：准备环境（只做一次）

### 🛠 安装 Node.js 环境

1. 打开官网 [https://nodejs.org/](https://nodejs.org/)
2. 下载推荐版本（LTS）并安装
3. 安装完后，打开终端（命令提示符）输入以下命令，检查是否安装成功：

```bash
node -v
npm -v
```

看到版本号就表示成功！

---

## 🧪 第二步：启动本地转发服务

### ✅ 作用：这个服务帮你解决“浏览器无法直接发微信消息”的问题

1. 打开命令行，进入这个文件夹（你下载解压后的项目目录）：

```bash
cd sysu-booking-open-source-package
```

2. 安装依赖：

```bash
npm install
```

3. 启动服务：

```bash
node webhook-proxy.js
```

如果看到 `Listening on http://localhost:5678` 表示成功！

---

## 🧠 第三步：安装油猴插件 + 脚本

### 🧩 什么是油猴？

油猴（Tampermonkey）是浏览器插件，用于运行你自己的自动脚本。

1. 打开浏览器（建议用 Chrome 或 Edge）
2. 安装油猴插件：

👉 [Tampermonkey Chrome 插件](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

3. 点击浏览器右上角的油猴图标，选择“添加新脚本”

4. 打开项目里的 `script.user.js` 文件，复制全部代码，粘贴进去，保存！

---

## 📅 第四步：设置你的抢场时间

在 `script.user.js` 中的这几行里修改为你想抢的时间：

```js
const targetDate = '04-22';  // 要预约的日期
const targetTimes = ['20:00-21:00', '21:00-22:00']; // 你要预约的时间段
```

然后保存脚本、刷新体育场预约页面即可自动开始！

---

## 📦 第五步：查看微信群消息推送（选配）

你可以将预约结果推送到微信工作群：

- 请创建一个企业微信群 → 添加机器人
- 将 webhook 地址填到 `webhook-proxy.js` 的转发配置里
- 抢到场地时会自动推送提醒 ✅

---

## 📷 项目演示

![二维码](./sysu-booking-qr.png)

![教程流程](./sysu-booking-tutorial.png)

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE) © 2025 ChatGPT + Zhihong0615
