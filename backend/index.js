import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// file paths
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// middlewares
app.use(bodyParser.json());
app.use(express.json());
// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
// allowed origins
app.use(cors());

const PORT = process.env.PORT || 5000;
if(!PORT) {
  throw new Error("PORT environment variable is not defined");
}

const host = "localhost"; 
const serverUrl = `http://${host}:${PORT}`;

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
import userRoute from "./src/routes/user.Route.js";
import product_Router from "./src/routes/product.Route.js";
import packageTier_Router from "./src/routes/package.Route.js";
// route middlewares
app.use("/api/v1/tenant/auth", authTenantRouter);
app.use("/api/v1/package-tiers", packageTier_Router);
app.use("/api/v1/users", userRoute);
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