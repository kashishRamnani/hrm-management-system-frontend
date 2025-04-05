import { Request } from "./request";
import { toast } from 'react-toastify'; 
export class HR {

  static async all(token, setHR, setMessage, setLoading) {
    setLoading(true);
    try {
        const res = await Request.get('/admin/hrs', null, token);
        
        if (res.status !== 200) {
            throw new Error("Failed to fetch hr");
        }
        setHR(res.data.users);
    } catch (error) {
        setMessage(error.message);
    } finally {
        setLoading(false);
    }
}

    // method to delete a specified department
    static async delete(id, token, setMessage) {
      try {
          const res = await Request.delete(`/admin/delete-hr/${id}`, token);
          if (res.status !== 200) {
              console.log('An error occurred while deleting the department');
          }
          setMessage(res.data.message);
      } catch (error) {
          setMessage("Failed to delete the department");
      }
  }

  
  static async register(token, newHR, setMessage, setErrors) {
    try {
      const res = await Request.post(`/admin/hr-register`, newHR, token);
  
      if (res.status === 422) {
        setErrors(res.data.errors);
        
        res.data.errors.email?.forEach((msg) => toast.error(msg)); 
        res.data.errors.password?.forEach((msg) => toast.error(msg)); 
        return;
      }
  
      if (res.status !== 200) {
        throw new Error(res.data.message || "Failed to register HR");
      }
  
      setMessage(res.data.message);  
      toast.success(res.data.message); 
  
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while registering HR";
      setMessage(errorMessage);
      toast.error(errorMessage); 
    }}
  
  
  static async update(id, status, token, setMessage, setErrors) {
    const data = {
        status: status,  
    };

    try {
        
        const res = await Request.post(`/admin/update-status-hr/${id}`, data, token);

        
        if (res.status === 422) {
            setErrors(res.data.errors);
            return;
        }

      
        if (res.status !== 200) {
            
            throw new Error(res.data.message || "Failed to update HR status");
        }

        
        setMessage(res.data.message);
    } catch (error) {
        
        setMessage(error.response?.data?.message || error.message || "An error occurred while updating HR status");
    }
}



}

