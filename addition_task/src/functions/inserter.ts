import type {
  IAccountRequest,
  IAddNewActivity,
  IInspectionRequest,
  INewLicense,
  IStampLicenseLetter,
  RequestData,
} from "../../types/data";
import {
  INewLicenseSchema,
  IAccountRequestSchema,
  IInspectionRequestSchema,
  IAddNewActivitySchema,
  IStampLicenseLetterSchema,
} from "../../types/zodSchemas";
import { Database } from "bun:sqlite";
import { startDB } from "./start";

export default function inserter(data: RequestData) {
  const db = new Database("./database.sqlite");

  const requestID: number = parseInt(data.RequestID);
  const requestType: number = parseInt(data.RequestType);
  const requestStatus: number = parseInt(data.RequestStatus);
  try {
    if (requestType !== null && data.RequestData !== undefined) {
      db.run(
        "INSERT INTO Request (RequestID, RequestType, RequestStatus) VALUES (?, ?, ?)",
        [requestID, requestType, requestStatus]
      );

      validateJson(requestType, data.RequestData);

      if (requestType == 1) {
        insertNewLicense(db, requestID, JSON.parse(data.RequestData));
      } else if (requestType == 2) {
        insertAccountRequest(db, requestID, JSON.parse(data.RequestData));
      } else if (requestType == 3) {
        insertInspectionRequest(db, requestID, JSON.parse(data.RequestData));
      } else if (requestType == 4) {
        insertAddNewActivity(db, requestID, JSON.parse(data.RequestData));
      } else {
        insertStampLicenseLetter(db, requestID, JSON.parse(data.RequestData));
      }
    }
    db.close();
  } catch (error) {
    throw new Error("Error parsing JSON from RequestData");
    // console.log(data.RequestData);

    // console.error("Error parsing JSON from RequestData:", error);
  }
}

function insertNewLicense(db: Database, id: number, data: INewLicense) {
  db.run(
    "INSERT INTO NewLicense (RequestID, CompanyName, LicenceType, IsOffice, OfficeName, OfficeServiceNumber, RequestDate, Activities) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      data.CompanyName,
      data.LicenceType,
      data.IsOffice,
      data.OfficeName,
      data.OfficeServiceNumber,
      data.RequestDate,
      data.Activities,
    ]
  );
  db.close();
}

function insertAccountRequest(db: Database, id: number, data: IAccountRequest) {
  db.run(
    "INSERT INTO AccountRequest (RequestID, CompanyName, RequesterName, ApplicantName, UserName, ContactEmail, Permissions) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      data.CompanyName,
      data.RequesterName,
      data.ApplicantName,
      data.UserName,
      data.ContactEmail,
      data.Permissions.toString(),
    ]
  );
  db.close();
}

function insertInspectionRequest(
  db: Database,
  id: number,
  data: IInspectionRequest
) {
  db.run(
    "INSERT INTO InspectionRequest (RequestID, CompanyName, InspectionDate, InspectionTime, InspectionType) VALUES (?, ?, ?, ?, ?)",
    [
      id,
      data.CompanyName,
      data.InspectionDate,
      data.InspectionTime,
      data.InspectionType,
    ]
  );
  db.close();
}

function insertAddNewActivity(db: Database, id: number, data: IAddNewActivity) {
  db.run(
    "INSERT INTO AddNewActivity (RequestID, CompanyName, LicenceID, Activities) VALUES (?, ?, ?, ?)",
    [id, data.CompanyName, data.LicenceID, data.Activities.toString()]
  );
  db.close();
}

function insertStampLicenseLetter(
  db: Database,
  id: number,
  data: IStampLicenseLetter
) {
  db.run(
    "INSERT INTO StampLicenseLetter (RequestID, CompanyName, LicenceID, RequestDate) VALUES (?, ?, ?, ?)",
    [id, data.CompanyName, data.LicenceID, data.RequestDate]
  );
  db.close();
}

function validateJson(requestType: number, requestData: string) {
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
    throw new Error(
      `Validation failed for request type ${requestType}: ${error}`
    );
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
