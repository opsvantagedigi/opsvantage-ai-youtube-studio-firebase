import { FastifyAdapter } from '@bull-board/fastify'
import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { createQueue } from '../../lib/queue'

const serverAdapter = new FastifyAdapter()

const youtubePublishQueue = createQueue('youtube-publish')

createBullBoard({
  queues: [new BullMQAdapter(youtubePublishQueue)],
  serverAdapter,
})

export { serverAdapter as bullBoardApp }
