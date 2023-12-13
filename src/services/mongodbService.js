const MCData = require('../models/mongodbmodel');

class mongodbService {
    constructor() {
    }
    async getData(mid) {
        try {
            const result = await MCData.findOne({ MID: mid }).exec();
            console.log(result ? 'yes' : 'no');
            return { success: true, body: result };
        } catch (err) {
            return { success: false, error: err };
        }
    }

    async updateData(data) {
        try {
            const fildResult = await MCData.findOne({ MID: data.MID }).exec();
            if (fildResult) {
                await MCData.updateOne({ MID: data.MID }, data);
            } else {
                const newData = new MCData(data);
                newData.save();
            }
            return { success: true };
        } catch (err) {
            return { success: false, error: err };
        }
    }
}

module.exports = mongodbService;