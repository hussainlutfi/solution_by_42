export interface RequestData {
  RequestID: string;
  RequestType: string;
  RequestStatus: string;
  RequestData: string; // This is a JSON string
}

export interface INewLicense {
  CompanyName: string;
  LicenceType: string;
  IsOffice: boolean;
  OfficeName: string;
  OfficeServiceNumber: string;
  RequestDate: string;
  Activities: string;
}

export interface IAccountRequest {
  CompanyName: string;
  RequesterName: string;
  ApplicantName: string;
  UserName: string;
  ContactEmail: string;
  Permissions: string[];
}

export interface IInspectionRequest {
  CompanyName: string;
  InspectionDate: string;
  InspectionTime: string;
  InspectionType: string;
}

export interface IAddNewActivity {
  CompanyName: string;
  LicenceID: string;
  Activities: string[];
}

export interface IStampLicenseLetter {
  CompanyName: string;
  LicenceID: string;
  RequestDate: string;
}

export interface ITableCounts {
  TableName: string;
  RowCount: number;
}
export interface ITimeExecution {
  TimeExecuted: number;
}
export interface IErrorLog {
  RequestData: string;
}

export interface IStatistics {
  TableCounts: ITableCounts[];
  TimeExecutions: ITimeExecution;
  ErrorLogs: IErrorLog[];
}