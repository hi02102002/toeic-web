import { Post } from '@/components/app/blogs';
import { LadingPageLayout } from '@/components/layouts/lading-page';
import { NextPageWithLayout } from '@/types';
import { withRoute } from '@/utils/withRoute';
import { Post as TPost, allPosts } from 'contentlayer/generated';
import dayjs from 'dayjs';
type Props = {
   posts: Array<TPost>;
};

const Blogs: NextPageWithLayout<Props> = ({ posts }) => {
   console.log(posts);
   return (
      <div className="pt-header">
         <div className="container py-4">
            <ul className="grid grid-cols-4 gap-4">
               {posts.map((post) => {
                  return <Post key={post._id} post={post} />;
               })}
            </ul>
         </div>
      </div>
   );
};

Blogs.getLayout = (page) => {
   return (
      <LadingPageLayout
      // title="Toiec | Blogs"
      // description="List articles about tips, tricks, and strategies for the TOEIC test."
      >
         {page}
      </LadingPageLayout>
   );
};

export const getServerSideProps = withRoute({
   isProtected: false,
   onlyAdmin: false,
})(async () => {
   const posts = allPosts
      .filter((post) => post.published)
      .sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());

   return {
      props: {
         posts,
      },
   };
});

export default Blogs;
