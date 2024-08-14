import axios from "axios";

const apiBase = "http://localhost:8080/auth/admin-page/";

export const fetchDataFromServices = async (endpoint) => {
  const response = await axios.get(`${apiBase}${endpoint}`);
  if (response.data) {
    return response.data.data;
  }
};

export const createData = async (endpoint, data) => {
  try {
    const response = await axios.post(`${apiBase}${endpoint}`, data);
    return response.data.success;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const editData = async (endpoint, data) => {
  try {
    const response = await axios.put(`${apiBase}${endpoint}`, data);
    return response.data.success;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const deleteData = async (endpoint, data) => {
  try {
    const response = await axios.delete(`${apiBase}${endpoint}`, {
      data: data,
    });
    return response.data.success;
  } catch (error) {
    console.log(error);
    return false; // Add this line to handle errors properly
  }
};
