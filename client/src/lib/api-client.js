import axios from "axios";
import { HOST } from "@/utils/constants.js";

export const apiClient = axios.create({
    baseURL: HOST,
});

/*
 Instead of manually setting options in every API request, you can centralize settings like:

Base URL (so you don’t repeat it)
Headers (e.g., Authorization token)
Timeout settings
Interceptors for modifying requests & responses

*/