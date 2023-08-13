import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
const Post = defineDocumentType(() => ({
   name: 'Post',
   filePathPattern: `blogs/**/*.mdx`,
   contentType: 'mdx',
   fields: {
      title: {
         type: 'string',
         description: 'The title of the post',
         required: true,
      },
      date: {
         type: 'date',
         description: 'The date of the post',
         required: true,
      },
      description: {
         type: 'string',
      },
      published: {
         type: 'boolean',
         default: true,
      },
      image: {
         type: 'string',
         required: true,
      },
      authors: {
         // Reference types are not embedded.
         // Until this is fixed, we can use a simple list.
         // type: "reference",
         // of: Author,
         type: 'list',
         of: { type: 'string' },
         required: true,
      },
   },
   computedFields: {
      url: {
         type: 'string',
         resolve: (doc) => `${doc._raw.flattenedPath}`,
      },
   },
}));

export const Author = defineDocumentType(() => ({
   name: 'Author',
   filePathPattern: `authors/**/*.mdx`,
   contentType: 'mdx',
   fields: {
      title: {
         type: 'string',
         required: true,
      },
      description: {
         type: 'string',
      },
      avatar: {
         type: 'string',
         required: true,
      },
      facebook: {
         type: 'string',
         required: true,
      },
   },
}));

export default makeSource({
   contentDirPath: './src/contents',
   documentTypes: [Post, Author],
   mdx: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug],
   },
});
