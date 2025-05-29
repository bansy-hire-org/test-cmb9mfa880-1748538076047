const { parseLogLine } = require('../../src/utils/logParser');

describe('parseLogLine', () => {
    it('should parse a valid log line', () => {
        const logLine = '2024-01-01 10:00:00 - INFO: Test log message';
        const parsedLog = parseLogLine(logLine);

        expect(parsedLog).toEqual({
            timestamp: '2024-01-01 10:00:00',
            severity: 'INFO',
            message: 'Test log message',
            source: 'System'
        });
    });

    it('should handle ERROR log lines', () => {
        const logLine = '2024-01-01 10:00:00 - ERROR: An error occurred';
        const parsedLog = parseLogLine(logLine);

        expect(parsedLog.severity).toBe('ERROR');
        expect(parsedLog.message).toBe('An error occurred');
    });

    it('should handle WARN log lines', () => {
        const logLine = '2024-01-01 10:00:00 - WARN: A warning occurred';
        const parsedLog = parseLogLine(logLine);

        expect(parsedLog.severity).toBe('WARN');
        expect(parsedLog.message).toBe('A warning occurred');
    });

    it('should return null for invalid log lines', () => {
        const logLine = 'Invalid log line';
        const parsedLog = parseLogLine(logLine);

        expect(parsedLog).toBeNull();
    });
});