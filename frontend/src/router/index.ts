import {createRouter, createWebHistory} from "vue-router";
import LoginPage from "@/views/auth/LoginPage.vue";
import RegisterPage from "@/views/auth/RegisterPage.vue";
import HomePage from "@/views/auth/HomePage.vue";
import MenuBar from "@/components/MenuBar.vue";
import StudentHomepage from "@/views/student/StudentHomepage.vue";
import StudentAssignments from "@/views/student/StudentAssignments.vue";
import StudentClasses from "@/views/student/StudentClasses.vue";
import StudentDiscussions from "@/views/student/StudentDiscussions.vue";
import TeacherHomepage from "@/views/teacher/TeacherHomepage.vue";
import TeacherAssignments from "@/views/teacher/TeacherAssignments.vue";
import TeacherClasses from "@/views/teacher/TeacherClasses.vue";
import TeacherDiscussions from "@/views/teacher/TeacherDiscussions.vue";
import SingleAssignment from "@/views/resources/assignment/SingleAssignment.vue";
import SingleClass from "@/views/resources/class/SingleClass.vue";
import SingleDiscussion from "@/views/resources/discussion/SingleDiscussion.vue";
import NotFound from "@/components/errors/NotFound.vue";
import CreateClass from "@/views/resources/class/CreateClass.vue";
import CreateAssignment from "@/views/resources/assignment/CreateAssignment.vue";
import CreateDiscussion from "@/views/resources/discussion/CreateDiscussion.vue";

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
            component: RegisterPage
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
