import { Task } from "@/type"

export const IndexService = {
    taskIsFinish: function (task: Task) {
        const { status } = task
        return status === 'SUCCESS' || status === 'FAILURE'

    },
    form: {
        prompt: "",
    }
}