import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import tenantResolver from "./src/middlewares/tenant.Resolver.js";
// import payloadSafeguard from "./src/middlewares/payload.safeguard.js";
import rootErrorHandler from "./src/middlewares/rootErrorHandler.js";
import ping_onrender from "./src/util/ping.js";

const app = express();
ping_onrender() // health check

// file paths
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// middlewares
app.use(bodyParser.json());
app.use(express.json());
// app.use(tenantResolver)
// allowed origins
app.use(
  cors({
    origin: [
      "http://localhost:5172",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
  }),
);
// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// app.use(payloadSafeguard()); 

const PORT = process.env.PORT || 5000;
if(!PORT) {
  throw new Error("PORT environment variable is not defined");
}

const host = "0.0.0.0"; 
const serverUrl = `http://${host}:${PORT}`;

app.use(express.text({ type: "application/json" }));


app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "host pro limited laas backend",
    username: "Host Pro Limited",
  });
});

// routes
import authTenantRouter from "./src/routes/auth.Tenant.Route.js";
import memberRoute from "./src/routes/member.Route.js";
import product_Router from "./src/routes/product.Route.js";
import packageTier_Router from "./src/routes/package.Route.js";
import loanRouter from "./src/routes/loan.Route.js";

/**params
 
*/

// route middlewares
app.use("/api/v1/tenant/auth", authTenantRouter);

app.use("/api/v1/package-tiers", packageTier_Router);
app.use("/api/v1/users", memberRoute);
app.use("/api/v1/products", product_Router);
app.use("/api/v1/package", packageTier_Router);
app.use("/api/v1/loans", loanRouter);

rootErrorHandler(app);


app.listen(PORT, host, () => {
  console.log("app running successfully...");
  console.log(`Server available at: ${serverUrl}`);
});

export default app;