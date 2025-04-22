import {authorize} from "./auth-checks";
import {AuthenticationInfo} from "../authentication-info";
import {AuthenticatedRequest} from "../authenticated-request";
import {requireFields} from "../../../controllers/error-helper";
import {getLearningObjectId, getQuestionId} from "../../../controllers/questions";
import {fetchQuestion} from "../../../services/questions";
import {FALLBACK_SEQ_NUM} from "../../../config";
import {fetchAnswer} from "../../../services/answers";
import {mapToUsername} from "../../../interfaces/user";

export const onlyAllowAuthor = authorize(
    (auth: AuthenticationInfo, req: AuthenticatedRequest) => (req.body as { author: string }).author === auth.username
);

export const onlyAllowAuthorRequest = authorize(
    async (auth: AuthenticationInfo, req: AuthenticatedRequest) => {
        const hruid = req.params.hruid;
        const version = req.params.version;
        const language = req.query.lang as string;
        const seq = req.params.seq;
        requireFields({ hruid });

        const learningObjectId = getLearningObjectId(hruid, version, language);
        const questionId = getQuestionId(learningObjectId, seq);

        const question = await fetchQuestion(questionId);

        return question.author.username === auth.username;
    }
);

export const onlyAllowAuthorRequestAnswer = authorize(
    async (auth: AuthenticationInfo, req: AuthenticatedRequest) => {
        const hruid = req.params.hruid;
        const version = req.params.version;
        const language = req.query.lang as string;
        const seq = req.params.seq;
        const seqAnswer = req.params.seqAnswer;
        requireFields({ hruid });

        const learningObjectId = getLearningObjectId(hruid, version, language);
        const questionId = getQuestionId(learningObjectId, seq);

        const sequenceNumber = Number(seqAnswer) || FALLBACK_SEQ_NUM;
        const answer = await fetchAnswer(questionId, sequenceNumber);

        return answer.author.username === auth.username;
    }
);

export const onlyAllowIfHasAccessToQuestion = authorize(
    async (auth: AuthenticationInfo, req: AuthenticatedRequest) => {
        const hruid = req.params.hruid;
        const version = req.params.version;
        const language = req.query.lang as string;
        const seq = req.params.seq;
        requireFields({ hruid });

        const learningObjectId = getLearningObjectId(hruid, version, language);
        const questionId = getQuestionId(learningObjectId, seq);

        const question = await fetchQuestion(questionId);
        const group = question.inGroup;

        if (auth.accountType === "teacher") {
            const cls = group.assignment.within; // TODO check if contains full objects
            return cls.teachers.map(mapToUsername).includes(auth.username);
        }  // User is student
            return group.members.map(mapToUsername).includes(auth.username);
        
    }
);
