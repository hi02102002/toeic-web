import { LadingPageLayout } from '@/components/layouts/lading-page';
import { Button } from '@/components/shared';
import { NextPageWithLayout } from '@/types';
import { withRoute } from '@/utils/withRoute';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Post as TPost, allPosts } from 'contentlayer/generated';
import dayjs from 'dayjs';
import { useMDXComponent } from 'next-contentlayer/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

type Props = {
   post: TPost;
   nextPost: TPost | null;
   prevPost: TPost | null;
};

const Post: NextPageWithLayout<Props> = ({ post, nextPost, prevPost }) => {
   const MDXContent = useMDXComponent(post.body.code);
   const router = useRouter();

   return (
      <div className="pt-header">
         <div className="w-full max-w-3xl px-4 py-4 mx-auto">
            <div className="prose max-w-full">
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
            <div className="mt-4 flex items-center justify-between">
               {prevPost && (
                  <Link href={prevPost.url} className="block mr-auto ">
                     <Button
                        variants="transparent"
                        className=" flex items-center gap-2 max-w-xs"
                        title={prevPost.title}
                        onClick={() => router.push(prevPost.url)}
                     >
                        <IconChevronLeft className="w-5 h-5" />
                        <span className="line-clamp-1">{prevPost.title}</span>
                     </Button>
                  </Link>
               )}
               {nextPost && (
                  <Link href={nextPost.url} className="block ml-auto ">
                     <Button
                        variants="transparent"
                        className="flex items-center gap-2 max-w-xs "
                        title={nextPost.title}
                     >
                        <span className="line-clamp-1">{nextPost.title}</span>
                        <IconChevronRight className="w-5 h-5" />
                     </Button>
                  </Link>
               )}
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

   const postIndex = allPosts.findIndex((post) => post.url.includes(slug));

   if (!allPosts[postIndex]) {
      return {
         notFound: true,
      };
   }

   const nextPost = allPosts[postIndex + 1];

   const prevPost = allPosts[postIndex - 1];

   return {
      props: {
         post: allPosts[postIndex],
         nextPost: nextPost
            ? {
                 ...nextPost,
                 body: null,
                 url: nextPost.url.replace('blogs/', ''),
              }
            : null,
         prevPost: prevPost
            ? {
                 ...prevPost,
                 body: null,
                 url: prevPost.url.replace('blogs/', ''),
              }
            : null,
      },
   };
});

export default Post;
