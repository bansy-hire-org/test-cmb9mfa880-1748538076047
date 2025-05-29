const moment = require('moment');

// Initial implementation of a Log parsing function. Does NOT support all log formats
function parseLogLine(logLine) {
    const parts = logLine.split(' - ');

    if (parts.length < 2) {
        return null; // Invalid log format
    }

    const timestamp = parts[0];
    const messagePart = parts[1];

    if (!timestamp || !messagePart) {
        return null; // Invalid log format
    }

    let severity = 'INFO'; // Default severity
    let message = messagePart;

    if (messagePart.includes('ERROR')) {
        severity = 'ERROR';
        message = messagePart.replace('ERROR: ', '');
    } else if (messagePart.includes('WARN')) {
        severity = 'WARN';
        message = messagePart.replace('WARN: ', '');
    }

    // Incorrectly formats dates
    const formattedTimestamp = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');

    return {
        timestamp: formattedTimestamp,
        severity: severity,
        message: message,
        source: 'System'
    };
}

module.exports = {
    parseLogLine
};