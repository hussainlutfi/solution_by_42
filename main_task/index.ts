import ImportCSV from "./src/functions/importer";

import { getAllData } from "./src/functions/statistics";

Bun.serve({
  port: 3000,
  fetch(req: Request): Response | Promise<Response> {
    const url = new URL(req.url);

    // Serve static files
    if (url.pathname === "/") {
      return new Response(Bun.file("./src/pages/index.html"));
    } else if (url.pathname === "/statistics") {
      return new Response(Bun.file("./src/pages/statistics.html"));
    } else if (
      url.pathname.endsWith(".css") ||
      url.pathname.endsWith(".ts") ||
      url.pathname.endsWith(".js")
    ) {
      return new Response(Bun.file(`./src/styles${url.pathname}`));
    }

    // Handle CSV file uploads functionality functionalities
    else if (url.pathname === "/upload-csv" && req.method === "POST") {
      return ImportCSV(req);
    } else if (url.pathname === "/api/data") {
      const data = getAllData();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    }
    // Handle 404 not found
    return new Response("Not Found", { status: 404 });
  },
});
console.log(`Server running on http://localhost:3000`);
