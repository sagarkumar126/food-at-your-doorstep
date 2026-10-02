import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import path from "path";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";
import notificationRouter from "./routes/notificationRoute.js";

const app = express();

const port = 4000;

app.use(express.json());
app.use(cors());

connectDB();

app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static("uploads/images"));
app.use("/images", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);
app.use("/api/notification", notificationRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server is runnining on ${port}`);
});





