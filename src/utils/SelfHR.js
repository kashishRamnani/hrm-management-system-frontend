import { Request } from "./request";

export class SelfHR {
  static async register(token, newselfHR, setMessage) {
    try {
      const res = await Request.post(`/auth/hr-self-register`, newselfHR, token);

      if (res.status !== 200) {
        throw new Error(res.data.message || "Failed to register HR");
      }

      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred while registering HR");
    }
  }
}
