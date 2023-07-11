export type ChangeAction = 'UPSCALE' | 'VARIATION' | 'ZOOM';
export type TaskAction = 'IMAGINE' | ChangeAction

export type Task = {
    id: string
    action: TaskAction
    submitTime: number
    finishTime: number
    imageUrl: string
    progress: string
    prompt: string
    promptEn: string
    status: "NOT_START" | "SUBMITTED" | "IN_PROGRESS" | "FAILURE" | 'SUCCESS'
}

export type TaskItem = Task & {
    imageBlob?: Blob
}

export interface MjImage {
    taskId: string;
    image: Blob;
}