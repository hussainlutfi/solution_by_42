// Import the SQLite module from Bun.js
import { Database } from "bun:sqlite";

// Initialize the SQLite database (this creates or opens the .sqlite file)
export function startDB() {
  const db = new Database("./database.sqlite");

  // Create tables
  db.run(`
    DROP TABLE IF EXISTS StampLicenseLetter;
    DROP TABLE IF EXISTS AddNewActivity;
    DROP TABLE IF EXISTS ErrorLog;
    DROP TABLE IF EXISTS InspectionRequest;
    DROP TABLE IF EXISTS AccountRequest;
    DROP TABLE IF EXISTS NewLicense;
    DROP TABLE IF EXISTS Request;
    DROP TABLE IF EXISTS TimeExecution;
    DROP VIEW IF EXISTS TableCounts;
    CREATE TABLE Request (
      RequestID INTEGER PRIMARY KEY,
      RequestType INTEGER CHECK(RequestType BETWEEN 1 AND 5),
      RequestStatus INTEGER CHECK(RequestStatus BETWEEN 1 AND 3)
    );
    CREATE TABLE NewLicense (
      RequestID INTEGER PRIMARY KEY REFERENCES Request(RequestID),
      CompanyName TEXT,
      LicenceType TEXT,
      IsOffice BOOLEAN,
      OfficeName TEXT,
      OfficeServiceNumber TEXT,
      RequestDate TEXT,
      Activities TEXT
    );
    CREATE TABLE AccountRequest (
      RequestID INTEGER PRIMARY KEY REFERENCES Request(RequestID),
      CompanyName TEXT,
      RequesterName TEXT,
      ApplicantName TEXT,
      UserName TEXT,
      ContactEmail TEXT,
      Permissions TEXT
    );
    CREATE TABLE InspectionRequest (
      RequestID INTEGER PRIMARY KEY REFERENCES Request(RequestID),
      CompanyName TEXT,
      InspectionDate TEXT,
      InspectionTime TEXT,
      InspectionType TEXT
    );
    CREATE TABLE AddNewActivity (
      RequestID INTEGER PRIMARY KEY REFERENCES Request(RequestID),
      CompanyName TEXT,
      LicenceID TEXT,
      Activities TEXT
    );
    CREATE TABLE StampLicenseLetter (
      RequestID INTEGER PRIMARY KEY REFERENCES Request(RequestID),
      CompanyName TEXT,
      LicenceID TEXT,
      RequestDate TEXT
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
    SELECT 'NewLicense' AS TableName, COUNT(*) AS RowCount FROM NewLicense
    UNION ALL
    SELECT 'AccountRequest' AS TableName, COUNT(*) AS RowCount FROM AccountRequest
    UNION ALL
    SELECT 'InspectionRequest' AS TableName, COUNT(*) AS RowCount FROM InspectionRequest
    UNION ALL
    SELECT 'AddNewActivity' AS TableName, COUNT(*) AS RowCount FROM AddNewActivity
    UNION ALL
    SELECT 'StampLicenseLetter' AS TableName, COUNT(*) AS RowCount FROM StampLicenseLetter;
  `);
  // Don't forget to close the database connection when you're done
  db.close();
}
startDB();
