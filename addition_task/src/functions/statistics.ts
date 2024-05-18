import { Database } from "bun:sqlite";
import type {
  IErrorLog,
  IStatistics,
  ITableCounts,
  ITimeExecution,
} from "../../types/data";

export function getAllData(): IStatistics | null {
  try {
    const db = new Database("./database.sqlite");
    const count = db
      .query("SELECT * FROM TableCounts;")
      .all() as ITableCounts[];
    const time = db
      .query("SELECT * FROM TimeExecution;")
      .all()[0] as ITimeExecution;

    const errors = db.query("SELECT * FROM ErrorLog").all() as IErrorLog[];

    const statistics: IStatistics = {
      TableCounts: count,
      TimeExecutions: time,
      ErrorLogs: errors,
    };

    return statistics;
  } catch (error) {
    console.error("Error occurred:", error);
    return null; // Explicitly return null if there's an error
  }
}
