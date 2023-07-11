import { NUMBER_QUESTIONS_PART } from '@/constants';
import { PartType } from '@/types';
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

const dateDiffInDays = (a: Date, b: Date) => {
   const _MS_PER_DAY = 1000 * 60 * 60 * 24;
   // Discard the time and time-zone information.
   const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
   const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

   return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

export const isNew = (createdAt: string | Date) => {
   return dateDiffInDays(new Date(createdAt), new Date()) <= 7;
};

export const sumAllArr = (arr: number[]) => {
   return arr.reduce((prev, current) => {
      return prev + current;
   }, 0);
};

export const calcNumberContinueQuestion = (type: PartType) => {
   switch (type) {
      case PartType.PART2:
         return NUMBER_QUESTIONS_PART['PART1'];
      case PartType.PART3:
         return NUMBER_QUESTIONS_PART['PART1'] + NUMBER_QUESTIONS_PART['PART2'];
      case PartType.PART4:
         return (
            NUMBER_QUESTIONS_PART['PART1'] +
            NUMBER_QUESTIONS_PART['PART2'] +
            NUMBER_QUESTIONS_PART['PART3']
         );
      case PartType.PART5:
         return (
            NUMBER_QUESTIONS_PART['PART1'] +
            NUMBER_QUESTIONS_PART['PART2'] +
            NUMBER_QUESTIONS_PART['PART3'] +
            NUMBER_QUESTIONS_PART['PART4']
         );
      case PartType.PART6:
         return (
            NUMBER_QUESTIONS_PART['PART1'] +
            NUMBER_QUESTIONS_PART['PART2'] +
            NUMBER_QUESTIONS_PART['PART3'] +
            NUMBER_QUESTIONS_PART['PART4'] +
            NUMBER_QUESTIONS_PART['PART5']
         );
      case PartType.PART6:
         return (
            NUMBER_QUESTIONS_PART['PART1'] +
            NUMBER_QUESTIONS_PART['PART2'] +
            NUMBER_QUESTIONS_PART['PART3'] +
            NUMBER_QUESTIONS_PART['PART4'] +
            NUMBER_QUESTIONS_PART['PART5']
         );
      case PartType.PART7:
         return (
            NUMBER_QUESTIONS_PART['PART1'] +
            NUMBER_QUESTIONS_PART['PART2'] +
            NUMBER_QUESTIONS_PART['PART3'] +
            NUMBER_QUESTIONS_PART['PART4'] +
            NUMBER_QUESTIONS_PART['PART5'] +
            NUMBER_QUESTIONS_PART['PART6']
         );
      default:
         return 0;
   }
};

export const millisToMinutesAndSeconds = (millis: number) => {
   const minutes = Math.floor(millis / 60000);
   const seconds = Number(((millis % 60000) / 1000).toFixed(0));
   return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};
