import express, { json } from "express";
import cors from "cors";
import authRouter from "./routers/auth";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.json({
    message: "hello world",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
