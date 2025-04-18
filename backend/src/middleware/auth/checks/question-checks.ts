import {authorize} from "./auth-checks";
import {AuthenticationInfo} from "../authentication-info";
import {AuthenticatedRequest} from "../authenticated-request";
import {requireFields} from "../../../controllers/error-helper";
import {getLearningObjectId, getQuestionId} from "../../../controllers/questions";
import {fetchQuestion} from "../../../services/questions";
import {FALLBACK_SEQ_NUM} from "../../../config";
import {fetchAnswer} from "../../../services/answers";

export const onlyAllowAuthor = authorize(
    (auth: AuthenticationInfo, req: AuthenticatedRequest) => req.body.author === auth.username
);

export const onlyAllowAuthorRequest = authorize(
    (auth: AuthenticationInfo, req: AuthenticatedRequest) => {
        const hruid = req.params.hruid;
        const version = req.params.version;
        const language = req.query.lang as string;
        const seq = req.params.seq;
        requireFields({ hruid });

        const learningObjectId = getLearningObjectId(hruid, version, language);
        const questionId = getQuestionId(learningObjectId, seq);

        const question = await fetchQuestion(questionId);

        return question.author.username == auth.username;
    }
);

export const onlyAllowAuthorRequestAnswer = authorize(
    (auth: AuthenticationInfo, req: AuthenticatedRequest) => {
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

        return answer.author.username == auth.username;
    }
);
