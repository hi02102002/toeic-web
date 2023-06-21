import { http } from '@/libs/axios';
import {
   TAnswer,
   TBaseResponse,
   TQuestion,
   TQuestionDto,
   TQuestionQuery,
} from '@/types';

class QuestionService {
   createQuestion(data: TQuestionDto): Promise<TBaseResponse<TQuestion>> {
      return http.post('/questions', data);
   }
   getQuestions(q?: TQuestionQuery): Promise<
      TBaseResponse<{
         questions: TQuestion[];
         total: number;
      }>
   > {
      return http.get('/questions', { params: q });
   }

   getQuestion(id: string): Promise<TBaseResponse<TQuestion>> {
      return http.get(`/questions/${id}`);
   }

   updateQuestion(
      id: string,
      data: TQuestionDto & {
         answers: Array<Pick<TAnswer, 'content' | 'id' | 'isCorrect'>>;
      }
   ): Promise<TBaseResponse<TQuestion>> {
      return http.patch(`/questions/${id}`, data);
   }

   removeQuestions(ids: string[]): Promise<TBaseResponse<TQuestion[]>> {
      return http.delete('/questions', { data: { ids } });
   }
}

export const questionService = new QuestionService();

export default questionService;
