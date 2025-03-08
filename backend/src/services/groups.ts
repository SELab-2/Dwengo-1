import { getAssignmentRepository, getClassRepository, getGroupRepository } from "../data/repositories";
import { GroupDTO, mapToGroupDTO, mapToGroupDTOId } from "../interfaces/groups";

export async function getGroup(
    classId: string, 
    assignmentNumber: number, 
    groupNumber: number,
    full: boolean,
): Promise<GroupDTO | null> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls) {
        return null;
    }

    const assignmentRepository = getAssignmentRepository();
    const assignment = await assignmentRepository.findByClassAndId(cls, assignmentNumber);

    if (!assignment) {
        return null;
    }

    const groupRepository = getGroupRepository();
    const group = await groupRepository.findByAssignmentAndGroupNumber(assignment, groupNumber);

    if (!group) {
        return null;
    }

    if (full) {
        return mapToGroupDTO(group);
    }

    return mapToGroupDTOId(group);
}