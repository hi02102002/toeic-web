import { http } from '@/libs/axios';
import { TBaseResponse, TPart, TTest, TTestQuery } from '@/types';

class TestsService {
   createTest(name: string): Promise<TBaseResponse<TTest>> {
      return http.post('/tests', {
         name,
      });
   }

   removeTests(ids: string[]) {
      return http.delete('/tests', {
         data: {
            ids,
         },
      });
   }

   updateTest(id: string, name: string): Promise<TBaseResponse<TTest>> {
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

   getPartById(id: string): Promise<
      TBaseResponse<
         TPart & {
            test: Pick<TTest, 'id' | 'name'>;
         }
      >
   > {
      return http.get(`/tests/parts/${id}`);
   }
}

export const testsService = new TestsService();
