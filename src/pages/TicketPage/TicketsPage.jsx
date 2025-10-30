/*import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import "./TicketsPage.css";
import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import MenuTabs from "../../components/MenuTabs/MenuTabs";
import Footer from "../../components/Footer/Footer";
import TicketCard from "../../components/TicketCard/TicketCard";
import SortPanel from "../../components/SortPanel/SortPanel";
import FiltersSidebar from "../../components/FiltersSidebar/FiltersSidebar";
import LoadingPage from "../../pages/LoadingPage/LoadingPage";
import {
  ticketApiService,
  coachUtils,
  dateUtils,
} from "../../services/ticketApiService";
import LastTickets from "../../components/LastTickets/LastTickets";

const TicketsPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("time");
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Начальное состояние фильтров
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    coachTypes: [],
    hasWiFi: false,
    isExpress: false,
    timeRanges: {
      departure: {
        departureStart: 0,
        departureEnd: 24,
        arrivalStart: 0,
        arrivalEnd: 24,
      },
      return: {
        departureStart: 0,
        departureEnd: 24,
        arrivalStart: 0,
        arrivalEnd: 24,
      },
    },
  });

  const location = useLocation();
  const searchParams = location.state?.searchParams;

  const priceRange = useMemo(() => {
    return coachUtils.getPriceRange(routes);
  }, [routes]);

  useEffect(() => {
    if (
      priceRange[0] > 0 &&
      priceRange[1] > 0 &&
      filters.priceRange[1] === 10000
    ) {
      setFilters((prev) => ({
        ...prev,
        priceRange: priceRange,
      }));
    }
  }, [priceRange, filters.priceRange]);

  useEffect(() => {
    if (searchParams) {
      fetchRoutes(searchParams);
    } else {
      setError("Параметры поиска не найдены");
      setLoading(false);
    }
  }, [searchParams]);

  const fetchRoutes = async (params) => {
    setLoading(true);
    setError(null);

    try {
      const [fromCities, toCities] = await Promise.all([
        ticketApiService.searchCities(params.from),
        ticketApiService.searchCities(params.to),
      ]);

      if (fromCities.length === 0 || toCities.length === 0) {
        setError("Города не найдены");
        setRoutes([]);
        return;
      }

      const fromCityId = fromCities[0].id;
      const toCityId = toCities[0].id;

      const apiParams = {
        from_city_id: fromCityId,
        to_city_id: toCityId,
        date_start:
          params.date_start || dateUtils.formatDateForAPI(params.departureDate),
      };

      if (params.date_end || params.returnDate) {
        apiParams.date_end =
          params.date_end || dateUtils.formatDateForAPI(params.returnDate);
      }

      const data = await ticketApiService.searchRoutes(apiParams);

      if (data.items && data.items.length > 0) {
        setRoutes(data.items);
      } else {
        setRoutes([]);
        setError("Билеты по вашему запросу не найдены");
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
      setError("Произошла ошибка при поиске билетов");
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  // Функция фильтрации маршрутов
  const filterRoutes = useMemo(() => {
    if (!routes.length) return [];

    return routes.filter((route) => {
      const departure = route.departure || route;
      const arrival = route.arrival;

      // Фильтрация по цене
      const price = departure.min_price || 0;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // Фильтрация по типам вагонов
      if (filters.coachTypes.length > 0) {
        const availableCoaches = coachUtils.getAvailableCoachTypes(departure);
        const hasSelectedCoach = availableCoaches.some((coach) =>
          filters.coachTypes.includes(coach.type)
        );
        if (!hasSelectedCoach) {
          return false;
        }
      }

      // Фильтрация по Wi-Fi
      if (filters.hasWiFi && !departure.have_wifi) {
        return false;
      }

      // Фильтрация по экспресс
      if (filters.isExpress && !departure.is_express) {
        return false;
      }

      // Фильтрация по времени отправления/прибытия
      if (filters.timeRanges) {
        // Время отправления туда
        if (filters.timeRanges.departure) {
          const departureTime = new Date(departure.from?.datetime).getHours();
          if (
            departureTime < filters.timeRanges.departure.departureStart ||
            departureTime > filters.timeRanges.departure.departureEnd
          ) {
            return false;
          }
        }

        // Время прибытия туда
        if (filters.timeRanges.departure) {
          const arrivalTime = new Date(departure.to?.datetime).getHours();
          if (
            arrivalTime < filters.timeRanges.departure.arrivalStart ||
            arrivalTime > filters.timeRanges.departure.arrivalEnd
          ) {
            return false;
          }
        }

        // Время отправления обратно (если есть)
        if (arrival && filters.timeRanges.return) {
          const returnDepartureTime = new Date(
            arrival.from?.datetime
          ).getHours();
          if (
            returnDepartureTime < filters.timeRanges.return.departureStart ||
            returnDepartureTime > filters.timeRanges.return.departureEnd
          ) {
            return false;
          }
        }

        // Время прибытия обратно (если есть)
        if (arrival && filters.timeRanges.return) {
          const returnArrivalTime = new Date(arrival.to?.datetime).getHours();
          if (
            returnArrivalTime < filters.timeRanges.return.arrivalStart ||
            returnArrivalTime > filters.timeRanges.return.arrivalEnd
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [routes, filters]);

  // Функция для отображения только нужного количества билетов (пагинация)
  const displayedTickets = useMemo(() => {
    return filterRoutes.slice(0, itemsPerPage);
  }, [filterRoutes, itemsPerPage]);

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    sortRoutes(newSort);
  };

  const sortRoutes = (sortType) => {
    const sorted = [...routes].sort((a, b) => {
      const departureA = a.departure || a;
      const departureB = b.departure || b;

      switch (sortType) {
        case "price":
          return (departureA.min_price || 0) - (departureB.min_price || 0);
        case "time":
          return (
            (departureA.from?.datetime || 0) - (departureB.from?.datetime || 0)
          );
        case "duration":
          return (departureA.duration || 0) - (departureB.duration || 0);
        default:
          return 0;
      }
    });
    setRoutes(sorted);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Функция для изменения количества элементов на странице
  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
  };

  const handleSelectSeats = (routeId, coachType) => {
    //console.log("Select seats for route:", routeId, "coach type:", coachType);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="tickets-page">
      <Header />
      <Hero variant="tickets" />
      <MenuTabs />

      <div className="tickets-content">
        <div className="container">
          <div className="tickets-layout">
            <div className="left">
              <aside className="filter-sidebar">
                <FiltersSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  priceRange={priceRange}
                  searchParams={searchParams}
                />
              </aside>
              <LastTickets />
            </div>

            <main className="tickets-main">
              <SortPanel
                sortBy={sortBy}
                onSortChange={handleSortChange}
                resultsCount={filterRoutes.length}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />

              <div className="tickets-list">
                {error ? (
                  <div className="error-state">
                    <h3>{error}</h3>
                    <p>Попробуйте изменить параметры поиска</p>
                  </div>
                ) : displayedTickets.length > 0 ? (
                  displayedTickets.map((route) => (
                    <TicketCard
                      key={route._id || route.departure?._id}
                      route={route}
                      searchParams={searchParams}
                      onSelectSeats={handleSelectSeats}
                    />
                  ))
                ) : (
                  <div className="no-results">
                    <h3>Билеты не найдены</h3>
                    <p>Попробуйте изменить параметры фильтров</p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TicketsPage;
*/

