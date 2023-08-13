import { LadingPageLayout } from '@/components/layouts/lading-page';
import { NextPageWithLayout } from '@/types';
import { withRoute } from '@/utils/withRoute';
import { Post as TPost, allPosts } from 'contentlayer/generated';
import dayjs from 'dayjs';
import { useMDXComponent } from 'next-contentlayer/hooks';
import Image from 'next/image';

type Props = {
   post: TPost;
};

const Post: NextPageWithLayout<Props> = ({ post }) => {
   const MDXContent = useMDXComponent(post.body.code);

   return (
      <div className="pt-header">
         <div className="w-full max-w-3xl px-4 py-4 mx-auto prose">
            <div>
               <span className="inline-block mb-1 text-sm text-muted-foreground">
                  Published on {dayjs(post.date).format('MMMM DD, YYYY')}
               </span>
               <h1>{post.title}</h1>
               <div className="w-full">
                  <div className="relative overflow-hidden rounded aspect-w-16 aspect-h-9">
                     <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="!m-0"
                     />
                  </div>
               </div>
               <MDXContent />
            </div>
         </div>
      </div>
   );
};

Post.getLayout = (page) => {
   return <LadingPageLayout>{page}</LadingPageLayout>;
};

export const getServerSideProps = withRoute({
   isProtected: false,
   onlyAdmin: false,
})(async ({ ctx }) => {
   const slug = ctx.params?.slug as string;

   const post = allPosts.find((post) => post.url.includes(slug));

   if (!post) {
      return {
         notFound: true,
      };
   }

   return {
      props: {
         post,
      },
   };
});

export default Post;
