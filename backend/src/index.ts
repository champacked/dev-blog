import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { Hono } from "hono";
import { userRouter } from "./routes/user";

import { blogRouter } from "./routes/blog";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("api/v1/user", userRouter);
app.route("api/v1/blog", blogRouter);

export default app;
