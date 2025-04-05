import { Request } from '../utils/request';
import { toast } from "react-toastify";
async function all(token, setPositions) {
    try {
        const response = await Request.get('/positions', null, token);
        if (response.status !== 200) throw new Error('Failed to fetch all positions for some reaons');

        setPositions(response.data.position);
    } catch (error) {
        toast.error(error.message);
    }
}

export default { all };