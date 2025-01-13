import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { Hono } from "hono";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET_KEY: string;
  };
  Variables: {
    userId: string;
  };
}>();
//creating a middleware
blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
  const user = await verify(authHeader, c.env.JWT_SECRET_KEY);

  if (user) {
    c.set("userId", user.id as string);
    await next();
  } else {
    c.status(401);
    c.json({
      message: "You are not loogged in",
    });
  }
});

blogRouter.post("/", async (c) => {
  const env = c.env;
  const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const authorId = c.get("userId");

  const newBlog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: authorId,
    },
  });
  return c.json({
    message: "new blog created",
    id: newBlog.id,
  });
});

//updation of the blog
blogRouter.put("/", async (c) => {
  const env = c.env;
  const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const newBlog = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return c.json({
    message: "new blog updated",
    id: newBlog.id,
  });
});

// getting all the posts of the blog

blogRouter.get("/bulk", async (c) => {
  const env = c.env;
  const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blogs = await prisma.post.findMany();

  return c.json({
    blogs,
  });
});

//getting the post
blogRouter.get("/:id", async (c) => {
  const env = c.env;
  const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate());
  const id = c.req.param("id");

  const blog = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });
  return c.json({
    blog,
  });
});

// TODO you can add the pagination to enhance the user experience

// this sums the all the neccessary routes needed to create a blog app . The basic app
