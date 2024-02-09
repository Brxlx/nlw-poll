import { FastifyInstance } from "fastify";
import { voting } from "../utils/Voting-Pub-Sub";
import z from "zod";

export async function pollResults(server: FastifyInstance) {
  server.get('/polls/:poll_id/results', { websocket: true }, (con, req) => {
    const getPollParams = z.object({
      poll_id: z.string().cuid()
    });

    const { poll_id } = getPollParams.parse(req.params);

    // Pub/Sub
    // Inscrever apenas nas mensagens publicadas no canal com o ID da enquete(`poll_id`)
    voting.subscribe(poll_id, (message) => {
      con.socket.send(JSON.stringify(message));
    });

  });
}