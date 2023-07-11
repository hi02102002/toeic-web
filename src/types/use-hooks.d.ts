declare module '@uidotdev/usehooks' {
   export function useWindowScroll(): [
      {
         x: number;
         y: number;
      },
      scrollTo: (...arg) => void
   ];
}
