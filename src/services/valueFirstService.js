const axios = require('axios');

class valueFirstService {
    constructor() {
    }
    async getTemplates(configData) {

        try {
            const result = await axios({
                url: 'https://whatsapp.myvfirst.com/waba/template/fetch?userid=' + configData.WhatsApp_Username + '&pageno=1&pagelimit=200&status=Approved',
                method: 'GET',
                headers: {
                    "Authorization": 'Basic ' + Buffer.from(configData.WhatsApp_Username + ':' + configData.WhatsApp_Password).toString('base64')
                }
            });
            return { success: true, body: result };
        } catch (err) {
            return { success: false, error: err };
        }
    }

    async getToken(configData) {
        try {
            const result = await axios({
                url: 'https://api.myvfirst.com/psms/api/messages/token?action=generate',
                method: 'POST',
                headers: {
                    "Authorization": 'Basic ' + Buffer.from(configData.WhatsApp_Username + ':' + configData.WhatsApp_Password).toString('base64')
                }
            });
            return { success: true, body: result };
        } catch (err) {
            return { success: false, error: err };
        }
    }

    async sendMessage(token, jsonStr) {
        try {
            const result = await axios({
                url: 'https://api.myvfirst.com/psms/servlet/psms.JsonEservice',
                method: 'POST',
                headers: { "Authorization": 'Bearer ' + token, "Content-Type": 'application/json' },
                data: JSON.stringify(jsonStr)
            })
            return { success: true, body: result };
        } catch (err) {
            return { success: false, error: err };
        }
    }
}

module.exports = valueFirstService;