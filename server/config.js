exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/curator-rater'
exports.DATABASE_URL_TEST = process.env.DATABASE_URL_TEST ||
                       global.DATABASE_URL_TEST ||
                      'mongodb://localhost/curator-rater-test'
exports.PORT = process.env.PORT || 8080
exports.JWT_SECRET = process.env.JWT_SECRET
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d'
