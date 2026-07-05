import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import tenantResolver from "./src/middlewares/tenant.Resolver.js";

const app = express();

// file paths
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// middlewares
app.use(bodyParser.json());
app.use(express.json());
// app.use(tenantResolver)
// allowed origins
app.use(cors());
// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;
if(!PORT) {
  throw new Error("PORT environment variable is not defined");
}

const host = "localhost"; 
const serverUrl = `http://${host}:${PORT}`;

app.use(express.text({ type: "application/json" }));

app.use((req, res, next) => {
  if (typeof req.body === "string") {
    try {
      let parsed = req.body;
      // Loop handles multiple layers of stringification if they exist
      while (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }
      req.body = parsed;
    } catch (err) {
      return res.status(400).json({ error: "Malformed JSON payload" });
    }
  }
  next();
});

app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "host pro limited laas backend",
    username: "Host Pro Limited",
  });
  //   || res.send(
  //   "<h1 style='color: green;'>backend running successfully...</h1>"
  // );
});

// routes
import authTenantRouter from "./src/routes/auth.Tenant.Route.js";
import memberRoute from "./src/routes/member.Route.js";
import product_Router from "./src/routes/product.Route.js";
import packageTier_Router from "./src/routes/package.Route.js";

/**params
 
*/

// route middlewares
app.use("/api/v1/tenant/auth", authTenantRouter);
app.use("/api/v1/package-tiers", packageTier_Router);
app.use("/api/v1/users", memberRoute);
app.use("/api/v1/products", product_Router);
app.use("/api/v1/package", packageTier_Router);

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// start the server
app.listen(PORT, host, () => {
  console.log("app running successfully...");
  console.log(`Server available at: ${serverUrl}`);
});

export default app;