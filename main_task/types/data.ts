import { z } from "zod";

export interface RequestData {
  RequestID: string;
  RequestType: string;
  RequestStatus: string;
  RequestData: string; // This is a JSON string
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
