const API_BASE_URL = "https://students.netoservices.ru/fe-diplom";

export const ticketApiService = {
  // Поиск городов
  async searchCities(query) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/routes/cities?name=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.map((city) => ({
        id: city._id,
        name: city.name,
      }));
    } catch (error) {
      console.error('Error searching cities:', error);
      throw error;
    }
  },

  // Поиск маршрутов
  async searchRoutes(params) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(
        `${API_BASE_URL}/routes?${queryString}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching routes:', error);
      throw error;
    }
  }
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};