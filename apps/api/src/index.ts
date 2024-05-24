import express, { json } from "express";
import cors from "cors";
import adminRouter from "./routers/admin";
import userRouter from "./routers/user";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/v1/admin", adminRouter);
app.use("/v1/user", userRouter);

app.get("/", (req, res) => {
  res.json({
    message: "hello world",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
