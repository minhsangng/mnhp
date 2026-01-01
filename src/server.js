import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { childrens, classes } from "./db/schema.js";
import {
  eq,
  ne,
  sql,
  and,
  ilike,
  desc,
  asc,
  between,
  inArray,
  notInArray,
} from "drizzle-orm";
import job from "./config/cron.js";
import cors from "cors";

/* SET UP */
const app = express();
const PORT = ENV.PORT || 5001;

if (ENV.NODE_ENV === "production") {
  job.start();
}

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/* API */
app.get("/api/childrens", async (req, res) => {
  try {
    const results = await db
      .select({
        ...childrens, class_name: classes.class_name
      })
      .from(childrens)
      .innerJoin(classes, eq(childrens.class_id, classes.id))
      .where(eq(childrens.status, "Đang học"))
      .orderBy(asc(childrens.id));

    const groupedResults = {};

    results.forEach((child) => {
      const classId = child.class_id;
      if (!groupedResults[classId]) {
        groupedResults[classId] = {
          class_id: classId,
          class_name: child.class_name,
          childrens: [],
        };
      }
      groupedResults[classId].childrens.push(child);
    });

    const groupedArray = Object.values(groupedResults);

    res.json({ success: true, data: groupedArray });
  } catch (error) {
    console.log("Error fetching childrens:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

/* MESSAGE RUNNING */
app.listen(5001, () => {
  console.log("Server is running on PORT:", PORT);
});
