import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Group } from '../../entities/assignments/group.entity.js';
import { Submission } from '../../entities/assignments/submission.entity.js';
import { LearningObjectIdentifier } from '../../entities/content/learning-object-identifier.js';
import { Student } from '../../entities/users/student.entity.js';

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

<<<<<<< HEAD
    public findByLearningObject(loId: LearningObjectIdentifier): Promise<Submission[]> {
        return this.find({
            learningObjectHruid: loId.hruid,
            learningObjectLanguage: loId.language,
            learningObjectVersion: loId.version,
        });
    }

    public findMostRecentSubmissionForStudent(loId: LearningObjectIdentifier, submitter: Student): Promise<Submission | null> {
=======
    public async findMostRecentSubmissionForStudent(loId: LearningObjectIdentifier, submitter: Student): Promise<Submission | null> {
>>>>>>> 6c3dbc99bb1afb79fa867505e52656c49bada1b6
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
        return this.find({ onBehalfOf: group });
    }

    public async findAllSubmissionsForStudent(student: Student): Promise<Submission[]> {
        return this.find({ submitter: student });
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
