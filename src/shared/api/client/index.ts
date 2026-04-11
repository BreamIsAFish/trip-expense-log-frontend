import axios from "axios";

import { getApiBaseUrl } from "@/shared/api/baseUrl";

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});
