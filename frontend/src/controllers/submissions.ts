import {type SubmissionDTO, SubmissionDTOId} from "dwengo-1-common/src/interfaces/submission";

export interface SubmissionsResponse { submissions: SubmissionDTO[] | SubmissionDTOId[] }
