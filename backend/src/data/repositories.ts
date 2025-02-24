import {AnyEntity, EntityName, EntityRepository} from "@mikro-orm/core";
import {forkEntityManager} from "../orm";
import {StudentRepository} from "./users/student-repository";
import {Student} from "../entities/users/student.entity";

function repositoryGetter<T extends AnyEntity, R extends EntityRepository<T>>(entity: EntityName<T>): () => R {
    let cachedRepo: R | undefined;
    return (): R => {
        if (!cachedRepo) {
            cachedRepo = forkEntityManager().getRepository(entity) as R;
        }
        return cachedRepo;
    }
}

export const getStudentRepository = repositoryGetter<Student, StudentRepository>(Student);
