import type { Meta, StoryObj } from '@storybook/react';
import { Input, InputLabel, InputMessage, InputWrapper } from './input';

const meta = {
   title: 'Components/Input',
   component: Input,
   argTypes: {
      sizes: {
         options: ['sm', 'md', 'lg'],
         control: { type: 'radio' },
      },
      placeholder: {
         control: { type: 'text' },
      },
   },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const CInputGroup = () => {
   return (
      <InputWrapper>
         <InputLabel>Email</InputLabel>
         <Input placeholder="email" />
         <InputMessage>Enter your email.</InputMessage>
      </InputWrapper>
   );
};
