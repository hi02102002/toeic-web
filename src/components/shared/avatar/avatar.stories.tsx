import { Meta, StoryObj } from '@storybook/react';
import Avatar from './avatar';

const meta = {
   title: 'Components/Avatar',
   component: Avatar,
   argTypes: {
      url: {
         control: { type: 'text' },
      },
      alt: {
         control: { type: 'text' },
      },
      sizes: {
         options: ['sm', 'md', 'lg'],
         control: { type: 'radio' },
      },
   },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
