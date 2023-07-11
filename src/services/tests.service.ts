import { http } from '@/libs/axios';
import {
   TBaseResponse,
   TPart,
   TSubmitTestDto,
   TTest,
   TTestDto,
   TTestQuery,
   TTestUser,
} from '@/types';

class TestsService {
   createTest(fields: TTestDto): Promise<TBaseResponse<TTest>> {
      return http.post('/tests', fields);
   }

   removeTests(ids: string[]) {
      return http.delete('/tests', {
         data: {
            ids,
         },
      });
   }

   updateTest(
      id: string,
      name: string,
      audio: string
   ): Promise<TBaseResponse<TTest>> {
      return http.patch(`/tests/${id}`, {
         name,
         audio,
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

   getPractice(testId: string): Promise<TBaseResponse<TTest | null>> {
      return http.get(`/tests/${testId}/practice`);
   }

   submitTest(fields: TSubmitTestDto): Promise<TBaseResponse<TTestUser>> {
      return http.post('/tests/submit', fields);
   }

   getResult(id: string): Promise<TBaseResponse<TTestUser>> {
      return http.get(`/tests/results/${id}`);
   }
}

export const testsService = new TestsService();
