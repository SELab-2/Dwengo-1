import {type SubmissionDTO, SubmissionDTOId} from "dwengo-1-common/src/interfaces/submission";

export type SubmissionsResponse = { submissions: SubmissionDTO[] | SubmissionDTOId[] };
