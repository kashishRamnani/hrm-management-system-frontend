import { toast } from "react-toastify";
import { Request } from "./request";

export class JobHistory {
  
  static async all(token, setJobHistory) {
    try {
      const res = await Request.get('/job-histories', null, token);

      
      if (res.status !== 200) {
        throw new Error("Failed to fetch job histories");
      }

   
      if (res.data && res.data.job_history) {
        setJobHistory(res.data.job_history);
      } else {
        throw new Error("No job histories found");
      }
    } catch (error) {
      
      toast.error(error.message || "An error occurred while fetching job histories");
      setJobHistory([]); 
    }
  }




    // Method to add a new job history
    static async add(token, newJobHistory, setMessage, setErrors) {
        try {
            const res = await Request.post(`/job-histories`, newJobHistory, token);

            if (res.status === 422) {
                setErrors(res.data.errors);
                return;
            }

            if (res.status !== 200) {
                throw new Error("Failed to add new job history");
            }
            setMessage(res.data.message);
        } catch (error) {
            setMessage(error.message || "Failed to add new job history");
        }
    }

    static async update(id, token, data, setMessage, setEditingJobId) {
        const finalData = {
            employee_id: data.employee_id,
            status: data.status,
            department_id: data.department_id ?? data.department.id,
            position_id: data.position_id ?? data.position.id,
            employment_from: data.employment_from
        }

        try {
            const res = await Request.put(`/job-histories/${id}`, finalData, token);
            if (res.status !== 200) {
                throw new Error("Failed to update job history");
            }
            setMessage(res.data.message);
            setEditingJobId(null);
        } catch (error) {
            setMessage(error.message ?? "Failed to update job history");
        }
    }


    // Method to delete a specified job history
    static async delete(id, token, setMessage) {
        try {
            const res = await Request.delete(`/job-histories/${id}`, token);
            if (res.status !== 200) {
                throw new Error("An error occurred while deleting the job history");
            }
            setMessage(res.data.message);
        } catch (error) {
            setMessage(error.message || "Failed to delete job history");
        }
    }
}

export class Positions {

    static async all(token, setJobPositions) {

        if (!token) {
            console.error("No token provided");
            setJobPositions([]);
            return;
        }

        try {
            const res = await Request.get('/positions', null, token);

            if (res.status !== 200) {
                throw new Error("Failed to fetch job positions");
            }

            setJobPositions(res.data.position);
        } catch (error) {
            console.error(error);
            setJobPositions([]);
        }
    }
}
