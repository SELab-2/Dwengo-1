import { createRouter, createWebHistory } from 'vue-router';
import SingleAssignment from '@/views/assignments/SingleAssignment.vue';
import SingleClass from '@/views/classes/SingleClass.vue';
import SingleDiscussion from '@/views/discussions/SingleDiscussion.vue';
import NotFound from '@/components/errors/NotFound.vue';
import CreateAssignment from '@/views/assignments/CreateAssignment.vue';
import CreateDiscussion from '@/views/discussions/CreateDiscussion.vue';
import CallbackPage from '@/views/CallbackPage.vue';
import UserClasses from '@/views/classes/UserClasses.vue';
import UserAssignments from '@/views/assignments/UserAssignments.vue';
import LearningPathPage from '@/views/learning-paths/LearningPathPage.vue';
import LearningPathSearchPage from '@/views/learning-paths/LearningPathSearchPage.vue';
import UserHomePage from '@/views/homepage/UserHomePage.vue';
import SingleTheme from '@/views/SingleTheme.vue';
import LearningObjectView from '@/views/learning-paths/learning-object/LearningObjectView.vue';
import authService from '@/services/auth/auth-service';
import DiscussionForward from '@/views/discussions/DiscussionForward.vue';
import NoDiscussion from '@/views/discussions/NoDiscussion.vue';
import OwnLearningContentPage from '@/views/own-learning-content/OwnLearningContentPage.vue';
import { allowRedirect, Redirect } from '@/utils/redirect.ts';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: async (): Promise<unknown> => import("../views/HomePage.vue"),
            meta: { requiresAuth: false },
        },
        {
            path: "/login",
            name: "LoginPage",
            component: async (): Promise<unknown> => import("../views/LoginPage.vue"),
            meta: { requiresAuth: false },
        },
        {
            path: "/callback",
            component: CallbackPage,
            meta: { requiresAuth: false },
        },

        {
            path: "/user",
            meta: { requiresAuth: true },
            children: [
                {
                    path: "",
                    name: "UserHomePage",
                    component: UserHomePage,
                },
                {
                    path: "assignment",
                    name: "UserAssignments",
                    component: UserAssignments,
                },
                {
                    path: "class",
                    name: "UserClasses",
                    component: UserClasses,
                },
            ],
        },

        {
            path: "/theme/:theme",
            name: "Theme",
            component: SingleTheme,
            props: true,
            meta: { requiresAuth: true },
        },
        {
            path: "/assignment",
            meta: { requiresAuth: true },
            children: [
                {
                    path: "create",
                    name: "CreateAssigment",
                    component: CreateAssignment,
                },
                {
                    path: ":classId/:id",
                    name: "SingleAssigment",
                    component: SingleAssignment,
                },
            ],
        },
        {
            path: "/class/:id",
            name: "SingleClass",
            component: SingleClass,
            meta: { requiresAuth: true },
        },
        {
            path: "/discussion/create",
            name: "CreateDiscussion",
            component: CreateDiscussion,
            meta: { requiresAuth: true },
        },
        {
            path: "/discussion",
            name: "Discussions",
            component: NoDiscussion,
            meta: { requiresAuth: true },
        },
        {
            path: "/discussion/:hruid/:language/:learningObjectHruid",
            name: "SingleDiscussion",
            component: SingleDiscussion,
            props: true,
            meta: { requiresAuth: true },
        },
        {
            path: "/discussion-reload/:hruid/:language/:learningObjectHruid",
            name: "DiscussionForwardWorkaround",
            component: DiscussionForward,
            props: true,
            meta: { requiresAuth: true },
        },
        {
            path: "/my-content",
            name: "OwnLearningContentPage",
            component: OwnLearningContentPage,
            meta: { requiresAuth: true },
        },
        {
            path: "/learningPath",
            children: [
                {
                    path: "search",
                    name: "LearningPathSearchPage",
                    component: LearningPathSearchPage,
                    meta: { requiresAuth: true },
                },
                {
                    path: ":hruid/:language/:learningObjectHruid",
                    name: "LearningPath",
                    component: LearningPathPage,
                    props: true,
                    meta: { requiresAuth: true },
                },
            ],
        },
        {
            path: "/learningObject/:hruid/:language/:version/raw",
            name: "LearningObjectView",
            component: LearningObjectView,
            props: true,
            meta: { requiresAuth: true },
        },
        {
            path: "/:catchAll(.*)",
            name: "NotFound",
            component: NotFound,
            meta: { requiresAuth: false },
        },
    ],
});

router.beforeEach(async (to, _from, next) => {
    // Verify if user is logged in before accessing certain routes
    if (to.meta.requiresAuth) {
        if (!authService.isLoggedIn.value && !(await authService.loadUser())) {
            const path = to.fullPath;
            if (allowRedirect(path)) {
                localStorage.setItem(Redirect.AFTER_LOGIN_KEY, path);
            }
            next(Redirect.LOGIN);
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
