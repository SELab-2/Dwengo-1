// TODO : temp data until frontend controllers are ready
type Teacher = {
    username: string;
    firstName: string;
    lastName: string;
    classes: Array<Class>;
};

type Student = {
    username: string;
    firstName: string;
    lastName: string;
    classes: Array<Class>;
};

type Class = {
    id: string;
    displayName: string;
    teachers: Array<Teacher>;
    students: Array<Student>;
};

const student01: Student = { username: "id01", firstName: "Mark", lastName: "Knopfler", classes: [] };
const student02: Student = { username: "id02", firstName: "John", lastName: "Hiat", classes: [] };
const student03: Student = { username: "id03", firstName: "Aaron", lastName: "Lewis", classes: [] };

const teacher01: Student = { username: "id11", firstName: "Mark", lastName: "Knopfler", classes: [] };
const teacher02: Student = { username: "id12", firstName: "John", lastName: "Hiat", classes: [] };
const teacher03: Student = { username: "id13", firstName: "Aaron", lastName: "Lewis", classes: [] };

const class01: Class = {
    id: "class01",
    displayName: "class 01",
    teachers: [teacher01],
    students: [student01, student02],
};
const class02: Class = {
    id: "class02",
    displayName: "class 02",
    teachers: [teacher02],
    students: [student01, student03],
};
const class03: Class = {
    id: "class03",
    displayName: "class 03",
    teachers: [teacher03],
    students: [student02, student03],
};

student01.classes = [class01, class02];
student02.classes = [class01, class03];
student03.classes = [class02, class03];

teacher01.classes = [class01];
teacher02.classes = [class02];
teacher03.classes = [class03];

type Assignment = {
    id: string;
    title: string;
    description: string;
};

export const assignments: Assignment[] = Array.from({ length: 4 }, (_, i) => ({
    id: `assignment${i}`,
    title: `Assignment ${i}`,
    description:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. " +
        "Aenean commodo ligula eget dolor. Aenean massa. " +
        "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
}));

export const classes: Array<Class> = [class01, class02, class03];
