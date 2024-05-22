import express from "express";
import { add } from "@repo/common/config";
console.log(add(1, 2));

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "hello world",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
