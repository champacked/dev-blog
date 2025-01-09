import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { Context } from "hono";

export const siginHandler = (c: Context) => {
  const env = c.env;
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate());
};
