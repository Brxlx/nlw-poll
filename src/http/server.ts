import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';


const server = fastify();

const prisma = new PrismaClient();

server.post('/polls', async (req: FastifyRequest, res: FastifyReply) => {
  const createPollBody = z.object({
    title: z.string().min(5)
  });

  const { title } = createPollBody.parse(req.body);

  // const poll = await prisma.poll.create({
  //   data: {
  //     title
  //   }
  // });

  return res.status(201).header('poll-id', 'as8as8as7d').send();
});


server.listen({ host: '0.0.0.0', port: 3333 }, () => {
  console.log('HTTP server is up and running!');
});