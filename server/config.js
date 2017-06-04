exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/curator-rator'
exports.DATABASE_URL_TEST = process.env.DATABASE_URL_TEST ||
                       global.DATABASE_URL_TEST ||
                      'mongodb://localhost/curator-rator_test'
exports.PORT = process.env.PORT || 3000
