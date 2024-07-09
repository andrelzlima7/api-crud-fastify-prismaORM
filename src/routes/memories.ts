import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function memoriesRoutes(app: FastifyInstance) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const bodySchema = z.object({
    content: z.string(),
    coverUrl: z.string(),
    isPublic: z.coerce.boolean().default(false),
  });

  // ###### PEGAR TODOS AS MEMORIAS ######
  app.get("/memories", async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createAt: "asc",
      },
    });

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 120).concat("..."),
      };
    });
  });

  // ###### PEGAR UMA UNICA MEMORIA ######
  app.get("/memories/:id", async (request) => {
    const { id } = paramsSchema.parse(request.params);

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id: id,
      },
    });

    return memory;
  });

  // ###### ADICIONAR UMA MEMORIA ######
  app.post("/memories", async (request) => {
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body);

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: "3f9e7af2-5516-4eb7-80a9-7d0eae219d3b",
      },
    });

    return memory;
  });

  // ###### EDITAR UMA MEMORIA ######
  app.put("/memories/:id", async (request) => {
    const { id } = paramsSchema.parse(request.params);

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body);

    const memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    });

    return memory;
  });

  // ###### EXCLUIR UMA MEMORIA ######
  app.delete("/memories/:id", async (request) => {
    const { id } = paramsSchema.parse(request.params);

    await prisma.memory.delete({
      where: {
        id: id,
      },
    });
  });
}
