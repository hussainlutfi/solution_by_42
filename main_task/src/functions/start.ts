// Import the SQLite module from Bun.js
import { Database } from "bun:sqlite";

// Initialize the SQLite database (this creates or opens the .sqlite file)
export function startDB() {
  const db = new Database("./database.sqlite");

  // Create tables and view
  db.run(`
    DROP TABLE IF EXISTS Request;
    DROP TABLE IF EXISTS TimeExecution;
    DROP TABLE IF EXISTS ErrorLog;
    DROP VIEW IF EXISTS TableCounts;
    CREATE TABLE Request (
      RequestID INTEGER PRIMARY KEY,
      RequestType INTEGER CHECK(RequestType BETWEEN 1 AND 5),
      RequestStatus INTEGER CHECK(RequestStatus BETWEEN 1 AND 3),
      RequestData TEXT
    );
    CREATE TABLE TimeExecution (
      TimeExecuted INTEGER
    );
    CREATE TABLE ErrorLog (
      RequestData TEXT
    );
    CREATE VIEW TableCounts AS
    SELECT 'Request' AS TableName, COUNT(*) AS RowCount FROM Request
    UNION ALL
    SELECT 'NewLicense' AS TableName, COUNT(*) AS RowCount FROM Request WHERE RequestType = 1
    UNION ALL
    SELECT 'AccountRequest' AS TableName, COUNT(*) AS RowCount FROM Request WHERE RequestType = 2
    UNION ALL
    SELECT 'InspectionRequest' AS TableName, COUNT(*) AS RowCount FROM Request WHERE RequestType = 3
    UNION ALL
    SELECT 'AddNewActivity' AS TableName, COUNT(*) AS RowCount FROM Request WHERE RequestType = 4
    UNION ALL
    SELECT 'StampLicenseLetter' AS TableName, COUNT(*) AS RowCount FROM Request WHERE RequestType = 5;    
  `);

  // Don't forget to close the database connection when you're done
  db.close();
}

startDB();
