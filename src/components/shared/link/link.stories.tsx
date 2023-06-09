import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './link';

const meta = {
   title: 'Components/Link',
   component: Link,
   argTypes: {
      children: {
         control: { type: 'text' },
      },
   },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
   args: {
      children: 'Link ne',
      href: '/',
   },
};
