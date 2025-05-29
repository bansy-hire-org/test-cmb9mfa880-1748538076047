## Log Analysis Dashboard

### Overview

This project provides a simple web dashboard for analyzing server log data. It ingests log files, parses entries, and presents aggregated statistics and visualizations. The dashboard allows users to filter logs based on severity, timestamp, and source.

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd log-analysis-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Database setup:**
    The application uses SQLite. Ensure SQLite is installed on your system. The database file (`logs.db`) will be created automatically when the application runs.

4.  **Configuration:**
    The application uses environment variables for configuration. You can create a `.env` file in the root directory (see `.env.example` for the required variables).
    ```
    PORT=3000
    DATABASE_PATH=./logs.db
    LOG_DIRECTORY=./logs
    ```

5.  **Start the application:**
    ```bash
    npm start
    ```

6.  **Access the dashboard:**
    Open your browser and navigate to `http://localhost:3000` (or the port specified in your `.env` file).

### Running Tests

```bash
npm test
```

### Task Descriptions

1.  **Log Ingestion:** Implement the log ingestion process. The application should read log files from the `logs` directory (specified in the configuration) and parse them into structured data.  The dashboard UI provides a button to trigger a new load of the logs. 
2.  **Data Aggregation:** Aggregate the parsed log data to calculate statistics such as the number of log entries per severity level and the distribution of log entries over time. These should show in the appropriate section on the page (Severity count, and logs over time chart).
3.  **Dashboard UI:** Develop the dashboard UI using React.  The UI should display the aggregated statistics, a chart showing log entries over time, and a table of the latest log entries.
4.  **Filtering:** Implement filtering functionality to allow users to filter log entries based on severity, timestamp, and source.

### Expected Deliverables

-   A fully functional log analysis dashboard.
-   Clear and well-structured code.
-   Adequate test coverage.
-   Documentation for setup and usage.

### Success Criteria

-   The application can successfully ingest and parse log files.
-   The dashboard displays accurate and up-to-date statistics.
-   The filtering functionality works as expected.
-   The application is performant and scalable.
