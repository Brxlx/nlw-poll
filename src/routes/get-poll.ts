import z from "zod";
import { prisma } from "../lib/prisma";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function getPoll(server: FastifyInstance) {

  server.get('/polls/:poll_id', async (req: FastifyRequest, res: FastifyReply) => {
    const getPollParams = z.object({
      poll_id: z.string().cuid()
    });

    const { poll_id } = getPollParams.parse(req.params);

    const poll = await prisma.poll.findUnique({
      where: { id: poll_id }, include: {
        options: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    if (!poll) return res.status(404).send({ message: 'Not Found.' })

    return res.status(200).send({ poll });
  });
}
