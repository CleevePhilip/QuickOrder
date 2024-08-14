import { useState, useEffect, useMemo } from "react";
import { fetchDataFromServices } from "../services/apiService";

const useFetchAndProcess = (endpoint) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const result = await fetchDataFromServices(endpoint);
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const processedData = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({ ...item, processed: true }));
  }, [data]);

  return { data: processedData, error, fetchData };
};

export default useFetchAndProcess;
