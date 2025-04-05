import axios from "axios";

export class Request {
  static baseAddress = import.meta.env.VITE_REACT_APP_API_HOST;

  // Request to handle GET requests

  static async get(route, data = null, token = null) {
    return await axios.get(`${this.baseAddress + route}`, {
      data: data,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
  }

  //request to handle post reqtuests
  static async post(route, newResource, token) {
    return await axios.post(`${this.baseAddress + route}`, newResource, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }

  // Request tso handle PUT requests
  static async put(route, data, token = null) {
    data._method = 'put';
    try {
      const response = await axios.put(`${this.baseAddress + route}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      return error.response || { message: "Error making PUT request" };
    }
  }

  // Request to handle DELETE requests (using DELETE method)
  static async delete(route, token = null) {
    try {
      const response = await axios.delete(`${this.baseAddress + route}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      return error.response || { message: "Error making DELETE request" };
    }
  }
}
