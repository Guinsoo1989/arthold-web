import { request } from "umi";

export const MjApi = {
    getTaskById:async (id:string) => {
        return BaseRequest.get(`/mj-api/mj/task/${id}/fetch`)
    }
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
