import z from "zod";
import { prisma } from "../lib/prisma";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { redis } from "../lib/redis";

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

    if (!poll) return res.status(404).send({ message: 'Not Found.' });

    const getPollScores = await redis.zrange(poll_id, 0, -1, 'WITHSCORES', () => console.log('Trouxe os scores do redis'));


    // {id: 3}
    const votes = getPollScores.reduce((obj, line, index) => {
      if (index % 2 === 0) {
        const score = getPollScores[index + 1];
        Object.assign(obj, { [line]: Number(score) });
      }

      return obj;
    }, {} as Record<string, number>);


    return res.status(200).send({
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.options.map(opt => ({
          id: opt.id,
          title: opt.title,
          score: (opt.id in votes) ? votes[opt.id] : 0
        }))
      }
    });
  });
}
