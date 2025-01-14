import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchProducts = (filter, currentPage) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null); // Reset error state before the fetch
      try {
        const response = await axios.get('https://shop-inventory-rorw.onrender.com/api/products', {
          params: {
            ...filter,
            page: currentPage,
            limit: 9,
            sortOrder: 'asc', // Sort by price ascending
          },
        });

        setProducts(response.data.products);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
        });
      } catch (error) {
        setError('Error fetching products');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter, currentPage]);

  return { products, pagination, loading, error };
};

export default useFetchProducts;
