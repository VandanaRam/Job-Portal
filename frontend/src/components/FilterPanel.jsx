import React from 'react';
import '../styles/FilterPanel.css';

const FilterPanel = ({ filters, onFilterChange }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleExperienceChange = (e) => {
    onFilterChange({ ...filters, experience: e.target.value });
  };

  const handleLocationChange = (e) => {
    onFilterChange({ ...filters, location: e.target.value });
  };

  const handleTypeChange = (e) => {
    onFilterChange({ ...filters, type: e.target.value });
  };

  const handleReset = () => {
    onFilterChange({ search: '', experience: '', location: '', type: '' });
  };

  return (
    <div className="filter-panel">
      <h3 className="filter-title">Search & Filter Jobs</h3>

      <div className="filter-group">
        <label htmlFor="search-input">Search Jobs</label>
        <input
          id="search-input"
          type="text"
          placeholder="Search by title, company, skills..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="experience-select">Experience Level</label>
        <select
          id="experience-select"
          value={filters.experience || ''}
          onChange={handleExperienceChange}
          className="filter-select"
        >
          <option value="">All Experience Levels</option>
          <option value="0">Fresher (0+ years)</option>
          <option value="2">2+ years</option>
          <option value="3">3+ years</option>
          <option value="5">5+ years</option>
          <option value="7">7+ years</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="location-select">Location</label>
        <input
          id="location-select"
          type="text"
          placeholder="Enter location..."
          value={filters.location || ''}
          onChange={handleLocationChange}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="type-select">Work Type</label>
        <select
          id="type-select"
          value={filters.type || ''}
          onChange={handleTypeChange}
          className="filter-select"
        >
          <option value="">All Work Types</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Onsite">On-site</option>
        </select>
      </div>

      <button className="btn-reset-filters" onClick={handleReset}>
        Reset Filters
      </button>
    </div>
  );
};

export default FilterPanel;
