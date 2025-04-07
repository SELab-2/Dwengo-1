import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Group } from '../../entities/assignments/group.entity.js';
import { Submission } from '../../entities/assignments/submission.entity.js';
import { LearningObjectIdentifier } from '../../entities/content/learning-object-identifier.js';
import { Student } from '../../entities/users/student.entity.js';
import {Assignment} from "../../entities/assignments/assignment.entity";

export class SubmissionRepository extends DwengoEntityRepository<Submission> {
    public async findSubmissionByLearningObjectAndSubmissionNumber(
        loId: LearningObjectIdentifier,
        submissionNumber: number
    ): Promise<Submission | null> {
        return this.findOne({
            learningObjectHruid: loId.hruid,
            learningObjectLanguage: loId.language,
            learningObjectVersion: loId.version,
            submissionNumber: submissionNumber,
        });
    }

    public async findMostRecentSubmissionForStudent(loId: LearningObjectIdentifier, submitter: Student): Promise<Submission | null> {
        return this.findOne(
            {
                learningObjectHruid: loId.hruid,
                learningObjectLanguage: loId.language,
                learningObjectVersion: loId.version,
                submitter: submitter,
            },
            { orderBy: { submissionNumber: 'DESC' } }
        );
    }

    public async findMostRecentSubmissionForGroup(loId: LearningObjectIdentifier, group: Group): Promise<Submission | null> {
        return this.findOne(
            {
                learningObjectHruid: loId.hruid,
                learningObjectLanguage: loId.language,
                learningObjectVersion: loId.version,
                onBehalfOf: group,
            },
            { orderBy: { submissionNumber: 'DESC' } }
        );
    }

    public async findAllSubmissionsForGroup(group: Group): Promise<Submission[]> {
        return this.find(
            { onBehalfOf: group },
            {
                populate: ["onBehalfOf.members"]
            }
        );
    }

    /**
     * Looks up all submissions for the given learning object which were submitted as part of the given assignment.
     * When forStudentUsername is set, only the submissions of the given user's group are shown.
     */
    public async findAllSubmissionsForLearningObjectAndAssignment(
        loId: LearningObjectIdentifier,
        assignment: Assignment,
        forStudentUsername?: string
    ): Promise<Submission[]> {
        let onBehalfOf = forStudentUsername ? {
            assignment,
            members: {
                $some: {
                    username: forStudentUsername
                }
            }
        } : {
            assignment
        };

        return this.findAll({
            where: {
                learningObjectHruid: loId.hruid,
                learningObjectLanguage: loId.language,
                learningObjectVersion: loId.version,
                onBehalfOf
            }
        });
    }

    public async findAllSubmissionsForStudent(student: Student): Promise<Submission[]> {
        return this.find(
            { submitter: student },
            {
                populate: ["onBehalfOf.members"]
            }
        );
    }

    public async deleteSubmissionByLearningObjectAndSubmissionNumber(loId: LearningObjectIdentifier, submissionNumber: number): Promise<void> {
        return this.deleteWhere({
            learningObjectHruid: loId.hruid,
            learningObjectLanguage: loId.language,
            learningObjectVersion: loId.version,
            submissionNumber: submissionNumber,
        });
    }
}
