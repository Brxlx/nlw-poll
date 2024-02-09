import z from "zod";
import { prisma } from "../lib/prisma";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function createPoll(server: FastifyInstance) {

  server.post('/polls', async (req: FastifyRequest, res: FastifyReply) => {
    const createPollBody = z.object({
      title: z.string().min(5),
      options: z.array(z.string())
    });

    const { title, options } = createPollBody.parse(req.body);

    const poll = await prisma.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map(option => {
              return { title: option }
            })
          }
        }
      }
    });

    return res.status(201).header('poll-id', poll.id).send();
  });
}
