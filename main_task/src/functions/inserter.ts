// inserter.ts
import { Database } from "bun:sqlite";
import {
  INewLicenseSchema,
  IAccountRequestSchema,
  IInspectionRequestSchema,
  IAddNewActivitySchema,
  IStampLicenseLetterSchema,
} from "../../types/zodSchemas";
import type { RequestData } from "../../types/data";
import type { ErrorCallback } from "typescript";

export default function inserter(data: RequestData) {
  const db = new Database("./database.sqlite");

  try {
    const requestID: number = parseInt(data.RequestID);
    const requestType: number = parseInt(data.RequestType);
    const requestStatus: number = parseInt(data.RequestStatus);
    if (!Number.isNaN(requestID)) {
      const validatedData = validateJson(
        requestID,
        requestType,
        data.RequestData
      );

      db.run(
        "INSERT INTO Request (RequestID, RequestType, RequestStatus, RequestData) VALUES (?, ?, ?, ?)",
        [requestID, requestType, requestStatus, JSON.stringify(validatedData)]
      );
    }
  } catch (error) {
    throw new Error("Error during insertion");
    // console.error("Error during insertion:", error);
  } finally {
    db.close();
  }
}

function validateJson(id: number, requestType: number, requestData: string) {
  try {
    switch (requestType) {
      case 1:
        return INewLicenseSchema.parse(JSON.parse(requestData));
      case 2:
        return IAccountRequestSchema.parse(JSON.parse(requestData));
      case 3:
        return IInspectionRequestSchema.parse(JSON.parse(requestData));
      case 4:
        return IAddNewActivitySchema.parse(JSON.parse(requestData));
      case 5:
        return IStampLicenseLetterSchema.parse(JSON.parse(requestData));
      default:
        throw new Error("Unsupported request type");
    }
  } catch (error) {
    // throw Error();
    logErrorToDatabase(requestData);
    throw error; // Continue to throw the error after logging it
  }
}
function logErrorToDatabase(requestData: string) {
  const db = new Database("./database.sqlite");
  try {
    db.run("INSERT INTO ErrorLog (RequestData) VALUES (?)", [requestData]);
  } catch (dbError) {
    throw new Error("Failed to log error to database");
    // console.error("Failed to log error to database:", dbError);
  } finally {
    db.close();
  }
}
