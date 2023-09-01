import { http } from '@/libs/axios';
import { TBaseResponse } from '@/types';

class DashboardService {
   getUserDashboard() {
      return http.get('/dashboard/users');
   }

   getAdminDashboard(): Promise<
      TBaseResponse<{
         top5TestUseMost: Array<{
            testId: string;
            testName: string;
            usageCount: number;
         }>;
      }>
   > {
      return http.get('/dashboard/admin');
   }
}

const dashboardService = new DashboardService();

export default dashboardService;
