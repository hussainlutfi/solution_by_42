import type { RequestData } from "../../types/data";
import inserter from "./inserter";

import parse from "csv-simple-parser";
import { startDB } from "./start";
import { Database } from "bun:sqlite";

export default async function ImportCSV(req: Request): Promise<Response> {
  try {
    const start: number = performance.now();
    startDB(); // Initialize the database and prepare the environment

    const formData = await req.formData(); // Parse the form data from the request
    const csvBlob = formData.get("csvFile"); // Extract the CSV file from the form data

    if (!(csvBlob instanceof Blob)) {
      // Check if the uploaded file is a valid Blob instance
      return new Response(
        JSON.stringify({ error: "No CSV file uploaded or invalid file type." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const text = await csvBlob.text(); // Convert the Blob to text
    const parsedData = parse(text, { header: true }); // Parse the CSV text to JSON

    if (
      !Array.isArray(parsedData) ||
      parsedData.some((item) => typeof item !== "object")
    ) {
      // Validate the structure of the parsed data
      throw new Error("Parsed data format is not as expected");
    }

    const data: RequestData[] = parsedData as unknown as RequestData[];
    const errors: any[] = []; // Initialize an array to keep track of processing errors

    // Process each item in the data array
    data.forEach((dataItem: RequestData) => {
      try {
        inserter(dataItem); // Attempt to insert each data item using the inserter function
      } catch (error) {
        errors.push({ requestData: dataItem, error: error }); // Log any errors for each item
      }
    });

    const end: number = performance.now();
    insertTime((end - start) / 1000); // Log the time taken for processing

    // Check if there were any errors during processing
    if (errors.length > 0) {
      return new Response(
        JSON.stringify({
          message: "File processed with errors.",
          errors: errors,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // If no errors, confirm successful processing
    return new Response(
      JSON.stringify({ message: "File processed successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Handle any unexpected errors in the overall processing
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
