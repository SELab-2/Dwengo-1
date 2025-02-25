import {DwengoEntityRepository} from "../dwengo-entity-repository";
import {Group} from "../../entities/assignments/group.entity";
import {Submission} from "../../entities/assignments/submission.entity";
import {LearningObjectIdentifier} from "../../entities/content/learning-object-identifier";
import {Student} from "../../entities/users/student.entity";

export class SubmissionRepository extends DwengoEntityRepository<Submission> {
    public findSubmissionByLearningObjectAndSubmissionNumber(loId: LearningObjectIdentifier, submissionNumber: number): Promise<Submission | null> {
        return this.findOne({
            learningObjectHruid: loId.hruid,
            learningObjectLanguage: loId.language,
            learningObjectVersion: loId.version,
            submissionNumber: submissionNumber
        });
    }

    public findMostRecentSubmissionForStudent(loId: LearningObjectIdentifier, submitter: Student): Promise<Submission | null> {
        return this.findOne({
            learningObjectHruid: loId.hruid,
            learningObjectLanguage: loId.language,
            learningObjectVersion: loId.version,
            submitter: submitter,
        }, {orderBy: {submissionNumber: "DESC"}})
    }

    public findMostRecentSubmissionForGroup(loId: LearningObjectIdentifier, group: Group): Promise<Submission | null> {
        return this.findOne({
            learningObjectHruid: loId.hruid,
            learningObjectLanguage: loId.language,
            learningObjectVersion: loId.version,
            onBehalfOf: group,
        }, {orderBy: {submissionNumber: "DESC"}})
    }

    public deleteSubmissionByLearningObjectAndSubmissionNumber(loId: LearningObjectIdentifier, submissionNumber: number): Promise<void> {
        return this.deleteWhere({
            learningObjectHruid: loId.hruid,
            learningObjectLanguage: loId.language,
            learningObjectVersion: loId.version,
            submissionNumber: submissionNumber
        })
    }
}
