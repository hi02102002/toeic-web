import { http } from '@/libs/axios';
import { TBaseResponse, TTest, TTestQuery } from '@/types';

class TestsService {
   async createTest(name: string): Promise<TBaseResponse<TTest>> {
      return http.post('/tests', {
         name,
      });
   }

   async removeTests(ids: string[]) {
      return http.delete('/tests', {
         data: {
            ids,
         },
      });
   }

   async updateTest(id: string, name: string): Promise<TBaseResponse<TTest>> {
      return http.patch(`/tests/${id}`, {
         name,
      });
   }

   getAllTests(q?: TTestQuery): Promise<
      TBaseResponse<{
         total: number;
         tests: Array<TTest>;
      }>
   > {
      return http.get('/tests', {
         params: {
            ...q,
            page: Number(q?.page || 1),
            limit: Number(q?.limit || 5),
         },
      });
   }
}

export const testsService = new TestsService();
