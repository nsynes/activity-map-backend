const env = process.env.NODE_ENV || "development";
module.exports = {
    API_Domain: env === 'production' ? 'https://activity-api.nicksynes.com' : 'http://localhost:3001',
    APP_Domain: env === 'production' ? 'https://activity-map.nicksynes.com' : 'http://localhost:3000'
}
