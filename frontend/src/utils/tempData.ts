// TODO : temp data until frontend controllers are ready
interface Teacher {
    username: string;
    firstName: string;
    lastName: string;
    classes: Class[];
}

interface Student {
    username: string;
    firstName: string;
    lastName: string;
    classes: Class[];
}

interface Class {
    id: string;
    displayName: string;
    teachers: Teacher[];
    students: Student[];
}

const student01: Student = {username: "id01", firstName: "Mark", lastName: "Knopfler", classes: []};
const student02: Student = {username: "id02", firstName: "John", lastName: "Hiat", classes: []};
const student03: Student = {username: "id03", firstName: "Aaron", lastName: "Lewis", classes: []};

const teacher01: Student = {username: "id11", firstName: "Mark", lastName: "Knopfler", classes: []};
const teacher02: Student = {username: "id12", firstName: "John", lastName: "Hiat", classes: []};
const teacher03: Student = {username: "id13", firstName: "Aaron", lastName: "Lewis", classes: []};

const class01: Class = {
    id: "8764b861-90a6-42e5-9732-c0d9eb2f55f9",
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

interface Assignment {
    id: string;
    title: string;
    description: string;
}


export const assignments: Assignment[] = Array.from({length: 4}, (_, i) => ({
    id: `assignment${i}`,
    title: `Assignment ${i}`,
    learningPathHruid: 'lphruid',
    class: `class 0${i+1}`,
    description:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. " +
        "Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, " +
        "nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. " +
        "Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. " +
        "In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. " +
        "Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. " +
        "Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. " +
        "Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. " +
        "Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, " +
        "sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. " +
        "Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. " +
        "Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. " +
        "Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,",
    groups: [
        {
            id: 'group1',
            members: [
                student01,
                student02
            ]
        },
        {
            id: 'group2',
            members: [
                student01,
                student03
            ]
        }
    ]
}));


export const classes: Class[] = [class01, class02, class03];
