import "./TimeRangeSlider.css";

const TimeRangeSlider = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  title,
}) => {
  const formatTime = (hours) => {
    return `${String(hours).padStart(2, "0")}:00`;
  };

  const handleStartChange = (e) => {
    const value = Math.min(Number(e.target.value), endTime - 1);
    onStartTimeChange(value);
  };

  const handleEndChange = (e) => {
    const value = Math.max(Number(e.target.value), startTime + 1);
    onEndTimeChange(value);
  };

  const getFillPosition = () => {
    const startPercent = (startTime / 24) * 100;
    const endPercent = (endTime / 24) * 100;
    return {
      left: `${startPercent}%`,
      width: `${endPercent - startPercent}%`,
    };
  };

  return (
    <div className="time-range-slider">
      {title && <div className="time-range-title">{title}</div>}

      <div className="time-range-container">
        <div className="time-range-track">
          <div className="time-range-fill" style={getFillPosition()}></div>
        </div>

        <input
          type="range"
          min="0"
          max="24"
          step="1"
          value={startTime}
          onChange={handleStartChange}
          className="time-range-input time-range-start"
        />

        <input
          type="range"
          min="0"
          max="24"
          step="1"
          value={endTime}
          onChange={handleEndChange}
          className="time-range-input time-range-end"
        />
      </div>

      <div className="time-range-values">
        <span className="time-value">{formatTime(startTime)}</span>
        <span className="time-value">{formatTime(endTime)}</span>
      </div>
    </div>
  );
};

export default TimeRangeSlider;
