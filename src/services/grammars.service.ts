import { http } from '@/libs/axios';
import { TBaseResponse, TGrammar, TGrammarDto, TGrammarQuery } from '@/types';

class GrammarsService {
   getAllGrammars(q?: TGrammarQuery): Promise<
      TBaseResponse<{
         total: number;
         grammars: TGrammar[];
      }>
   > {
      return http.get('/grammars', {
         params: {
            ...q,
            page: q?.page || 1,
            limit: q?.limit || 5,
         },
      });
   }

   createGrammarLesson(data: TGrammarDto): Promise<TBaseResponse<TGrammar>> {
      return http.post('/grammars', data);
   }

   updateGrammarLesson(
      id: string,
      data: Partial<TGrammarDto>
   ): Promise<TBaseResponse<TGrammar>> {
      return http.patch(`/grammars/${id}`, data);
   }

   removeGrammars(ids: string[]): Promise<TBaseResponse<null>> {
      return http.delete('/grammars', {
         data: {
            ids,
         },
      });
   }

   getGrammar(id: string): Promise<TBaseResponse<TGrammar>> {
      return http.get(`/grammars/${id}`);
   }
}

const grammarsService = new GrammarsService();

export { grammarsService };
