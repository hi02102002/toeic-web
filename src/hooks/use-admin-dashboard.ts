import dashboardService from '@/services/dashboard.service';
import { useQuery } from '@tanstack/react-query';

export const useAdminDashboard = () => {
   return useQuery({
      queryKey: ['admin-dashboard'],
      queryFn: async () => {
         const res = await dashboardService.getAdminDashboard();

         return res.data;
      },
   });
};
