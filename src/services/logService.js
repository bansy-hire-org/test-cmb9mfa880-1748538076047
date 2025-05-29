const fs = require('fs');
const { parseLogLine } = require('../utils/logParser');


// Reads and parses logs from a file or directory
async function processLogs(logDirectory) {
    try {
        const files = await fs.promises.readdir(logDirectory);
        let allLogs = [];

        for (const file of files) {
            const filePath = `${logDirectory}/${file}`;
            const fileContent = await fs.promises.readFile(filePath, 'utf-8');
            const lines = fileContent.split('\n');

            const logs = lines.map(line => {
                if (line) {
                    return parseLogLine(line);
                }
                return null;
            }).filter(log => log !== null);

            allLogs = allLogs.concat(logs);
        }

        return allLogs;

    } catch (error) {
        console.error('Error processing logs:', error);
        throw error;
    }
}

module.exports = {
    processLogs
};