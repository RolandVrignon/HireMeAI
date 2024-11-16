import { createAI } from 'ai/rsc';
import { continueConversation } from './actions';
import { ServerMessage, ClientMessage } from '@/types/types'

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});