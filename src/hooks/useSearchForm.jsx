import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ticketApiService, debounce } from "../services/ticketApiService";

export const useSearchForm = () => {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    departureDate: null,
    returnDate: null,
  });

  const [suggestions, setSuggestions] = useState({
    from: [],
    to: [],
  });
  const [focusedField, setFocusedField] = useState(null);

  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  const searchCities = async (query, field) => {
    if (query.length < 2) {
      setSuggestions((prev) => ({ ...prev, [field]: [] }));
      return;
    }

    try {
      const cities = await ticketApiService.searchCities(query);
      setSuggestions((prev) => ({ ...prev, [field]: cities }));
    } catch (error) {
      setSuggestions((prev) => ({ ...prev, [field]: [] }));
    }
  };

  const debouncedSearch = useCallback(
    debounce((query, field) => {
      searchCities(query, field);
    }, 300),
    [searchCities]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData({
      ...searchData,
      [name]: value,
    });

    if (name === "from" || name === "to") {
      debouncedSearch(value, name);
    }
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setFocusedField(null);
      setSuggestions({ from: [], to: [] });
    }, 200);
  };

  const handleSuggestionClick = (field, city) => {
    setSearchData({
      ...searchData,
      [field]: city.name,
    });
    setSuggestions((prev) => ({ ...prev, [field]: [] }));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fromInputRef.current && !fromInputRef.current.contains(e.target)) {
        setSuggestions((prev) => ({ ...prev, from: [] }));
      }
      if (toInputRef.current && !toInputRef.current.contains(e.target)) {
        setSuggestions((prev) => ({ ...prev, to: [] }));
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleDepartureDateChange = (date) => {
    setSearchData({
      ...searchData,
      departureDate: date,
      returnDate:
        searchData.returnDate && date && searchData.returnDate < date
          ? null
          : searchData.returnDate,
    });
  };

  const handleReturnDateChange = (date) => {
    setSearchData({
      ...searchData,
      returnDate: date,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!searchData.from || !searchData.to || !searchData.departureDate) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    navigate("/tickets", {
      state: {
        searchParams: searchData,
      },
    });
  };

  return {
    searchData,
    suggestions,
    focusedField,
    fromInputRef,
    toInputRef,
    handleInputChange,
    handleFocus,
    handleBlur,
    handleSuggestionClick,
    handleDepartureDateChange,
    handleReturnDateChange,
    handleSubmit,
  };
};
