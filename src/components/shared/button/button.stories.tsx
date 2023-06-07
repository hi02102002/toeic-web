import type { Meta, StoryObj } from '@storybook/react';
import { Icon360 } from '@tabler/icons-react';
import Button from './button';

const meta = {
   title: 'Components/Button',
   component: Button,
   argTypes: {
      variants: {
         options: ['primary', 'secondary', 'outline'],
         control: { type: 'radio' },
      },
      sizes: {
         options: ['sm', 'md', 'lg'],
         control: { type: 'radio' },
      },
      disabled: {
         control: { type: 'boolean' },
      },
      children: {
         control: { type: 'text' },
      },
      isLoading: {
         control: { type: 'boolean' },
      },
   },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLeftIcon: Story = {
   args: {
      leftIcon: <Icon360 />,
      children: 'With Left Icon',
   },
};
