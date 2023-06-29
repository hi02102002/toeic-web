export const BASE_URL = 'http://localhost:4000';

export const ROUTES = {
   HOME: '/',
   LOGIN: '/login',
   REGISTER: '/register',
   FORGOT_PASSWORD: '/forgot-password',
   RESET_PASSWORD: '/reset-password',
   PROFILE: '/profile',
   NOT_FOUND: '/404',
   SERVER_ERROR: '/500',
   DASHBOARD: '/dashboard',
   TOIEC_TEST: '/toiec-tests',
   VOCABULARY: '/vocabulary',
   GRAMMAR: '/grammar',
   SETTINGS: '/settings',
   BLOGS: '/blogs',
   ADMIN: '/admin',
   ADMIN_USERS: '/admin/users',
   ADMIN_TOIEC_TESTS: '/admin/toiec-tests',
   ADMIN_NATIONAL_TESTS: '/admin/national-tests',
   ADMIN_BLOGS: '/admin/blogs',
   ADMIN_WORDS: '/admin/words',
   ADMIN_GRAMMARS: '/admin/grammars',
   ADMIN_CHILDREN_QUESTIONS: '/admin/children-questions',
};

export const ROUTES_AUTH = [
   ROUTES.LOGIN,
   ROUTES.REGISTER,
   ROUTES.FORGOT_PASSWORD,
   ROUTES.RESET_PASSWORD,
];
