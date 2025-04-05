import { Request } from "./request";
import { toast } from "react-toastify";

export class Compensation {
  static async all(token, setCompensations, setMessage, setLoading) {
    setLoading(true); 

    try {
      const res = await Request.get('/compensations', null, token);

      
      if (res.status !== 200) {
        setMessage("Failed to fetch compensations");
        toast.error("Network Error");
        return; 
      }

      
      if (res.data && res.data[1]) {
        setCompensations(res.data[1]);
      } else {
        setMessage("No compensations found");
        toast.warn("No compensations found");
      }
    } catch (error) {
     
      const errorMessage =
        error.response?.data?.message || "Network Error";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
     
      setLoading(false);
    }
  }



 
  static async add(token, newCompensation,setMessage) {
    try {
      const res = await Request.post(`/compensations`, newCompensation, token);
      if (!res.status === 200) {
        throw new Error("Failed to add a new compensation record")

      }
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error);
    }
  }

  // method to update the compensation record
  static async update(token, updatedData, setMessage) {
    const data = {
      bonus: parseFloat(updatedData.bonus),
      base_salary: parseFloat(updatedData.bonus),
      _method: 'put'
    }

    try {
      const res = await Request.put(`/compensations/${updatedData.id}`, data, token);
      if (!res.status === 200) {
        throw new Error("Failed to update compensation");
      }
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Failed to update compensation");
    }
  }

  // method to delete an sppecified compensation
  static async delete(id, token, setMessage) {
    try {
      const res = await Request.delete(`/compensations/${id}`, token)
      if (!res.status === 200) {
        console.log('An error occured while deleting a compensation')
      }
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Failed to delete the compensation record");
    }
  }
}

// class to handle the all employees operations
export class Employee {
  // method to fetch all employees
  // Ensure the Employee.all method in your `Compensation.js` handles the API response and passes correct data.
static async all(token, setEmployees) {
  try {
    const res = await Request.get('/employees', null, token);
    if (res.status === 200) {
      setEmployees(res.data.employees); // Ensure this is the correct path
    } else {
      throw new Error('Failed to fetch employees');
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
}

}