import { http } from '@/libs/axios';
import {
   TBaseResponse,
   TTopic,
   TTopicDto,
   TTopicQuery,
   TWord,
   TWordDto,
   TWordQuery,
} from '@/types';

class TopicsService {
   getTopics(query?: TTopicQuery): Promise<
      TBaseResponse<{
         topics: TTopic[];
         total: number;
      }>
   > {
      return http.get('/topics', { params: query });
   }
   createTopic(data: TTopicDto): Promise<TBaseResponse<TTopic>> {
      return http.post('/topics', data);
   }

   updateTopic(
      id: string,
      data: Partial<TTopicDto>
   ): Promise<TBaseResponse<TTopic>> {
      return http.patch(`/topics/${id}`, data);
   }
   deleteTopic(id: string): Promise<TBaseResponse<null>> {
      return http.delete(`/topics/${id}`);
   }
   removeTopics(ids: string[]): Promise<TBaseResponse<null>> {
      return http.delete('/topics', { data: { ids } });
   }
   createWord(topicId: string, data: TWordDto): Promise<TBaseResponse<TWord>> {
      return http.post(`/topics/${topicId}/words`, data);
   }

   getWords(
      topicId: string,
      q?: TWordQuery
   ): Promise<
      TBaseResponse<{
         total: number;
         words: TWord[];
      }>
   > {
      return http.get(`/topics/${topicId}/words`, { params: q });
   }

   updateWord(
      wordId: string,
      data: Partial<TWordDto>
   ): Promise<TBaseResponse<TWord>> {
      return http.patch(`/topics/words/${wordId}`, data);
   }

   removeWords(ids: string[]): Promise<TBaseResponse<null>> {
      return http.delete('/topics/words', { data: { ids } });
   }
}

export const topicsService = new TopicsService();
