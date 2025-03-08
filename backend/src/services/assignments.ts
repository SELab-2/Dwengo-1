import { getAssignmentRepository, getClassRepository } from "../data/repositories";
import { AssignmentDTO, mapToAssignmentDTO } from "../interfaces/assignment";

export async function getAssignment(classid: string, id: number): Promise<AssignmentDTO | null> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classid);

    if (!cls) {
        return null;
    }

    const assignmentRepository = getAssignmentRepository();
    const assignment = await assignmentRepository.findByClassAndId(cls, id);

    if (!assignment) {
        return null;
    }

    return mapToAssignmentDTO(assignment, cls);
}
