import { useState, useEffect } from 'react';
import { jobAPI } from '../services/jobAPI';

export const useJobs = (filters = {}, page = 1) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await jobAPI.fetchJobs({ ...filters, page, limit: 6 });
        if (result.success) {
          setJobs(result.data);
          setPagination(result.pagination);
        } else {
          setError('Failed to load jobs');
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [filters.search, filters.experience, filters.location, filters.type, page]);

  return { jobs, loading, error, pagination };
};
