import "dotenv/config";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./index";
migrate(db, { migrationsFolder: "./migrations" });
