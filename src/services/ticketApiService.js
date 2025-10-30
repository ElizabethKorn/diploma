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
      console.error("Error searching cities:", error);
      throw error;
    }
  },

  // Поиск маршрутов
  async searchRoutes(params) {
    try {
      // Очищаем параметры от пустых значений
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value != null && value !== ""
        )
      );

      const queryString = new URLSearchParams(cleanParams).toString();
      const response = await fetch(`${API_BASE_URL}/routes?${queryString}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error searching routes:", error);
      throw error;
    }
  },

  // Получение последних билетов
  async getLastTickets() {
    try {
      const response = await fetch(`${API_BASE_URL}/routes/last`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data.map((ticket) => {
        return {
          id: ticket.departure?._id || ticket._id,
          from: {
            city: {
              name:
                ticket.departure?.from?.city?.name ||
                ticket.from?.city?.name ||
                "",
            },
            railway_station: {
              name:
                ticket.departure?.from?.railway_station_name ||
                ticket.departure?.from?.railway_station?.name ||
                ticket.from?.railway_station_name ||
                "",
            },
          },
          to: {
            city: {
              name:
                ticket.departure?.to?.city?.name || ticket.to?.city?.name || "",
            },
            railway_station: {
              name:
                ticket.departure?.to?.railway_station_name ||
                ticket.departure?.to?.railway_station?.name ||
                ticket.to?.railway_station_name ||
                "",
            },
          },
          min_price: ticket.min_price || ticket.departure?.min_price || 0,
        };
      });
    } catch (error) {
      console.error("Error fetching last tickets:", error);
      throw error;
    }
  },

  // Получение информации о местах в вагоне
  async getSeats(routeId, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(
        `${API_BASE_URL}/routes/${routeId}/seats?${queryString}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching seats:", error);
      throw error;
    }
  },

  // Бронирование места
  async bookSeat(seatData) {
    try {
      const response = await fetch(`${API_BASE_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seatData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error booking seat:", error);
      throw error;
    }
  },
};

// Функция debounce для оптимизации поиска
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Вспомогательные функции для работы с датами
export const dateUtils = {
  // Преобразование timestamp в Date
  timestampToDate: (timestamp) => new Date(timestamp * 1000),

  // Форматирование даты
  formatDate: (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("ru-RU");
  },

  // Форматирование даты и времени
  formatDateTime: (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString("ru-RU");
  },

  // Преобразование Date в формат YYYY-MM-DD для API
  formatDateForAPI: (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },
};

// Функции для работы с типами вагонов и ценами
export const coachUtils = {
  // Получение доступных типов вагонов с минимальными ценами
  getAvailableCoachTypes: (departure) => {
    const coaches = [];
    const priceInfo = departure.price_info || {};

    // Люкс (СВ) - берем минимальную цену из top_price, bottom_price или price
    if (departure.have_first_class && priceInfo.first) {
      const firstClass = priceInfo.first;
      const minPrice = Math.min(
        firstClass.top_price || Infinity,
        firstClass.bottom_price || Infinity,
        firstClass.price || Infinity
      );

      coaches.push({
        type: "luxury",
        name: "Люкс",
        price: minPrice !== Infinity ? minPrice : departure.min_price || 4950,
        seats: departure.available_seats_info?.first || 15,
        topPrice: firstClass.top_price || minPrice,
        bottomPrice: firstClass.bottom_price || minPrice,
        topSeats: Math.floor((departure.available_seats_info?.first || 15) / 2),
        bottomSeats: Math.ceil(
          (departure.available_seats_info?.first || 15) / 2
        ),
        hasWifi: departure.have_wifi,
        hasAirConditioning: departure.have_air_conditioning,
        isExpress: departure.is_express,
      });
    }

    // Купе - берем минимальную цену
    if (departure.have_second_class && priceInfo.second) {
      const secondClass = priceInfo.second;
      const minPrice = Math.min(
        secondClass.top_price || Infinity,
        secondClass.bottom_price || Infinity
      );

      coaches.push({
        type: "coupe",
        name: "Купе",
        price: minPrice !== Infinity ? minPrice : departure.min_price || 3820,
        seats: departure.available_seats_info?.second || 24,
        topPrice: secondClass.top_price || minPrice,
        bottomPrice: secondClass.bottom_price || minPrice,
        topSeats: Math.floor(
          (departure.available_seats_info?.second || 24) / 2
        ),
        bottomSeats: Math.ceil(
          (departure.available_seats_info?.second || 24) / 2
        ),
        hasWifi: departure.have_wifi,
        hasAirConditioning: departure.have_air_conditioning,
        isExpress: departure.is_express,
      });
    }

    // Плацкарт - берем минимальную цену из всех типов мест
    if (departure.have_third_class && priceInfo.third) {
      const thirdClass = priceInfo.third;
      const minPrice = Math.min(
        thirdClass.top_price || Infinity,
        thirdClass.bottom_price || Infinity,
        thirdClass.side_price || Infinity
      );

      coaches.push({
        type: "platzkart",
        name: "Плацкарт",
        price: minPrice !== Infinity ? minPrice : departure.min_price || 2530,
        seats: departure.available_seats_info?.third || 36,
        topPrice: thirdClass.top_price || minPrice,
        bottomPrice: thirdClass.bottom_price || minPrice,
        sidePrice: thirdClass.side_price || minPrice,
        topSeats: Math.floor(
          (departure.available_seats_info?.third || 36) * 0.4
        ),
        bottomSeats: Math.floor(
          (departure.available_seats_info?.third || 36) * 0.4
        ),
        sideSeats: Math.ceil(
          (departure.available_seats_info?.third || 36) * 0.2
        ),
        hasWifi: departure.have_wifi,
        hasAirConditioning: departure.have_air_conditioning,
        isExpress: departure.is_express,
      });
    }

    // Сидячий - берем минимальную цену
    if (departure.have_fourth_class && priceInfo.fourth) {
      const fourthClass = priceInfo.fourth;
      const minPrice = Math.min(
        fourthClass.top_price || Infinity,
        fourthClass.bottom_price || Infinity
      );

      coaches.push({
        type: "seated",
        name: "Сидячий",
        price: minPrice !== Infinity ? minPrice : departure.min_price || 1920,
        seats: departure.available_seats_info?.fourth || 62,
        topPrice: fourthClass.top_price || minPrice,
        bottomPrice: fourthClass.bottom_price || minPrice,
        topSeats: Math.floor(
          (departure.available_seats_info?.fourth || 62) / 2
        ),
        bottomSeats: Math.ceil(
          (departure.available_seats_info?.fourth || 62) / 2
        ),
        hasWifi: departure.have_wifi,
        hasAirConditioning: departure.have_air_conditioning,
        isExpress: departure.is_express,
      });
    }

    // Если нет конкретных типов, показываем общую минимальную цену
    if (coaches.length === 0 && departure.min_price) {
      coaches.push({
        type: "general",
        name: "Общий",
        price: departure.min_price,
        seats:
          departure.total_avaliable_seats || departure.available_seats || 50,
        topPrice: departure.min_price * 0.9,
        bottomPrice: departure.min_price * 1.1,
        topSeats: Math.floor((departure.total_avaliable_seats || 50) / 2),
        bottomSeats: Math.ceil((departure.total_avaliable_seats || 50) / 2),
        hasWifi: departure.have_wifi,
        hasAirConditioning: departure.have_air_conditioning,
        isExpress: departure.is_express,
      });
    }

    return coaches;
  },

  // Получение минимальной и максимальной цены из списка маршрутов
  getPriceRange: (routes) => {
    if (routes.length === 0) return [0, 10000];

    const allPrices = routes.flatMap((route) => {
      const departure = route.departure || route;
      const prices = [];

      // Добавляем минимальную цену маршрута
      if (departure.min_price) {
        prices.push(departure.min_price);
      }

      // Добавляем цены из price_info если есть
      const priceInfo = departure.price_info || {};
      if (priceInfo.first) {
        prices.push(
          priceInfo.first.top_price,
          priceInfo.first.bottom_price,
          priceInfo.first.price
        );
      }
      if (priceInfo.second) {
        prices.push(priceInfo.second.top_price, priceInfo.second.bottom_price);
      }
      if (priceInfo.third) {
        prices.push(
          priceInfo.third.top_price,
          priceInfo.third.bottom_price,
          priceInfo.third.side_price
        );
      }
      if (priceInfo.fourth) {
        prices.push(priceInfo.fourth.top_price, priceInfo.fourth.bottom_price);
      }

      return prices.filter((price) => price && price !== Infinity);
    });

    if (allPrices.length === 0) return [0, 10000];

    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);

    // Округляем до сотен для красоты
    return [Math.floor(minPrice / 100) * 100, Math.ceil(maxPrice / 100) * 100];
  },
};

// Вспомогательные функции для форматирования
export const formatUtils = {
  formatPrice: (price) => {
    if (!price || price === Infinity) return "--";
    return new Intl.NumberFormat("ru-RU").format(price);
  },

  formatCityName: (cityName) => {
    if (!cityName) return "";
    return cityName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  },

  formatTime: (timestamp) => {
    if (!timestamp) return "--:--";
    return new Date(timestamp * 1000).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  formatDuration: (seconds) => {
    if (!seconds) return "--ч --м";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}ч ${minutes}м`;
  },
};
