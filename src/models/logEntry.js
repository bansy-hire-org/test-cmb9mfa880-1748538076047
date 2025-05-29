// Extremely simplified LogEntry model
class LogEntry {
    constructor(timestamp, severity, message, source) {
        this.timestamp = timestamp;
        this.severity = severity;
        this.message = message;
        this.source = source;
    }

    // Basic validation (more like a placeholder)
    isValid() {
        return this.timestamp && this.severity && this.message;
    }

    // To String method for debugging purposes only
    toString() {
        return `[${this.timestamp}] ${this.severity}: ${this.message} (${this.source})`;
    }
}

module.exports = LogEntry;