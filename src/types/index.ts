import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';

export enum Role {
   ADMIN = 'ADMIN',
   USER = 'USER',
}

export enum UserStatus {
   BLOCKED = 'BLOCKED',
   ACTIVE = 'ACTIVE',
}

export enum PartType {
   PART1 = 'PART1',
   PART2 = 'PART2',
   PART3 = 'PART3',
   PART4 = 'PART4',
   PART5 = 'PART5',
   PART6 = 'PART6',
   PART7 = 'PART7',
}

export enum Provider {
   GOOGLE = 'google.com',
   FACEBOOK = 'facebook.com',
   LOCAL = 'local',
}

export type TUser = {
   id: string;
   name: string;
   email: string | null;
   password: string | null;
   createdAt?: Date;
   updatedAt?: Date;
   avatar: string | null;
   provider: string;
   roles: string[];
   status: UserStatus;
   isTesting: boolean;
};

export type TTest = {
   id: string;
   name: string;
   createdAt: Date;
   updatedAt: Date;
   parts: TPart[];
   audio: string;
};

export type TPart = {
   id: string;
   name: string;
   createdAt: Date;
   updatedAt: Date;
   testId: string;
   type: PartType;
   questions: TQuestion[];
};

export type TBaseResponse<T = unknown> = {
   message: string;
   data: T;
};

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
   getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
   Component: NextPageWithLayout;
};

export type TTestQuery = Partial<{
   name: string;
   limit: number;
   page: number;
   orderBy: string;
   asc: boolean;
}>;

export type TUploadRes = {
   asset_id: string;
   public_id: string;
   version: number;
   version_id: number;
   signature: string;
   width: number;
   height: number;
   format: string;
   resource_type: string;
   created_at: string;
   tags: Array<any>;
   pages: number;
   bytes: number;
   type: string;
   etag: string;
   placeholder: boolean;
   url: string;
   secure_url: string;
   playback_url: string;
   folder: string;
   audio: {
      codec: string;
      bit_rate: string;
      frequency: number;
      channels: number;
      channel_layout: string;
   };
   video: Record<string, any>;
   is_audio: boolean;
   bit_rate: number;
   duration: number;
   original_filename: string;
   api_key: string;
};

export type TAnswer = {
   id: string;
   createdAt: Date;
   updatedAt: Date;
   questionId: string;
   content: string;
   isCorrect: boolean;
};

export type TQuestion = {
   id: string;
   createdAt: Date;
   updatedAt: Date;
   partId: string | null;
   image: string;
   audio: string;
   text: string;
   transcript: string;
   explain: string;
   parentId: string | null;
   grammarId: string | null;
   nationalTestId: string | null;
   answers: TAnswer[];
   part: TPart;
   quesions: TQuestion[];
};

export type TQuestionDto = {
   audio?: FileList | string;
   image?: FileList | string;
   text?: string;
   parentId?: string | null;
   explain?: string;
   transcript?: string;
   partType?: keyof typeof PartType | PartType;
   answers?: Array<Pick<TAnswer, 'isCorrect' | 'content'>>;
   grammarId?: string | null;
   nationalTestId?: string | null;
   partId?: string | null;
   testId?: string | null;
};

export type TTestDto = {
   name: string;
   audio: string | FileList;
};

export type TQuestionQuery = Partial<{
   page: number;
   limit: number;
   partId: string;
   parentId: string;
   grammarId: string;
}>;

export type TGrammarQuery = Partial<{
   page: number;
   limit: number;
   name: string;
}>;

export type TGrammar = {
   id: string;
   createdAt: string;
   updatedAt: string;
   theory: string;
   questions: TQuestion[];
   name: string;
};

export type TGrammarDto = Pick<TGrammar, 'theory' | 'name'>;

export type TUserDto = Pick<TUser, 'avatar' | 'name' | 'status'>;

export type TProfileDto = Partial<Pick<TUser, 'avatar' | 'name'>>;

export type TUserQuery = Partial<{
   page: number;
   status: UserStatus | 'ALL';
   limit: number;
   name: string;
}>;

export type TTestUser = {
   id: string;
   createdAt: Date;
   updatedAt: Date;
   totalScore: number;
   listeningScore: number;
   readingScore: number;
   readingCorrect: number;
   listeningCorrect: number;
   numAttempt: number;
   testId: string;
   userId: string;
   test: TTest;
   user: TUser;
   choices: TChoice[];
};

