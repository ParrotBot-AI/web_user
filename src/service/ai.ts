import http from "@/utils/http";

const baseur = import.meta.env.VITE_AI_APP_BASEURL as string;

export const startStream = async (params:any) => {
  return http.post(baseur + '/v1/modelapi/streaming/', params)
}
