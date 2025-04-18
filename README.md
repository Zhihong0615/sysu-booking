<<<<<<< HEAD
# sysu-booking
=======
<p align="center">
  <img src="https://img.shields.io/badge/SYSUBooking-Auto抢场脚本-blue.svg?style=flat-square" alt="SYSUBooking">
</p>

# 🪄 SYSU羽毛球自动预约系统 · 本地Webhook代理说明

📁 文件结构：
├── webhook-proxy.js         # 本地Node服务，用于转发Webhook请求绕过浏览器CORS限制
├── package.json             # Node.js依赖清单
├── html.txt                 # 抓取的系统HTML参考
├── script.user.js           # 油猴脚本代码（复制至Tampermonkey使用）
├── LICENSE                  # 项目使用的 MIT 开源许可证
└── docs/readme.txt          # 离线说明文档

## 📦 使用说明

### 1️⃣ 安装依赖

确保安装了 Node.js，终端执行：

```bash
node -v
npm -v
npm install
```

### 2️⃣ 启动服务

```bash
node webhook-proxy.js
```

默认地址：http://localhost:5678

### 3️⃣ 配置油猴脚本

- 安装 Tampermonkey 插件
- 加载 `script.user.js`
- 确保 webhook 地址指向：`http://localhost:5678/proxy-webhook`

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE) © 2025 SG
>>>>>>> ee3fa3d (initial commit)
