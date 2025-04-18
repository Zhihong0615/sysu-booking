// 粘贴到 Tampermonkey 的自动预约脚本
// ==UserScript==
// @name         SYSU羽毛球预约 · 自动抢+推送+刷新+无场提醒
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  自动预约目标场地，抢不到会提醒、成功会推送，失败自动刷新再抢
// @author       SG
// @match        https://gym.sysu.edu.cn/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ======== ✅ 配置区域 ========
    const targetDate = '04-21';  // 想预约的日期（如 '04-21'）
    const targetTimes = ['10:00-11:00', '11:00-12:00']; // 想预约的时间段
    const maxBooking = 2;
    const webhookURL = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=74ac0b07-611d-431d-8160-13582e75dcb4';
    const enableAutoRefresh = true;
    const refreshInterval = 3000;
    const enableAutoSubmit = true;
    const enableAutoConfirm = true;
    // ==============================

    let hasClickedDate = false;
    let bookedCount = 0;
    const bookedTimes = new Set();
    let hasNotifiedNoAvailable = false;

    function simulateClick(element) {
        const evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        element.dispatchEvent(evt);
    }

    function sendWebhook(content) {
        fetch('http://localhost:5678/proxy-webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                webhookUrl: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=74ac0b07-611d-431d-8160-13582e75dcb4',
                payload: {
                    msgtype: 'text',
                    text: { content }
                }
            })
        }).catch(err => console.warn('[Webhook 发送失败]', err));
    }


    function notifyBrowser(title, body) {
        if (Notification.permission === 'granted') {
            new Notification(title, { body });
        } else {
            Notification.requestPermission();
        }
    }

    function clickTargetDate() {
        const dateItems = document.querySelectorAll('.date-item');
        for (let item of dateItems) {
            const text = item.querySelector('.date-number')?.innerText.trim();
            if (text === targetDate) {
                simulateClick(item);
                hasClickedDate = true;
                console.log(`[🎯] 点击了目标日期：${targetDate}`);
                return;
            }
        }
    }

    function tryBookingOnce() {
        if (bookedCount >= maxBooking || !hasClickedDate) return;

        const rows = document.querySelectorAll('.time-slot-table tbody tr');
        if (rows.length === 0) {
            console.log('[⏳] 时间表尚未加载');
            return;
        }

        let foundAvailable = false;

        for (let row of rows) {
            const timeLabel = row.querySelector('td')?.innerText.trim();
            if (!targetTimes.includes(timeLabel)) continue;
            if (bookedTimes.has(timeLabel)) continue;

            const buttons = row.querySelectorAll('button.slot-btn');
            for (let btn of buttons) {
                if (bookedCount >= maxBooking) return;

                if (!btn.disabled && !btn.classList.contains('sold')) {
                    simulateClick(btn);
                    bookedCount++;
                    bookedTimes.add(timeLabel);
                    const msg = `[✅] 成功预约 ${targetDate} ${timeLabel}`;
                    console.log(msg);
                    sendWebhook(msg);
                    notifyBrowser('预约成功', `${targetDate} ${timeLabel}`);
                    foundAvailable = true;
                    break;
                }
            }
        }

        // 无可预约场地提醒（只发一次）
        if (!foundAvailable && bookedCount < maxBooking && !hasNotifiedNoAvailable) {
            const allUnavailable = [...document.querySelectorAll('.slot-btn')].every(
                btn => btn.disabled || btn.classList.contains('sold')
            );
            if (allUnavailable) {
                const msg = `❌ 当前无可预约场地（${targetDate} ${targetTimes.join('、')}），等待刷新...`;
                console.log('[📭] 无可预约场地，推送一次提醒');
                sendWebhook(msg);
                hasNotifiedNoAvailable = true;
            }
        }

        if (bookedCount >= maxBooking) {
            console.log(`[🎉] 已预约完 ${bookedCount} 个时间段，准备自动提交`);
            if (enableAutoSubmit) {
                setTimeout(submitBookingIfReady, 1000);
            }
        }
    }

    function submitBookingIfReady() {
        const buttons = document.querySelectorAll('button');
        for (let btn of buttons) {
            const text = btn.innerText.trim();
            if (text === '预约' && !btn.disabled) {
                console.log('[🟢] 自动点击提交预约按钮');
                simulateClick(btn);
                if (enableAutoConfirm) {
                    setTimeout(autoConfirmPopup, 1200);
                }
                return;
            }
        }
        console.warn('[⚠️] 未找到预约按钮或按钮已禁用');
    }

    function autoConfirmPopup() {
        const confirmButtons = document.querySelectorAll('button');
        for (let btn of confirmButtons) {
            const text = btn.innerText.trim();
            if (['确认预约', '确定', '提交'].includes(text) && !btn.disabled) {
                console.log('[📦] 自动点击弹窗确认按钮');
                simulateClick(btn);
                return;
            }
        }
        console.warn('[⚠️] 没有发现确认弹窗按钮');
    }

    // ======== 主循环定时器 ========
    const main = setInterval(() => {
        const dateReady = document.querySelectorAll('.date-item .date-number').length > 0;
        const tableReady = document.querySelector('.time-slot-table');

        if (dateReady && tableReady) {
            if (!hasClickedDate) {
                clickTargetDate();
            } else {
                tryBookingOnce();
            }
        } else {
            console.log('[⏳] 页面加载中...');
        }

        if (bookedCount >= maxBooking) {
            clearInterval(main);
        }
    }, 500);

    // ======== 自动刷新页面逻辑 ========
    if (enableAutoRefresh) {
        setTimeout(() => {
            if (bookedCount < maxBooking) {
                const msg = `[🔄] ${refreshInterval / 1000}s 内未抢满 ${maxBooking} 个时间段，刷新页面重试...`;
                console.log(msg);
                sendWebhook(msg);
                hasNotifiedNoAvailable = false; // 重置推送状态
                location.reload();
            }
        }, refreshInterval);
    }

    // ======== 请求桌面通知权限 ========
    if (Notification && Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
})();
