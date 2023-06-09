import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';
const config: StorybookConfig = {
   stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
   addons: [
      '@storybook/addon-links',
      '@storybook/addon-essentials',
      '@storybook/addon-interactions',
      '@storybook/addon-styling',
   ],
   framework: {
      name: '@storybook/nextjs',
      options: {},
   },
   docs: {
      autodocs: 'tag',
   },
   webpackFinal: async (config, { configType }) => {
      // @ts-ignore
      config.resolve.alias = {
         // @ts-ignore
         ...config.resolve.alias,
         '@': path.resolve(__dirname, '../src/'),
      };
      return config;
   },
};
export default config;
