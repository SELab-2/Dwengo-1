import { type SubmissionDTO, SubmissionDTOId } from "@dwengo-1/interfaces/submission";

export interface SubmissionsResponse {
    submissions: SubmissionDTO[] | SubmissionDTOId[];
}
