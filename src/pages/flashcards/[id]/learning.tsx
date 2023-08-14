import { Flashcard } from '@/components/app/flashcard';
import { AppLayout } from '@/components/layouts/app';
import {
   LearningFlashcardProvider,
   useLearningFlashcardCtx,
} from '@/contexts/learning-flashcard.ctx';
import { http_server } from '@/libs/axios';
import {
   NextPageWithLayout,
   TBaseResponse,
   TDeck,
   TFlashcardWithAnswers,
} from '@/types';
import { withRoute } from '@/utils/withRoute';
import Image from 'next/image';

type Props = {
   deck: TDeck;
   flashcards: TFlashcardWithAnswers[];
};

const WithLearningProvider: NextPageWithLayout<Props> = ({
   flashcards,
   deck,
}) => {
   return (
      <div>
         <LearningFlashcardProvider initFlashcards={flashcards}>
            <Learning flashcards={flashcards} deck={deck} />
         </LearningFlashcardProvider>
      </div>
   );
};

const Learning = ({ deck }: Props) => {
   const { currentFlashcard, flashcards } = useLearningFlashcardCtx();

   return (
      <div className="container py-4 space-y-4">
         <h3 className="text-lg font-semibold">
            Learning flashcard of {deck.name}
         </h3>
         <div>
            {currentFlashcard ? (
               <Flashcard flashcard={currentFlashcard} />
            ) : (
               <div className="flex flex-col items-center justify-center space-y-4 p-9">
                  <div className="w-28">
                     <div className="relative aspect-1">
                        <Image
                           src="/party.png"
                           alt="Party Image"
                           fill
                           className="object-cover"
                        />
                     </div>
                  </div>
                  <h3 className="text-lg font-semibold text-center">
                     Congratulations! You finished learning flashcards today!
                  </h3>
               </div>
            )}
         </div>
      </div>
   );
};

WithLearningProvider.getLayout = (page) => {
   return (
      <AppLayout
         title="Toiec | Learning"
         description="This page is for learning"
      >
         {page}
      </AppLayout>
   );
};

export const getServerSideProps = withRoute({
   isProtected: true,
   onlyAdmin: false,
})(async ({ access_token, refresh_token, ctx }) => {
   const id = ctx.params?.id as string;

   const getDeck = async () => {
      const res: TBaseResponse<TDeck> = await http_server(
         {
            accessToken: access_token as string,
            refreshToken: refresh_token as string,
         },
         `/decks/${id}`
      );
      return res.data;
   };

   const getLearningFlashcards = async () => {
      const res: TBaseResponse<TFlashcardWithAnswers[]> = await http_server(
         {
            accessToken: access_token as string,
            refreshToken: refresh_token as string,
         },
         `/flashcards/learn/${id}`
      );

      return res.data;
   };

   try {
      const [deck, flashcards] = await Promise.all([
         getDeck(),
         getLearningFlashcards(),
      ]);

      if (!deck) {
         return {
            notFound: true,
         };
      }

      return {
         props: {
            deck,
            flashcards,
         },
      };
   } catch (error) {
      return {
         notFound: true,
      };
   }
});

export default WithLearningProvider;
