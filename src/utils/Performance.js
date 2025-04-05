import { Request } from "./request";
import { toast } from "react-toastify";
export class Performance {

  static async all(token, setPerformances, setLoading) {
    setLoading(true);
    try {
      const res = await Request.get('/performance-reviews', null, token);
      if (res.status !== 200) {
        throw new Error("Failed to fetch performance reviews");
      }
      setPerformances(res.data.review);
    } catch (error) {
     
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }


  static async update(token, updatedData, setMessage) {
    const data = {
      review_date: (updatedData.review_date),
      kpi_score: parseFloat(updatedData.kpi_score),
      feedback: (updatedData.feedback),
      _method: 'put',
    };

    try {
      const res = await Request.put(`/performance-reviews/${updatedData.id}`, data, token);

      if (res.status !== 200) {
        throw new Error("Failed to update compensation");
      }

      setMessage(res.data.message);
    } catch (error) {
      console.error("Error updating performance review:", error);
      setMessage("Failed to update compensation");
    }
  }

  static async delete(id, token, setMessage) {
    try {
      const res = await Request.delete(`/performance-reviews/${id}`, token);

      if (res.status !== 200) {
        throw new Error("Failed to delete compensation");
      }

      setMessage(res.data.message);
    } catch (error) {
      console.error("Error deleting performance review:", error);
      setMessage("Failed to delete the compensation record");
    }
  }


  static async add(token, newPR, setMessage) {
    try {
      const decimalNumberPattern = /^[0-9]{2}\.[0-9]{1,2}$/; 
      if (!decimalNumberPattern.test(newPR.kpi_score)) {
        throw new Error('The KPI must be in the format of [77.98], [99.56]');
      }
  
      const res = await Request.post(`/performance-reviews`, newPR, token);
  
      if (res.status !== 200) {
        throw new Error(res.data.message || "Failed to add a new performance review record");
      }
  
      
      setMessage({ success: res.data.message }); 
    } catch (error) {
      console.error("Error adding performance review:", error);
      setMessage({ 
        error: error.message || 
               error.response?.data?.message || 
               "An error occurred while adding the performance review"
      });
    }
  }
  
  
}
