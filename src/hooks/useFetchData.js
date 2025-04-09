import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useFetchData = (fetchFn, token) => {
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    if (!token) {
      toast.error('Không có token, vui lòng đăng nhập lại');
      return;
    }
    try {
      const res = await fetchFn(token);
      setData(res.data);
    } catch (err) {
      toast.error('Lỗi khi tải dữ liệu: ' + (err.response?.data.message || 'Không rõ'));
      console.error('Fetch error:', err); // Log lỗi để debug
    }
  }, [fetchFn, token]); // fetchFn và token là dependency

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Chỉ phụ thuộc vào fetchData

  return { data, refetch: fetchData };
};