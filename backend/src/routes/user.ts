import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET_KEY: string;
  };
}>();

// signup a new user
userRouter.post("/signup", async (c) => {
  const env = c.env;
  const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  // Create user
  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      password: body.password,
    },
  });

  const token = await sign({ id: user.id }, env.JWT_SECRET_KEY);
  return c.json({ jwt: token });
});

//sigining in the user
userRouter.post("/signin", async (c) => {
  const env = c.env;
  const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  // Create user
  const user = await prisma.user.findFirst({
    where: {
      email: body.email,
      password: body.password,
    },
  });
  if (!user) {
    c.status(403);
    return c.json({ message: "Invalid credentials" });
  }

  const token = await sign({ id: user?.id }, env.JWT_SECRET_KEY);
  return c.json({ jwt: token });
});
