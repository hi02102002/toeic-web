import { useFlashcardsChart } from '@/hooks';
import { useRouter } from 'next/router';
import {
   Bar,
   BarChart,
   CartesianGrid,
   Legend,
   ResponsiveContainer,
   Tooltip,
   XAxis,
   YAxis,
} from 'recharts';

export const FlashcardChart = () => {
   const router = useRouter();
   const { data: resFlashcardsChart } = useFlashcardsChart({
      deckId: router.query.deckId as string,
   });

   return (
      <div className="h-96">
         <ResponsiveContainer width="100%" height="100%">
            <BarChart
               width={500}
               height={300}
               data={resFlashcardsChart || []}
               margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
               }}
            >
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="date" />
               <YAxis />
               <Tooltip wrapperClassName="rounded border-border border" />
               <Legend />
               <Bar dataKey="learned" fill="#27272a" />
               <Bar dataKey="reviewed" fill="#7f7f80" />
            </BarChart>
         </ResponsiveContainer>
      </div>
   );
};

export default FlashcardChart;
