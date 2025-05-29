// Configuration file (with intentional misconfigurations)
module.exports = {
    database: {
        path: process.env.DATABASE_PATH || './logs.db', // Uses default, which might not be what is expected
    },
    logDirectory: process.env.LOG_DIRECTORY || 'logs', // Intentionally incorrect.
    server: {
        port: process.env.PORT || 8080, //Different default port number. Not configurable
    },
};