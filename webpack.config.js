const discountCodeExample = require('./modules/sms-activity/webpack.config');

module.exports = function (env, argv) {
    return [
        discountCodeExample(env, argv)
    ];
};
