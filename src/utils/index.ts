import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export const getFileFromUrl = async (url: string, name: string) => {
   const response = await fetch(url);
   const data = await response.blob();
   return new File([data], name);
};

export const calcPageCount = (total: number, perPage: number) => {
   return Math.ceil(total / perPage);
};
