const API_BASE_URL =
  `${import.meta.env.VITE_API_URL}/api/jobs`;
const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const jobAPI = {
  // Fetch all active jobs with filter parameters
  fetchJobs: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.experience) queryParams.append('experience', params.experience);
      if (params.location) queryParams.append('location', params.location);
      if (params.type) queryParams.append('type', params.type);

      const response = await fetch(`${API_BASE_URL}?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  // Fetch a single job's details
  fetchJobById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch job details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  },

  // Apply to a job (Developer only)
  applyForJob: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/apply`, {
        method: 'POST',
        headers: getHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to apply for job');
      return result;
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  },

  // Fetch applications for logged-in developer
  fetchDeveloperApplications: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/developer/applications`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to fetch developer applications');
      return result;
    } catch (error) {
      console.error('Error fetching developer applications:', error);
      throw error;
    }
  },

  // Post a new job (Recruiter only)
  postJob: async (jobData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(jobData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to post job');
      return result;
    } catch (error) {
      console.error('Error posting job:', error);
      throw error;
    }
  },

  // Update an existing job (Recruiter only)
  updateJob: async (id, jobData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(jobData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update job');
      return result;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  // Delete/Deactivate a job listing (Recruiter only)
  deleteJob: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to delete job');
      return result;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  // Fetch jobs posted by the logged-in recruiter
  fetchRecruiterJobs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/recruiter/jobs`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to fetch recruiter jobs');
      return result;
    } catch (error) {
      console.error('Error fetching recruiter jobs:', error);
      throw error;
    }
  },

  // Fetch candidates who applied to a recruiter's job
  fetchJobApplicants: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/applicants`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to fetch job applicants');
      return result;
    } catch (error) {
      console.error('Error fetching job applicants:', error);
      throw error;
    }
  }
};
