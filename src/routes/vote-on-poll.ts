import z from "zod";
import { prisma } from "../lib/prisma";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";


export async function voteOnPoll(server: FastifyInstance) {

  server.post('/polls/:poll_id/votes', async (req: FastifyRequest, res: FastifyReply) => {
    const voteOnPollBody = z.object({
      poll_option_id: z.string().cuid()
    });

    const voteOnPollParams = z.object({
      poll_id: z.string().cuid()
    });

    const { poll_option_id } = voteOnPollBody.parse(req.body);
    const { poll_id } = voteOnPollParams.parse(req.params);

    let { session_id } = req.cookies;

    if (!session_id) {
      session_id = randomUUID();

      res.setCookie('session-id', session_id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days,
        signed: true,
        httpOnly: true
      });
    }


    return res.status(201).send({ session_id });
  });
}
