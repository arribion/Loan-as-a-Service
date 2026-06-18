import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

// middlewares
app.use(bodyParser.json());
app.use(express.json());
// allowed origins
app.use(cors());

const PORT = process.env.PORT || 5000;
if(!PORT) {
  throw new Error("PORT environment variable is not defined");
}

const host = "localhost"; 
const serverUrl = `http://${host}:${PORT}`;

app.get("/", (req, res) => {
  res.send(
    "<h1 style='color: green;'>backend running successfully...</h1>"
  );
});

// routes
import authTenantRouter from "./src/routes/auth.Tenant.Route.js";
import packageTier_Router from "./src/routes/package.Route.js";
import userRoute from "./src/routes/user.Route.js";
import productRouter from "./src/routes/product.Route.js";
import packageTier_Router from "./src/routes/package.Route.js";
// route middlewares
app.use("/api/v1/tenant/auth", authTenantRouter);
app.use("/api/v1/package-tiers", packageTier_Router);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/products", productRouter);
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