import {createRouter, createWebHistory} from "vue-router";
import MenuBar from "@/components/MenuBar.vue";
import StudentHomepage from "@/views/StudentHomepage.vue";
import StudentAssignments from "@/views/assignments/StudentAssignments.vue";
import StudentClasses from "@/views/classes/StudentClasses.vue";
import StudentDiscussions from "@/views/discussions/StudentDiscussions.vue";
import TeacherHomepage from "@/views/TeacherHomepage.vue";
import TeacherAssignments from "@/views/assignments/TeacherAssignments.vue";
import TeacherClasses from "@/views/classes/TeacherClasses.vue";
import TeacherDiscussions from "@/views/discussions/TeacherDiscussions.vue";
import SingleAssignment from "@/views/assignments/SingleAssignment.vue";
import SingleClass from "@/views/classes/SingleClass.vue";
import SingleDiscussion from "@/views/discussions/SingleDiscussion.vue";
import NotFound from "@/components/errors/NotFound.vue";
import CreateClass from "@/views/classes/CreateClass.vue";
import CreateAssignment from "@/views/assignments/CreateAssignment.vue";
import CreateDiscussion from "@/views/discussions/CreateDiscussion.vue";
import CallbackPage from "@/views/discussions/CallbackPage.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: () => {return import("../views/HomePage.vue")},
        },
        {
            path: "/login",
            name: "LoginPage",
            component: () => {return import("../views/LoginPage.vue")}
        },
        {
            path: "/callback",
            component: CallbackPage
        },
        {
            path: "/student/:id",
            component: MenuBar,
            children: [
                {
                    path: "home",
                    name: "StudentHomePage",
                    component: StudentHomepage
                },
                {
                    path: "assignment",
                    name: "StudentAssignments",
                    component: StudentAssignments
                },
                {
                    path: "class",
                    name: "StudentClasses",
                    component: StudentClasses
                },
                {
                    path: "discussion",
                    name: "StudentDiscussions",
                    component: StudentDiscussions
                },
            ]
        },

        {
            path: "/teacher/:id",
            component: MenuBar,
            children: [
                {
                    path: "home",
                    name: "TeacherHomepage",
                    component: TeacherHomepage
                },
                {
                    path: "assignment",
                    name: "TeacherAssignments",
                    component: TeacherAssignments
                },
                {
                    path: "class",
                    name: "TeacherClasses",
                    component: TeacherClasses
                },
                {
                    path: "discussion",
                    name: "TeacherDiscussions",
                    component: TeacherDiscussions
                },
            ]
        },
        {
            path: "/assignment/create",
            name: "CreateAssigment",
            component: CreateAssignment

        },
        {
            path: "/assignment/:id",
            name: "SingleAssigment",
            component: SingleAssignment

        },
        {
            path: "/class/create",
            name: "CreateClass",
            component: CreateClass
        },
        {
            path: "/class/:id",
            name: "SingleClass",
            component: SingleClass
        },
        {
            path: "/discussion/create",
            name: "CreateDiscussion",
            component: CreateDiscussion
        },
        {
            path: "/discussion/:id",
            name: "SingleDiscussion",
            component: SingleDiscussion
        },
        {
            path: "/:catchAll(.*)",
            name: "NotFound",
            component: NotFound,
        },
    ],
});

export default router;
