import { toast } from "react-toastify";
import { Request } from "./request";

// function to update user password with current password
const update = async (data, token, { message = () => { }, loader = () => { } } = {}) => {
  // set current loadinfn state true
  loader(true);

  try {
    // make an api call to backend for updating the password of currently loagged in user with auth token
    const ressponse = await Request.post(`/auth/update-password`, data, token);

    // check if the respoonse status is not 200; throw an error
    if (ressponse.status !== 200) throw new Error(ressponse.data.message);

    // once the response with success status set success message
    message(ressponse.data.message);
    toast.success(ressponse.data.message);
    window.history.back();

  } catch (error) {
    message(error.message);
    toast.error(error.message);
  } finally {
    loader(false);
  }
}



export default { update };