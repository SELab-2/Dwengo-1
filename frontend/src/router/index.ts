import {createRouter, createWebHistory} from "vue-router";
import LoginPage from "@/views/LoginPage.vue";
import HomePage from "@/views/HomePage.vue";
import MenuBar from "@/components/MenuBar.vue";
import StudentHomepage from "@/views/StudentHomepage.vue";
import StudentAssignments from "@/views/assignment/StudentAssignments.vue";
import StudentClasses from "@/views/class/StudentClasses.vue";
import StudentDiscussions from "@/views/discussion/StudentDiscussions.vue";
import TeacherHomepage from "@/views/TeacherHomepage.vue";
import TeacherAssignments from "@/views/assignment/TeacherAssignments.vue";
import TeacherClasses from "@/views/class/TeacherClasses.vue";
import TeacherDiscussions from "@/views/discussion/TeacherDiscussions.vue";
import SingleAssignment from "@/views/assignment/SingleAssignment.vue";
import SingleClass from "@/views/class/SingleClass.vue";
import SingleDiscussion from "@/views/discussion/SingleDiscussion.vue";
import NotFound from "@/components/errors/NotFound.vue";
import CreateClass from "@/views/class/CreateClass.vue";
import CreateAssignment from "@/views/assignment/CreateAssignment.vue";
import CreateDiscussion from "@/views/discussion/CreateDiscussion.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomePage,
        },
        {
            path: "/:role/login",
            name: "LoginPage",
            component: LoginPage
        },
        {
            path: "/:role/register",
            name: "RegisterPage",
            component: () => {}
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
