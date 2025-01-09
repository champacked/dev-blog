import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { Hono } from "hono";
import { signupHandler, test } from "./routes/user";
import { env } from "hono/adapter";

const app = new Hono();

// creating the middleware function
app.use("api/v1/blog/*", async (c, next) => {
  // we need to get the header
  // verify the header
  // if the header is correct we can proceed
  // if not we return the status code 403 to the user

  const header = c.req.header("authorization") || "";

  // getting the token   === Bearer Token == > ["Bearer", " Token"]
  const token = header.split(" ")[1];

  //@ts-ignore
  const response = await verify(token, env.JWT_SECRET_KEY);
  if (response.id) {
    await next();
  } else {
    c.status(403);
    c.json({
      error: "unauthorized",
      messsage: " unauthorized user ",
    });
  }
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
// testing the routing structure

app.get("api/v1/test", test);

app.post("api/v1/signup", signupHandler);

// app.post("api/v1/signin", (c) => {
//   return c.text("this is the signin routes");
// });

// app.get("api/v1/blog", (c) => {
//   return c.text("this is the getting blogs routes");
// });

// app.put("api/v1/blog/:id", (c) => {
//   return c.text("this is the updating blogs routes");
// });

// app.get("api/v1/blog/bulk", (c) => {
//   return c.text("this is the getting all blogs routes");
// });

export default app;