export type TChoiceInput = {
   questionId: TQuestion['id'];
   answerId: TAnswer['id'];
   partType: PartType;
};

export type TSubmitTestDto = {
   testId: string;
   choices: Array<TChoiceInput>;
};

export type TChoice = {
   id: string;
   answerId: string;
   testUserId: string;
   testUser: TTestUser;
   answer: TAnswer;
};

export type TTopic = {
   id: string;
   createdAt: string;
   updatedAt: string;
   name: string;
   parentId: string | null;
   _count: {
      topics: number;
      words: number;
   };
   topics: TTopic[];
   hasChild: boolean;
};

export type TTopicQuery = Partial<{
   page: number;
   limit: number;
   name: string;
   parentId: string;
}>;

export type TTopicDto = Pick<TTopic, 'name' | 'parentId' | 'hasChild'>;

export type TWord = {
   id: string;
   createdAt: string;
   updatedAt: string;
   name: string;
   meaning?: string;
   definition?: string;
   examples?: string[];
   topicId: string;
   topic: TTopic;
   patchOfSpeech?: string;
   note?: string;
   audios: Array<{ src: string; region: string }>;
   pronunciation?: string;
   image?: string;
};

export type TWordDto = Omit<
   TWord,
   'id' | 'createdAt' | 'updatedAt' | 'topicId' | 'topic'
>;

export type TWordQuery = Partial<{
   page: number;
   limit: number;
   name: string;
}>;

export type TFlashcard = {
   id: string;
   createdAt: string;
   updatedAt: string;
   name?: string;
   meaning?: string;
   definition?: string;
   examples?: string[];
   patchOfSpeech?: string;
   note?: string;
   pronunciation?: string;
   image?: string;
   deckId: string;
   deck: TDeck;
   efactor: number;
   n: number;
   interval: number;
   due: string;
   lastReviewed: string | null;
};

export type TFlashcardWithAnswers = TFlashcard & {
   answers?: TFlashcard[];
};

export type TFlashcardDto = Omit<
   TFlashcard,
   | 'id'
   | 'createdAt'
   | 'updatedAt'
   | 'word'
   | 'deck'
   | 'deckId'
   | 'efactor'
   | 'n'
   | 'interval'
   | 'due'
   | 'lastReviewed'
> & {
   wordId?: string;
   deckId: string;
   n?: number;
   interval?: number;
   due?: string;
   lastReviewed?: string;
   efactor?: number;
};

export type TFlashcardQuery = Partial<{
   page: number;
   limit: number;
   name: string;
   deckId: string;
}>;

export type TDeck = {
   id: string;
   createdAt: string;
   updatedAt: string;
   name: string;
   userId: string;
   user: TUser;
   flashcards: TFlashcard[];
   _count: {
      flashcards: number;
   };
};

export type TDeckFromTopicDto = {
   topicId: string;
   name: string;
   wordIds: string[];
};

export type TDeckQuery = Partial<{
   page: number;
   limit: number;
   name: string;
}>;

export type TNavLink = {
   href: string;
   label: string;
};

export type TFlashcardQueryChart = {
   deckId?: string;
   dateStart?: string;
   dateEnd?: string;
};

export type TFlashcardChart = {
   date: string;
   learned: number;
   reviewed: number;
};

export type TUserLearningSetting = {
   id: string;
   createdAt: string;
   updatedAt: string;
   maxFlashcardPerDay: number;
   maxReviewPerDay: number;
   isShuffle: boolean;
   autoPlayAudio: boolean;
   timePerFlashcard: boolean;
   userId: string;
};

export type TUserLearningSettingDto = Partial<
   Pick<
      TUserLearningSetting,
      'autoPlayAudio' | 'maxFlashcardPerDay' | 'maxReviewPerDay'
   >
>;

export type TPasswordChangeDto = {
   oldPassword: string;
   newPassword: string;
   confirmPassword: string;
};

export type TQuestionJson = {
   image: string;
   audio: string;
   text: string;
   explain: string;
   transcript: string;
   answers: {
      content: string;
      isCorrect: boolean;
   }[];
   questions: Array<TQuestionJson>;
};
