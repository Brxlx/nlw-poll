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

    if (session_id) {
      const userPreviousVotedOnPoll = await prisma.vote.findUnique({
        where: {
          session_id_poll_id: {
            session_id,
            poll_id
          }
        }
      });

      if (userPreviousVotedOnPoll && userPreviousVotedOnPoll.poll_option_id !== poll_option_id) {
        // Apagar o voto anterior
        await prisma.vote.delete({
          where: {
            id: userPreviousVotedOnPoll.id
          }
        });
      } else if (userPreviousVotedOnPoll) {
        // Já votou nesta mesma opção
        return res.status(400).send({ message: "You already voted on this option on this poll." });
      }
    }

    if (!session_id) {
      session_id = randomUUID();

      res.setCookie('session_id', session_id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days,
        signed: true,
        httpOnly: true
      });
    }

    await prisma.vote.create({
      data: {
        session_id,
        poll_id,
        poll_option_id
      }
    })


    return res.status(201).send();
  });
}