import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import "./TicketsPage.css";
import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import MenuTabs from "../../components/MenuTabs/MenuTabs";
import Footer from "../../components/Footer/Footer";
import TicketCard from "../../components/TicketCard/TicketCard";
import SortPanel from "../../components/SortPanel/SortPanel";
import FiltersSidebar from "../../components/FiltersSidebar/FiltersSidebar";
import LoadingPage from "../../pages/LoadingPage/LoadingPage";
import {
  ticketApiService,
  coachUtils,
  formatUtils,
  dateUtils,
} from "../../services/ticketApiService";
import LastTickets from "../../components/LastTickets/LastTickets";

const TicketsPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("time");
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Начальное состояние фильтров
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    coachTypes: [],
    hasWiFi: false,
    isExpress: false,
    timeRanges: {
      departure: {
        departureStart: 0,
        departureEnd: 24,
        arrivalStart: 0,
        arrivalEnd: 24,
      },
      return: {
        departureStart: 0,
        departureEnd: 24,
        arrivalStart: 0,
        arrivalEnd: 24,
      },
    },
  });

  const location = useLocation();
  const searchParams = location.state?.searchParams;

  // Используем утилиту для вычисления диапазона цен
  const priceRange = useMemo(() => {
    return coachUtils.getPriceRange(routes);
  }, [routes]);

  // Обновляем фильтры при изменении диапазона цен ТОЛЬКО при первоначальной загрузке
  useEffect(() => {
    if (
      priceRange[0] > 0 &&
      priceRange[1] > 0 &&
      filters.priceRange[1] === 10000
    ) {
      setFilters((prev) => ({
        ...prev,
        priceRange: priceRange,
      }));
    }
  }, [priceRange, filters.priceRange]);

  useEffect(() => {
    if (searchParams) {
      fetchRoutes(searchParams);
    } else {
      setError("Параметры поиска не найдены");
      setLoading(false);
    }
  }, [searchParams]);

  const fetchRoutes = async (params) => {
    setLoading(true);
    setError(null);

    try {
      // Убрали console.log для production
      // console.log("Searching with params:", params);

      const [fromCities, toCities] = await Promise.all([
        ticketApiService.searchCities(params.from),
        ticketApiService.searchCities(params.to),
      ]);

      if (fromCities.length === 0 || toCities.length === 0) {
        setError("Города не найдены");
        setRoutes([]);
        return;
      }

      const fromCityId = fromCities[0].id;
      const toCityId = toCities[0].id;

      const apiParams = {
        from_city_id: fromCityId,
        to_city_id: toCityId,
        date_start:
          params.date_start || dateUtils.formatDateForAPI(params.departureDate),
      };

      if (params.date_end || params.returnDate) {
        apiParams.date_end =
          params.date_end || dateUtils.formatDateForAPI(params.returnDate);
      }

      // Убрали console.log для production
      // console.log("API params:", apiParams);

      const data = await ticketApiService.searchRoutes(apiParams);

      // Убрали console.log для production
      // console.log("API response:", data);

      if (data.items && data.items.length > 0) {
        setRoutes(data.items);
      } else {
        setRoutes([]);
        setError("Билеты по вашему запросу не найдены");
      }
    } catch (error) {
      // Для ошибок можно оставить console.error, но лучше использовать систему логирования
      console.error("Error fetching routes:", error);
      setError("Произошла ошибка при поиске билетов");
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  // Функция фильтрации маршрутов
  const filterRoutes = useMemo(() => {
    if (!routes.length) return [];

    return routes.filter((route) => {
      const departure = route.departure || route;
      const arrival = route.arrival;

      // Фильтрация по цене
      const price = departure.min_price || 0;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // Фильтрация по типам вагонов
      if (filters.coachTypes.length > 0) {
        const availableCoaches = coachUtils.getAvailableCoachTypes(departure);
        const hasSelectedCoach = availableCoaches.some((coach) =>
          filters.coachTypes.includes(coach.type)
        );
        if (!hasSelectedCoach) {
          return false;
        }
      }

      // Фильтрация по Wi-Fi
      if (filters.hasWiFi && !departure.have_wifi) {
        return false;
      }

      // Фильтрация по экспресс
      if (filters.isExpress && !departure.is_express) {
        return false;
      }

      // Фильтрация по времени отправления/прибытия
      if (filters.timeRanges) {
        // Время отправления туда
        if (filters.timeRanges.departure) {
          const departureTime = new Date(departure.from?.datetime).getHours();
          if (
            departureTime < filters.timeRanges.departure.departureStart ||
            departureTime > filters.timeRanges.departure.departureEnd
          ) {
            return false;
          }
        }

        // Время прибытия туда
        if (filters.timeRanges.departure) {
          const arrivalTime = new Date(departure.to?.datetime).getHours();
          if (
            arrivalTime < filters.timeRanges.departure.arrivalStart ||
            arrivalTime > filters.timeRanges.departure.arrivalEnd
          ) {
            return false;
          }
        }

        // Время отправления обратно (если есть)
        if (arrival && filters.timeRanges.return) {
          const returnDepartureTime = new Date(
            arrival.from?.datetime
          ).getHours();
          if (
            returnDepartureTime < filters.timeRanges.return.departureStart ||
            returnDepartureTime > filters.timeRanges.return.departureEnd
          ) {
            return false;
          }
        }

        // Время прибытия обратно (если есть)
        if (arrival && filters.timeRanges.return) {
          const returnArrivalTime = new Date(arrival.to?.datetime).getHours();
          if (
            returnArrivalTime < filters.timeRanges.return.arrivalStart ||
            returnArrivalTime > filters.timeRanges.return.arrivalEnd
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [routes, filters]);

  // Функция для отображения только нужного количества билетов (пагинация)
  const displayedTickets = useMemo(() => {
    return filterRoutes.slice(0, itemsPerPage);
  }, [filterRoutes, itemsPerPage]);

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    sortRoutes(newSort);
  };

  const sortRoutes = (sortType) => {
    const sorted = [...routes].sort((a, b) => {
      const departureA = a.departure || a;
      const departureB = b.departure || b;

      switch (sortType) {
        case "price":
          return (departureA.min_price || 0) - (departureB.min_price || 0);
        case "time":
          return (
            (departureA.from?.datetime || 0) - (departureB.from?.datetime || 0)
          );
        case "duration":
          return (departureA.duration || 0) - (departureB.duration || 0);
        default:
          return 0;
      }
    });
    setRoutes(sorted);
  };

  const handleFilterChange = (newFilters) => {
    // Убрали console.log для production
    // console.log("Filters changed:", newFilters);
    setFilters(newFilters);
  };

  // Функция для изменения количества элементов на странице
  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
  };

  const handleSelectSeats = (routeId, coachType) => {
    // Убрали console.log для production
    // console.log("Select seats for route:", routeId, "coach type:", coachType);
  };

  // Убрали неиспользуемую функцию getSearchInfo
  // const getSearchInfo = () => {
  //   if (searchParams) {
  //     return {
  //       from: formatUtils.formatCityName(searchParams.from),
  //       to: formatUtils.formatCityName(searchParams.to),
  //       date:
  //         searchParams.date_start ||
  //         (searchParams.departureDate
  //           ? searchParams.departureDate.toLocaleDateString("ru-RU")
  //           : ""),
  //     };
  //   }
  //   return { from: "", to: "", date: "" };
  // };

  // Убрали неиспользуемую переменную searchInfo
  // const searchInfo = getSearchInfo();

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="tickets-page">
      <Header />
      <Hero variant="tickets" />
      <MenuTabs />

      <div className="tickets-content">
        <div className="container">
          <div className="tickets-layout">
            <div className="left">
              <aside className="filter-sidebar">
                <FiltersSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  priceRange={priceRange} // Передаем общий диапазон
                  searchParams={searchParams}
                />
              </aside>
              <LastTickets />
            </div>

            <main className="tickets-main">
              <SortPanel
                sortBy={sortBy}
                onSortChange={handleSortChange}
                resultsCount={filterRoutes.length}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />

              <div className="tickets-list">
                {error ? (
                  <div className="error-state">
                    <h3>{error}</h3>
                    <p>Попробуйте изменить параметры поиска</p>
                  </div>
                ) : displayedTickets.length > 0 ? (
                  displayedTickets.map((route) => (
                    <TicketCard
                      key={route._id || route.departure?._id}
                      route={route}
                      searchParams={searchParams}
                      onSelectSeats={handleSelectSeats}
                    />
                  ))
                ) : (
                  <div className="no-results">
                    <h3>Билеты не найдены</h3>
                    <p>Попробуйте изменить параметры фильтров</p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TicketsPage;
