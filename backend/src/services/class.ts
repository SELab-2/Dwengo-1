import { getClassRepository } from "../data/repositories";
import { ClassDTO, mapToClassDTO } from "../interfaces/classes";

export async function getClass(classId: string): Promise<ClassDTO | null> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls) return null;
    else {
        return mapToClassDTO(cls);
    }
}