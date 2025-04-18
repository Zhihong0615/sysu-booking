// Webhook proxy script 示例（请替换为真实 proxy 逻辑）
// webhook-proxy.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5678;

app.use(cors());
app.use(express.json());

app.post('/proxy-webhook', async (req, res) => {
    const { webhookUrl, payload } = req.body;

    if (!webhookUrl || !payload) {
        return res.status(400).send({ error: '缺少 webhookUrl 或 payload' });
    }

    try {
        const response = await axios.post(webhookUrl, payload);
        console.log('[✅] 已成功转发内容: ', payload.text?.content || '[无文本]');
        res.status(200).send(response.data);
    } catch (err) {
        console.error('[❌] 转发失败:', err.message);
        res.status(500).send({ error: '转发失败', detail: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Webhook Proxy 运行中：http://localhost:${PORT}/proxy-webhook`);
});
