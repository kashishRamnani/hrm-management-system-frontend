import { Request } from "./request";
import { toast } from "react-toastify";

export class complaints {
  // Fetch all complaints
  static async all(token, setComplaintsData, setLoading) {
    setLoading(true);
    try {
      const res = await Request.get('/complaints', null, token);
      if (res.status !== 200) {
        throw new Error("Failed to fetch complaints");
      }

      const complaintsData = Array.isArray(res.data?.complaints) ? res.data.complaints : [];
      setComplaintsData(complaintsData);
     
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Network Error");
      setComplaintsData([]);
    } finally {
      setLoading(false);
    }
  }

  // Add a new complaint
  static async add(token, newComplaint) {
    try {
      const res = await Request.post(`/complaints`, newComplaint, token);
      if (res.status !== 200) {
        throw new Error("Failed to add a new complaint record");
      }
      toast.success(res.data?.message || "Complaint added successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to add complaint");
    }
  }

  // Delete a complaint
  static async delete(id, token) {
    try {
      const res = await Request.delete(`/complaints/${id}`, token);
      if (res.status !== 200) {
        throw new Error("Failed to delete the complaint record");
      }
      toast.success(res.data?.message || "Complaint deleted successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete the complaint record");
    }
  }
}
