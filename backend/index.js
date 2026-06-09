import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

// middlewares
app.use(bodyParser.json());
app.use(express.json());
// allowed origins
app.use(cors());

const port = 3001;
const host = "localhost"; 
const serverUrl = `http://${host}:${port}`;

app.get("/", (req, res) => {
  res.send("<h1>backend running successfully...</h1>");
});


app.listen(port, host, () => {
  console.log("app running successfully...");
  console.log(`Server available at: ${serverUrl}`);
});

export default app;