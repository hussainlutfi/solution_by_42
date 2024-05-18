import type { RequestData } from "../../types/data";
import inserter from "./inserter";

import parse from "csv-simple-parser";
import { startDB } from "./start";
import { Database } from "bun:sqlite";

export default async function ImportCSV(req: Request): Promise<Response> {
  try {
    const start: number = performance.now();
    startDB();
    const formData = await req.formData();
    const csvBlob = formData.get("csvFile");
    if (!(csvBlob instanceof Blob)) {
      return new Response(
        JSON.stringify({ error: "No CSV file uploaded or invalid file type." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const text = await csvBlob.text();
    const parsedData = parse(text, { header: true });
    if (
      !Array.isArray(parsedData) ||
      parsedData.some((item) => typeof item !== "object")
    ) {
      throw new Error("Parsed data format is not as expected");
    }

    const data: RequestData[] = parsedData as unknown as RequestData[];
    const errors: any[] = [];

    data.forEach((data: RequestData) => {
      try {
        inserter(data);
      } catch (error) {
        errors.push({ requestData: data, error: error });
      }
    });

    const end: number = performance.now();
    insertTime((end - start) / 1000);
    if (errors.length > 0) {
      return new Response(
        JSON.stringify({
          message: "File processed with errors.",
          errors: errors,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ message: "File processed successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function insertTime(time: number) {
  const db = new Database("./database.sqlite");
  db.run("INSERT INTO TimeExecution (TimeExecuted) VALUES (?)", [time]);
  db.close();
}
