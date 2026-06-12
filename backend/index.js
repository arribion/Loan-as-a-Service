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
  res.send("<h1>backend running successfully...</h1>");
});

// routes
import authRouter from "./src/routes/auth.route.js";

app.use("/api/v1/auth", authRouter);


app.listen(PORT, host, () => {
  console.log("app running successfully...");
  console.log(`Server available at: ${serverUrl}`);
});

export default app;