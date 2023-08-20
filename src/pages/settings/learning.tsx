import {
   SectionSetting,
   SectionSettingBody,
   SectionSettingBottom,
   SectionSettingDescription,
   SectionSettingTextRequired,
   SectionSettingTitle,
} from '@/components/app/settings';
import { SettingsLayout } from '@/components/layouts/settings';
import {
   Button,
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   Input,
   Switch,
} from '@/components/shared';
import { useUpdateUserSettingLearning } from '@/hooks';
import { http_server } from '@/libs/axios';
import {
   NextPageWithLayout,
   TBaseResponse,
   TUserLearningSetting,
} from '@/types';
import { withRoute } from '@/utils/withRoute';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

type Props = {
   setting: TUserLearningSetting;
};

const schema = zod
   .object({
      maxFlashcardPerDay: zod
         .string()
         .nonempty(
            'Please enter a number of words to learn and review per day'
         ),
      maxReviewPerDay: zod
         .string()
         .nonempty('Please enter a number of words to review per day'),
      autoPlayAudio: zod.boolean().default(false),
   })
   .refine((data) => Number(data.maxFlashcardPerDay) >= 10, {
      message: 'Number of word to learn at least 10 word per day.',
      path: ['maxFlashcardPerDay'],
   })
   .refine((data) => Number(data.maxReviewPerDay) >= 10, {
      message: 'Number of word to review at least 10 word per day.',
      path: ['maxReviewPerDay'],
   });

type FormValues = zod.infer<typeof schema>;

const Learning: NextPageWithLayout<Props> = ({ setting }) => {
   const form = useForm<FormValues>({
      defaultValues: {
         maxFlashcardPerDay: Number(
            setting.maxFlashcardPerDay || 20
         ).toString(),
         maxReviewPerDay: Number(setting.maxReviewPerDay || 200).toString(),
         autoPlayAudio: setting.autoPlayAudio || false,
      },
      resolver: zodResolver(schema),
   });
   const {
      mutate: updateUserSettingLearning,
      isLoading: isUpdatingUserSettingLearning,
   } = useUpdateUserSettingLearning();

   const handleUpdateSetting = (values: FormValues) => {
      const { autoPlayAudio, maxFlashcardPerDay, maxReviewPerDay } = values;
      updateUserSettingLearning({
         autoPlayAudio,
         maxFlashcardPerDay: Number(maxFlashcardPerDay),
         maxReviewPerDay: Number(maxReviewPerDay),
      });
   };

   return (
      <div className="w-full">
         <SectionSetting>
            <SectionSettingBody>
               <div className="space-y-2">
                  <SectionSettingTitle title="Learning" />
                  <SectionSettingDescription description="You can set the number of words you want to learn and review per day." />
                  <Form {...form}>
                     <form
                        className="space-y-4"
                        id="learning"
                        onSubmit={form.handleSubmit(handleUpdateSetting)}
                     >
                        <FormField
                           control={form.control}
                           name="maxFlashcardPerDay"
                           render={({ field }) => {
                              return (
                                 <FormItem>
                                    <FormLabel required>
                                       Number of word to learn per day
                                    </FormLabel>
                                    <FormControl>
                                       <Input
                                          type="number"
                                          placeholder="Enter number of words to learn per day"
                                          {...field}
                                          classNameContainer="w-72"
                                          min={0}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              );
                           }}
                        />
                        <FormField
                           control={form.control}
                           name="maxReviewPerDay"
                           render={({ field }) => {
                              return (
                                 <FormItem>
                                    <FormLabel required>
                                       Number of word to review per day
                                    </FormLabel>
                                    <FormControl>
                                       <Input
                                          type="number"
                                          placeholder="Enter number of words to review per day"
                                          {...field}
                                          classNameContainer="w-72"
                                          min={0}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              );
                           }}
                        />
                        <FormField
                           control={form.control}
                           name="autoPlayAudio"
                           render={({ field }) => {
                              return (
                                 <FormItem>
                                    <FormLabel>Auto play audio</FormLabel>
                                    <FormControl>
                                       <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              );
                           }}
                        />
                     </form>
                  </Form>
               </div>
            </SectionSettingBody>
            <SectionSettingBottom>
               <SectionSettingTextRequired text="Number of word to learn and review at least 10 word per day." />
               <Button
                  variants="primary"
                  form="learning"
                  type="submit"
                  isLoading={isUpdatingUserSettingLearning}
               >
                  Save
               </Button>
            </SectionSettingBottom>
         </SectionSetting>
      </div>
   );
};

Learning.getLayout = (page) => {
   return <SettingsLayout>{page}</SettingsLayout>;
};

export const getServerSideProps = withRoute({
   isProtected: true,
})(async ({ access_token, refresh_token }) => {
   const geTUserLearningSetting = async () => {
      const res: TBaseResponse<TUserLearningSetting> = await http_server(
         {
            accessToken: access_token as string,
            refreshToken: refresh_token as string,
         },
         `/settings`
      );

      return res.data;
   };

   try {
      const setting = await geTUserLearningSetting();

      return {
         props: {
            setting,
         },
      };
   } catch (error) {
      return {
         notFound: true,
      };
   }
});

export default Learning;
