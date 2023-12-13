module.exports = {
    apps: [
        {
            name: 'mc-app-prod',
            script: 'src/index.js',
            log_date_format: 'YYYY-MM-DD HH:mm Z',
            env_production: {
                NODE_ENV: 'production',
            },
            env_development: {
                NODE_ENV: 'development',
            },
            env_uat: {
                NODE_ENV: 'uat',
            },
        },
    ],
};