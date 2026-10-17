import express from "express";
import cors from "cors";
import { PORT } from "./config/env.js";
import indexRoutes from "./routes/indexRoutes.js"
import requestIp from "request-ip"
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
const app=express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestIp.mw());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname,"public")))
app.use("/api", indexRoutes);
app.listen(PORT,()=>{
    console.log(`Server listening at PORT http://localhost:${PORT}`)
})