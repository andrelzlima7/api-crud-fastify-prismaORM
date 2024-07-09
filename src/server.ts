import fastify from "fastify";
import cors from "@fastify/cors";
import { memoriesRoutes } from "./routes/memories";

const app = fastify();

app.register(cors, {
  origin: true,
});

const port = 3333;

app.register(memoriesRoutes);

app
  .listen({
    port: port,
  })
  .then(() => {
    console.log(`HTTP server running on http://localhost:${port}`);
  });
