import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { Context } from "hono";

export const signupHandler = async (c: Context) => {
  const env = c.env;
  const prisma = new PrismaClient({
    //@ts-ignore
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

  //@ts-ignore
  const token = await sign({ id: user.id }, env.JWT_SECRET_KEY);
  return c.json({ jwt: token });
};

export const test = (c: Context) => {
  return c.json({ message: "hello this is for the testing purpose" });
};
