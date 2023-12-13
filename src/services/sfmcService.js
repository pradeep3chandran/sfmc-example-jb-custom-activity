
class sfmcService {
    constructor() {
    }

    async getToken(configData) {
        try {
            let accessRequest = {
                "grant_type": "client_credentials",
                "client_id": configData.Client_ID,
                "client_secret": configData.Client_Secret,
                "account_id": configData.MID
            };

            const result = await fetch(configData.Auth_URI + '/v2/token', {
                method: 'POST', body: JSON.stringify(accessRequest), headers: { 'Content-Type': 'application/json' }
            });
            console.log('result: ', result);
            return { success: true, body: result };
        } catch (err) {
            return { success: false, error: err };
        }
    }

    async updateReportData(configData, token, reqBody, dataExtKey) {
        try {

            const result = await fetch(configData.Rest_URI + '/hub/v1/dataevents/key:' + dataExtKey + '/rowset', {
                method: 'POST', body: JSON.stringify(reqBody), headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
            });
            return { success: true, body: result };
        } catch (err) {
            return { success: false, error: err };
        }
    }
}

module.exports = sfmcService;