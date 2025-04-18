
<p align="center">
  <img src="https://img.shields.io/badge/SYSUBooking-智能羽毛球预约系统-blue.svg?style=flat-square" alt="SYSUBooking">
</p>

# SYSU羽毛球预约系统使用说明（标准版本）

本项目旨在帮助用户实现“中山大学体育场馆系统”的自动预约功能。通过本地运行 Node.js 服务配合浏览器插件（Tampermonkey 油猴脚本），可在目标时间段实现自动点击预约、自动确认预约，并通过企业微信机器人推送预约成功信息到微信群，极大提升预约效率。

---

## 功能概述

本系统由两部分组成：

- **本地服务端（webhook-proxy.js）**：
  用于接收浏览器脚本的预约结果，并转发消息到企业微信机器人接口。解决浏览器中的跨域限制问题。

- **浏览器脚本（script.user.js）**：
  运行于油猴（Tampermonkey）插件中，用于自动化网页上的预约流程，包括：
  - 自动选择日期和时间段
  - 自动点击“预约”与“确认”
  - 搭配本地服务，将成功信息发送到企业微信群

---

## 一、运行本地服务（Webhook Proxy）

1. 安装 Node.js：https://nodejs.org/  
   安装后执行以下命令验证：

```bash
node -v
npm -v
```

2. 进入项目目录并安装依赖：

```bash
cd sysu-booking-open-source-package
npm install
```

3. 启动 webhook 本地代理服务：

```bash
node webhook-proxy.js
```

如果看到 `Listening on http://localhost:5678`，说明服务启动成功。

---

### 为什么需要这个本地服务？

由于浏览器环境下的脚本无法直接访问企业微信 Webhook 接口（跨域限制），我们需通过本地 Node 服务作为代理中转。将脚本中的消息转发给这个本地服务，再由它完成微信消息的发送。

---

### 企业微信机器人是什么？

企业微信机器人是一种可向微信群发送自动消息的接口服务。你可以为一个企业微信群添加机器人，获取一个形如：

```
https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxxxx
```

的地址，并将其配置到 webhook-proxy 服务中。

如果你想让他人在外部网络也能触发该接口，你需使用 **ngrok、frp、Railway** 等方式将本地端口 `5678` 映射到公网，形成一个 webhook 中转服务。

---

## 二、配置浏览器端脚本（油猴）

1. 安装 [Tampermonkey](https://tampermonkey.net/) 插件（支持 Chrome、Edge）
2. 新建脚本，将项目中的 `script.user.js` 代码粘贴进去并保存
3. 修改以下配置：

```js
const targetDate = '04-22';  // 预约日期（格式：MM-DD）
const targetTimes = ['20:00-21:00', '21:00-22:00'];  // 预约时间段
const webhookProxyURL = 'http://localhost:5678/proxy-webhook';  // 本地服务地址
```

4. 打开中山大学场馆预约页面 `https://gym.sysu.edu.cn/`，脚本将自动运行。

---

## 三、脚本功能一览

- 指定日期时间段预约
- 自动点击“预约”按钮
- 自动点击“确认”弹窗
- 抢到场后通过本地服务推送预约结果至企业微信
- 抢不到自动刷新页面并重试

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE) © 2025 ChatGPT + Zhihong0615
