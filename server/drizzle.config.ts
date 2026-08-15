import { defineConfig } from "drizzle-kit";
import "dotenv/config";
import { DATABASE_URL } from "./src/config/env";
export default defineConfig({
  schema: "./src/model/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
}
);
console.log(DATABASE_URL);