import React, { useState } from "react";
import "./SortPanel.css";

const SortPanel = ({
  sortBy,
  onSortChange,
  resultsCount,
  itemsPerPage,
  onItemsPerPageChange,
}) => {
  const [showSortOptions, setShowSortOptions] = useState(false);

  const sortOptions = [
    { value: "time", label: "времени" },
    { value: "price", label: "стоимости" },
    { value: "duration", label: "длительности" },
  ];

  const pageSizeOptions = [5, 10, 20];

  const getCurrentSortLabel = () => {
    const currentOption = sortOptions.find((option) => option.value === sortBy);
    return currentOption ? currentOption.label : "времени";
  };

  return (
    <div className="sort-panel">
      <div className="sort-panel-left">
        <div className="results-count">найдено {resultsCount}</div>
      </div>

      <div className="sort-panel-right">
        <div className="sort-dropdown">
          <span>сортировать по:</span>
          <button
            className="sort-dropdown-toggle"
            onClick={() => setShowSortOptions(!showSortOptions)}
            onBlur={() => setTimeout(() => setShowSortOptions(false), 200)}
          >
            {getCurrentSortLabel()}
          </button>

          {showSortOptions && (
            <div className="sort-dropdown-menu">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`dropdown-item ${
                    sortBy === option.value ? "active" : ""
                  }`}
                  onClick={() => {
                    onSortChange(option.value);
                    setShowSortOptions(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="page-size-selector">
          <span className="page-size-label">показывать по:</span>
          <div className="page-size-buttons">
            {pageSizeOptions.map((size) => (
              <button
                key={size}
                className={`page-size-btn ${
                  itemsPerPage === size ? "active" : ""
                }`}
                onClick={() => onItemsPerPageChange(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortPanel;
