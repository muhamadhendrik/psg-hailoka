import app from "./server";

import https from "https";
import fs from "fs";
import path from "path";

// const PORT = process.env.PORT || 3000;
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// 👇 This line is important
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
// });


// SSL options
// const sslOptions = {
//   key: fs.readFileSync(path.join(__dirname, "../certs/key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "../certs/cert.pem")),
// };

// // Start HTTPS server
// https.createServer(sslOptions, app).listen(PORT, "0.0.0.0", () => {
//   console.log("✅ HTTPS server running on https://localhost:5000");
// });