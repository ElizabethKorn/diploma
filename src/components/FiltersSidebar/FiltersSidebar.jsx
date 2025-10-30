import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/locale";
import "./FiltersSidebar.css";
import calendar from "../../assets/images/calendar.png";
import TimeRangeSlider from "../TimeRangeSlider/TimeRangeSlider";
import coupeIcon from "../../assets/images/coupe.png";
import platzkartIcon from "../../assets/images/plazkart.png";
import seatedIcon from "../../assets/images/seat.png";
import luxuryIcon from "../../assets/images/lux.png";
import wifiIcon from "../../assets/images/wi-fi.png";
import expressIcon from "../../assets/images/express.png";
import plusIcon from "../../assets/images/plus.png";
import departureIcon from "../../assets/images/departure.png";
import plusHoverIcon from "../../assets/images/plusHover.png";
import plusActiveIcon from "../../assets/images/minus.png";

const FiltersSidebar = ({
  filters,
  onFilterChange,
  priceRange,
  searchParams,
}) => {
  const [selectedMinPrice, setSelectedMinPrice] = useState(
    filters.priceRange[0]
  );
  const [selectedCurrentPrice, setSelectedCurrentPrice] = useState(
    filters.priceRange[1]
  );
  const [selectedCoachTypes, setSelectedCoachTypes] = useState(
    filters.coachTypes || []
  );
  const [selectedOptions, setSelectedOptions] = useState({
    wifi: filters.hasWiFi || false,
    express: filters.isExpress || false,
  });
  const [dates, setDates] = useState({
    departureDate: searchParams?.departureDate || null,
    returnDate: searchParams?.returnDate || null,
  });
  const [expandedSections, setExpandedSections] = useState({
    departure: false,
    return: false,
  });
  const [hoveredSections, setHoveredSections] = useState({
    departure: false,
    return: false,
  });
  const [timeRanges, setTimeRanges] = useState({
    departure: {
      departureStart: filters.timeRanges?.departure?.departureStart || 0,
      departureEnd: filters.timeRanges?.departure?.departureEnd || 24,
      arrivalStart: filters.timeRanges?.departure?.arrivalStart || 0,
      arrivalEnd: filters.timeRanges?.departure?.arrivalEnd || 24,
    },
    return: {
      departureStart: filters.timeRanges?.return?.departureStart || 0,
      departureEnd: filters.timeRanges?.return?.departureEnd || 24,
      arrivalStart: filters.timeRanges?.return?.arrivalStart || 0,
      arrivalEnd: filters.timeRanges?.return?.arrivalEnd || 24,
    },
  });

  // Синхронизация с внешними фильтрами
  useEffect(() => {
    if (filters.priceRange[0] !== selectedMinPrice) {
      setSelectedMinPrice(filters.priceRange[0]);
    }
    if (filters.priceRange[1] !== selectedCurrentPrice) {
      setSelectedCurrentPrice(filters.priceRange[1]);
    }

    if (
      JSON.stringify(filters.coachTypes) !== JSON.stringify(selectedCoachTypes)
    ) {
      setSelectedCoachTypes(filters.coachTypes || []);
    }

    if (
      filters.hasWiFi !== selectedOptions.wifi ||
      filters.isExpress !== selectedOptions.express
    ) {
      setSelectedOptions({
        wifi: filters.hasWiFi || false,
        express: filters.isExpress || false,
      });
    }

    if (
      filters.timeRanges &&
      JSON.stringify(filters.timeRanges) !== JSON.stringify(timeRanges)
    ) {
      setTimeRanges(filters.timeRanges);
    }
  }, [filters]);

  //даты из searchParams
  useEffect(() => {
    if (searchParams) {
      setDates({
        departureDate: searchParams.departureDate || null,
        returnDate: searchParams.returnDate || null,
      });
    }
  }, [searchParams]);

  const coachTypes = [
    {
      id: "coupe",
      name: "Купе",
      icon: coupeIcon,
    },
    {
      id: "platzkart",
      name: "Плацкарт",
      icon: platzkartIcon,
    },
    {
      id: "seated",
      name: "Сидячий",
      icon: seatedIcon,
    },
    {
      id: "luxury",
      name: "Люкс",
      icon: luxuryIcon,
    },
  ];

  const additionalOptions = [
    {
      id: "wifi",
      name: "Wi-Fi",
      icon: wifiIcon,
    },
    {
      id: "express",
      name: "Экспресс",
      icon: expressIcon,
    },
  ];

  const handleCoachTypeChange = (coachType) => {
    const newSelected = selectedCoachTypes.includes(coachType)
      ? selectedCoachTypes.filter((type) => type !== coachType)
      : [...selectedCoachTypes, coachType];

    setSelectedCoachTypes(newSelected);
    onFilterChange({
      ...filters,
      coachTypes: newSelected,
    });
  };

  const handleOptionChange = (option) => {
    const newOptions = {
      ...selectedOptions,
      [option]: !selectedOptions[option],
    };

    setSelectedOptions(newOptions);
    onFilterChange({
      ...filters,
      hasWiFi: newOptions.wifi,
      isExpress: newOptions.express,
    });
  };

  const handleMinPriceChange = (price) => {
    const newMinPrice = Math.min(price, selectedCurrentPrice);
    setSelectedMinPrice(newMinPrice);

    if (filters.priceRange[0] !== newMinPrice) {
      onFilterChange({
        ...filters,
        priceRange: [newMinPrice, selectedCurrentPrice],
      });
    }
  };

  const handleCurrentPriceChange = (price) => {
    const newCurrentPrice = Math.max(price, selectedMinPrice);
    setSelectedCurrentPrice(newCurrentPrice);

    if (filters.priceRange[1] !== newCurrentPrice) {
      onFilterChange({
        ...filters,
        priceRange: [selectedMinPrice, newCurrentPrice],
      });
    }
  };

  const handleDepartureDateChange = (date) => {
    const newDates = {
      ...dates,
      departureDate: date,
    };
    setDates(newDates);
  };

  const handleReturnDateChange = (date) => {
    const newDates = {
      ...dates,
      returnDate: date,
    };
    setDates(newDates);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleMouseEnter = (section) => {
    setHoveredSections((prev) => ({
      ...prev,
      [section]: true,
    }));
  };

  const handleMouseLeave = (section) => {
    setHoveredSections((prev) => ({
      ...prev,
      [section]: false,
    }));
  };

  // Функция для получения правильной иконки плюсика
  const getPlusIcon = (section) => {
    if (expandedSections[section]) {
      return plusActiveIcon;
    }
    if (hoveredSections[section]) {
      return plusHoverIcon;
    }
    return plusIcon;
  };

  const handleTimeRangeChange = (direction, type, value) => {
    setTimeRanges((prev) => {
      const newRanges = {
        ...prev,
        [direction]: {
          ...prev[direction],
          [type]: value,
        },
      };

      const currentValue = filters.timeRanges?.[direction]?.[type];
      if (currentValue !== value) {
        onFilterChange({
          ...filters,
          timeRanges: newRanges,
        });
      }

      return newRanges;
    });
  };

  // Рассчитываем позиции для заполненной области
  const getFillPosition = () => {
    const minPercent =
      ((selectedMinPrice - priceRange[0]) / (priceRange[1] - priceRange[0])) *
      100;
    const currentPercent =
      ((selectedCurrentPrice - priceRange[0]) /
        (priceRange[1] - priceRange[0])) *
      100;

    return {
      left: `${minPercent}%`,
      width: `${currentPercent - minPercent}%`,
    };
  };

  // Функция для рендеринга ползунков времени
  const renderTimeSliders = (direction) => {
    if (!expandedSections[direction]) return null;

    return (
      <div className="filter-time-sliders">
        <TimeRangeSlider
          title="Время отбытия"
          startTime={timeRanges[direction].departureStart}
          endTime={timeRanges[direction].departureEnd}
          onStartTimeChange={(value) =>
            handleTimeRangeChange(direction, "departureStart", value)
          }
          onEndTimeChange={(value) =>
            handleTimeRangeChange(direction, "departureEnd", value)
          }
        />

        <TimeRangeSlider
          title="Время прибытия"
          startTime={timeRanges[direction].arrivalStart}
          endTime={timeRanges[direction].arrivalEnd}
          onStartTimeChange={(value) =>
            handleTimeRangeChange(direction, "arrivalStart", value)
          }
          onEndTimeChange={(value) =>
            handleTimeRangeChange(direction, "arrivalEnd", value)
          }
        />
      </div>
    );
  };

  return (
    <div className="filters-sidebar">
      <div className="filter-section">
        <h3 className="filter-title">Даты поездки</h3>
        <div className="date-side-section">
          <div className="date-side-fields">
            <div className="form-group">
              <DatePicker
                selected={dates.departureDate}
                onChange={handleDepartureDateChange}
                locale={ru}
                dateFormat="dd.MM.yyyy"
                placeholderText="Туда"
                className="date-picker-input"
                clearButtonTitle="Очистить"
                showPopperArrow={false}
                calendarClassName="custom-calendar"
              />
              <img src={calendar} alt="Calendar" className="input-icon" />
            </div>
            <div className="form-group">
              <DatePicker
                selected={dates.returnDate}
                onChange={handleReturnDateChange}
                minDate={dates.departureDate}
                locale={ru}
                dateFormat="dd.MM.yyyy"
                placeholderText="Обратно"
                className="date-picker-input"
                clearButtonTitle="Очистить"
                showPopperArrow={false}
                calendarClassName="custom-calendar"
              />
              <img src={calendar} alt="Calendar" className="input-icon" />
            </div>
          </div>
        </div>
      </div>

      <div className="section-divider"></div>

      <div className="filter-section">
        <div className="all-options-toggle">
          {coachTypes.map((coach) => (
            <div key={coach.id} className="option-toggle-item">
              <label className="option-toggle-label">
                <input
                  type="checkbox"
                  checked={selectedCoachTypes.includes(coach.id)}
                  onChange={() => handleCoachTypeChange(coach.id)}
                  className="option-toggle-input"
                />
                <div className="option-toggle-content">
                  <img
                    src={coach.icon}
                    alt={coach.name}
                    className="option-icon"
                  />
                  <span className="option-name">{coach.name}</span>
                </div>
                <div className="toggle-slider">
                  <div className="toggle-slider-track"></div>
                  <div className="toggle-slider-thumb"></div>
                </div>
              </label>
            </div>
          ))}

          {additionalOptions.map((option) => (
            <div key={option.id} className="option-toggle-item">
              <label className="option-toggle-label">
                <input
                  type="checkbox"
                  checked={selectedOptions[option.id]}
                  onChange={() => handleOptionChange(option.id)}
                  className="option-toggle-input"
                />
                <div className="option-toggle-content">
                  <img
                    src={option.icon}
                    alt={option.name}
                    className="option-icon"
                  />
                  <span className="option-name">{option.name}</span>
                </div>
                <div className="toggle-slider">
                  <div className="toggle-slider-track"></div>
                  <div className="toggle-slider-thumb"></div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="section-divider"></div>

      <div className="filter-section">
        <h3 className="filter-title">Стоимость</h3>
        <div className="price-filter-final">
          <div className="price-labels-top">
            <span className="price-label-from">от</span>
            <span className="price-label-to">до</span>
          </div>
          <div className="price-slider-final-container">
            <div className="price-slider-track-final"></div>
            <div
              className="price-slider-fill-final"
              style={getFillPosition()}
            ></div>
            <input
              type="range"
              min={priceRange[0]}
              max={priceRange[1]}
              step="1"
              value={selectedMinPrice}
              onChange={(e) => handleMinPriceChange(Number(e.target.value))}
              className="price-slider-min"
            />
            <input
              type="range"
              min={priceRange[0]}
              max={priceRange[1]}
              step="1"
              value={selectedCurrentPrice}
              onChange={(e) => handleCurrentPriceChange(Number(e.target.value))}
              className="price-slider-max"
            />
          </div>
          <div className="price-values-final">
            <span className="price-min-final">
              {selectedMinPrice.toLocaleString("ru-RU")}
            </span>
            <span className="price-current-final">
              {selectedCurrentPrice.toLocaleString("ru-RU")}
            </span>
            <span className="price-max-final">
              {priceRange[1].toLocaleString("ru-RU")}
            </span>
          </div>
        </div>
      </div>

      <div className="section-divider"></div>

      <div className="filter-section">
        <div className="filter-time-section">
          <div
            className="filter-time-header"
            onClick={() => toggleSection("departure")}
            onMouseEnter={() => handleMouseEnter("departure")}
            onMouseLeave={() => handleMouseLeave("departure")}
          >
            <div className="filter-time-title-container">
              <img
                src={departureIcon}
                alt="Departure"
                className="filter-time-icon"
              />
              <span className="filter-time-title">Туда</span>
            </div>
            <img
              src={getPlusIcon("departure")}
              alt="Expand"
              className="filter-time-arrow"
            />
          </div>
          {renderTimeSliders("departure")}
        </div>

        <div className="time-section-divider"></div>

        <div className="filter-time-section">
          <div
            className="filter-time-header"
            onClick={() => toggleSection("return")}
            onMouseEnter={() => handleMouseEnter("return")}
            onMouseLeave={() => handleMouseLeave("return")}
          >
            <div className="filter-time-title-container">
              <img
                src={departureIcon}
                alt="Return"
                className="filter-time-icon"
              />
              <span className="filter-time-title">Обратно</span>
            </div>
            <img
              src={getPlusIcon("return")}
              alt="Expand"
              className="filter-time-arrow"
            />
          </div>
          {renderTimeSliders("return")}
        </div>
      </div>
    </div>
  );
};

export default FiltersSidebar;
