import express from "express";

const app: express.Application = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
