import { http } from '@/libs/axios';
import {
   TBaseResponse,
   TFlashcard,
   TFlashcardDto,
   TFlashcardQuery,
} from '@/types';

class FlashcardsService {
   getFlashcards(q?: TFlashcardQuery): Promise<
      TBaseResponse<{
         flashcards: TFlashcard[];
         total: number;
      }>
   > {
      return http.get('/flashcards', {
         params: {
            ...q,
            page: q?.page || 1,
            limit: q?.limit || 20,
         },
      });
   }
   createFlashcard(data: TFlashcardDto): Promise<TBaseResponse<TFlashcard>> {
      return http.post('/flashcards', data);
   }
   updateFlashcard(
      id: string,
      data: Omit<TFlashcardDto, 'deckId' | 'wordId'>
   ): Promise<TBaseResponse<TFlashcard>> {
      return http.patch(`/flashcards/${id}`, data);
   }

   deleteFlashcard(id: string): Promise<TBaseResponse<null>> {
      return http.delete(`/flashcards/${id}`);
   }
}

export const flashcardsService = new FlashcardsService();
