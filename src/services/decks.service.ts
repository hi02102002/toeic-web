import { http } from '@/libs/axios';
import {
   TBaseResponse,
   TDeck,
   TDeckFromTopicDto,
   TDeckQuery,
   TFlashcard,
   TFlashcardDto,
} from '@/types';

class DecksService {
   createDeckFromTopic(data: TDeckFromTopicDto): Promise<TBaseResponse<TDeck>> {
      return http.post('/decks/from-topic', data);
   }
   getDecks(q?: TDeckQuery): Promise<
      TBaseResponse<{
         decks: TDeck[];
         total: number;
      }>
   > {
      return http.get('/decks', {
         params: q,
      });
   }
   createDeck(name: string): Promise<TBaseResponse<TDeck>> {
      return http.post('/decks', { name });
   }
   removeDeck(id: string): Promise<TBaseResponse<null>> {
      return http.delete(`/decks/${id}`);
   }
   getDeck(id: string): Promise<TBaseResponse<TDeck>> {
      return http.get(`/decks/${id}`);
   }
   updateDeck(id: string, name: string): Promise<TBaseResponse<TDeck>> {
      return http.patch(`/decks/${id}`, { name });
   }

   createFlashcard(
      deckId: string,
      data: TFlashcardDto
   ): Promise<TBaseResponse<TFlashcard>> {
      return http.post(`/decks/${deckId}/flashcards`, data);
   }
}

export const decksService = new DecksService();
