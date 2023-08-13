import { Post as TPost } from 'contentlayer/generated';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
   post: TPost;
};

export const Post = ({ post }: Props) => {
   return (
      <div className="space-y-2 bg-bg">
         <div className="w-full overflow-hidden rounded">
            <div className="relative aspect-w-16 aspect-h-9">
               <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
               />
            </div>
         </div>
         <div className="space-y-1">
            <Link href={post.url} title={post.title}>
               <h2 className="text-lg font-semibold line-clamp-1">
                  {post.title}
               </h2>
            </Link>
            <p className="line-clamp-2">{post.description}</p>
            <span className="text-sm font-medium">
               {dayjs(post.date).format('MMMM DD, YYYY')}
            </span>
         </div>
      </div>
   );
};

export default Post;
