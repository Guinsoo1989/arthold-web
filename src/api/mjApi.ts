import { ChangeAction, Task } from "@/type";
import { request } from "umi";



export const MjApi = {
  getTaskById: async (id: string) => {
    return BaseRequest.get<Task>(`/mj-api/mj/task/${id}/fetch`)
  },
  getTaskByIds: async (param: { ids: string[] }) => {
    return BaseRequest.jsonPost<Task[]>('/mj-api/mj/task/list-by-condition', param)
  },
  submit: {
    imagine: async (param: SubmitImagineParam) => {
      return BaseRequest.jsonPost<SubmitRes>('/mj-api/mj/submit/imagine', param)
    },
    change: async (param: SubmitChange) => {
      return BaseRequest.jsonPost<SubmitRes>('/mj-api/mj/submit/change', param)
    },
  }
}

export enum SubmitCode {
  提交成功 = 1,
  已存在 = 2,
  排队中 = 22,
}

export type SubmitRes = {
  code: SubmitCode;
  description: string;
  result: string;
}

type SubmitImagineParam = {
  prompt: string
}

export type ImageIndex = 1 | 2 | 3 | 4;

export type SubmitChange = {
  action: ChangeAction;
  taskId: string;
  index: ImageIndex;
}

const BaseRequest = {
  get: async function <T = any>(url: string, params?: any) {
    return request<T>(url, {
      method: "GET",
      params,
    });
  },

  jsonPost: async function <T = any>(url: string, body?: unknown) {
    return request<T>(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
    });
  },

  formPost: async function <T = any>(url: string, params: any) {
    const formData = new FormData();
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const value = params[key];
        if (key === "files") {
          // 默认都是传文件数组
          value.forEach((file: File) => {
            formData.append("file", file);
          });
        } else {
          formData.append(key, value);
        }
      }
    }
    return request<T>(url, {
      method: "POST",
      requestType: "form",
      data: formData,
    });
  },
};
