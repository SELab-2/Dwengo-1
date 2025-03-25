import { createRouter, createWebHistory } from "vue-router";
import MenuBar from "@/components/MenuBar.vue";
import StudentHomepage from "@/views/homepage/StudentHomepage.vue";
import SingleAssignment from "@/views/assignments/SingleAssignment.vue";
import SingleClass from "@/views/classes/SingleClass.vue";
import SingleDiscussion from "@/views/discussions/SingleDiscussion.vue";
import NotFound from "@/components/errors/NotFound.vue";
import CreateClass from "@/views/classes/CreateClass.vue";
import CreateAssignment from "@/views/assignments/CreateAssignment.vue";
import CreateDiscussion from "@/views/discussions/CreateDiscussion.vue";
import CallbackPage from "@/views/CallbackPage.vue";
import UserDiscussions from "@/views/discussions/UserDiscussions.vue";
import UserClasses from "@/views/classes/UserClasses.vue";
import UserAssignments from "@/views/classes/UserAssignments.vue";
import authState from "@/services/auth/auth-service.ts";
import LearningPathPage from "@/views/learning-paths/LearningPathPage.vue";
import path from "path";
import LearningPathSearchPage from "@/views/learning-paths/LearningPathSearchPage.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("../views/HomePage.vue"),
            meta: { requiresAuth: false },
        },
        {
            path: "/login",
            name: "LoginPage",
            component: () => import("../views/LoginPage.vue"),
            meta: { requiresAuth: false },
        },
        {
            path: "/callback",
            component: CallbackPage,
            meta: { requiresAuth: false },
        },

        {
            path: "/user",
            component: MenuBar,
            meta: { requiresAuth: true },
            children: [
                {
                    path: "home",
                    name: "UserHomePage",
                    component: StudentHomepage,
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
                {
                    path: "discussion",
                    name: "UserDiscussions",
                    component: UserDiscussions,
                },
            ],
        },

        {
            path: "/assignment/create",
            name: "CreateAssigment",
            component: CreateAssignment,
            meta: { requiresAuth: true },
        },
        {
            path: "/assignment/:id",
            name: "SingleAssigment",
            component: SingleAssignment,
            meta: { requiresAuth: true },
        },
        {
            path: "/class/create",
            name: "CreateClass",
            component: CreateClass,
            meta: { requiresAuth: true },
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
            path: "/discussion/:id",
            name: "SingleDiscussion",
            component: SingleDiscussion,
            meta: { requiresAuth: true },
        },
        {
           path: "/learningPath/search",
           name: "LearningPathSearchPage",
           component: LearningPathSearchPage,
           meta: { requiresAuth: false }
        },
        {
            path: "/learningPath/:hruid/:language",
            name: "LearningPath",
            component: LearningPathPage,
            props: true,
            meta: { requiresAuth: false },
            children: [
                {
                    path: ":learningObjectHruid",
                    component: LearningPathPage,
                    props: true,
                }
            ]
        },
        {
            path: "/:catchAll(.*)",
            name: "NotFound",
            component: NotFound,
            meta: { requiresAuth: false },
        },
    ],
});

router.beforeEach(async (to, from, next) => {
    // Verify if user is logged in before accessing certain routes
    if (to.meta.requiresAuth) {
        if (!authState.isLoggedIn.value) {
            next("/login");
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
