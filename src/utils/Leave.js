import { Request } from "./request";
import { toast } from "react-toastify";

export class Leaves {
  // Fetch all leaves
  static async all(token, setLeavesData, setLoading) {
    setLoading(true);
    try {
      const res = await Request.get('/leaves', null, token);
      if (res.status !== 200) {
        throw new Error("Failed to fetch complaints");
      }

      const leavesData = Array.isArray(res.data?.leaves) ? res.data.leaves : [];
      setLeavesData(leavesData);
     
    } catch (error) {
      
      toast.error(error.response?.data?.message || "Network Error");
      setLeavesData([]);
    } finally {
      setLoading(false);
    }
  }

  // Add a new leave
  static async add(token, newLeave) {
    try {
      const res = await Request.post(`/leaves`, newLeave, token);
      if (res.status !== 200) {
        throw new Error("Failed to add a new leave record");
      }
      toast.success(res.message || "Leave added successfully!");
    } catch (error) {
      console.error("Error adding leave:", error);
      toast.error(error.response?.data?.message || "Failed to add leave");
    }
  }

  // Delete a leave
  static async delete(id, token) {
    try {
      const res = await Request.delete(`/leaves/${id}`, token);
      if (res.status !== 200) {
        throw new Error("Failed to delete the leave record");
      }
      toast.success(res.data?.message || "Leave deleted successfully");
    } catch (error) {
      console.error("Error deleting leave:", error);
      toast.error("Failed to delete the leave record");
    }
  }
}
