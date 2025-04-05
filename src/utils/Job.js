import { Request } from "./request";

export class JOB {
  static async all(token) {
    try {
      const res = await Request.get("/jobs", null, token);
      if (res.status === 200) {
        return res.data.jobs; 
      } else {
        throw new Error("Failed to fetch jobs. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw new Error("An error occurred while fetching jobs.");
    }
  }
}
