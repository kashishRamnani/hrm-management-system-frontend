import { Request } from "./request";
import { toast } from "react-toastify";
// class to handle all department operations
export class Department {
    // method to fetch all departments
    static async all(token, setDepartments, setMessage, setLoading) {
        setLoading(true);
        try {
            const res = await Request.get('/departments', null, token);
            
            if (res.status !== 200) {
                throw new Error("Failed to fetch departments");
            }
            setDepartments(res.data.department);
        } catch (error) {
            setMessage(error.message);
              toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    // method to add a new department
    static async add(token, newDepartment, setMessage, setErrors) {
        try {
            const res = await Request.post(`/departments`, newDepartment, token);

            if(res.status === 422){
                setErrors(res.data.errors);
                return;
            }

            if (res.status !== 200) {
                throw new Error("Failed to add a new department");
            }
            setMessage(res.data.message);
        } catch (error) {
            setMessage(error.message || "Failed to add a new department");
        }
    }

    // method to update the department record
    static async update(token, updatedData, setMessage) {
        const data = {
            title: updatedData.title,
            _method: 'put',
        };

        try {
            const res = await Request.put(`/departments/${updatedData.id}`, data, token);
            if (res.status !== 200) {
                throw new Error("Failed to update department");
            }
            setMessage(res.data.message);
        } catch (error) {
            setMessage("Failed to update department");
        }
    }

    // method to delete a specified department
    static async delete(id, token, setMessage) {
        try {
            const res = await Request.delete(`/departments/${id}`, token);
            if (res.status !== 200) {
                console.log('An error occurred while deleting the department');
            }
            setMessage(res.data.message);
        } catch (error) {
            setMessage("Failed to delete the department");
        }
    }
}
