import React, { useState } from "react";
import ReviewCard from "../ReviewCard/ReviewCard";
import "./Reviews.css";

import user1 from "../../assets/images/rev1.png";
import user2 from "../../assets/images/rev2.png";
import user3 from "../../assets/images/rev1.png";
import user4 from "../../assets/images/rev2.png";

const Reviews = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const reviewsData = [
    {
      id: 1,
      author: "Екатерина Вальнова",
      text: "Доброжелательные подсказки — на всех этапах помогут правильно заполнить поля и без затруднений купить авиа или ж/д билет, даже если вы заказываете онлайн билет впервые.",
      photo: user1,
    },
    {
      id: 2,
      author: "Евгений Стрыкало",
      text: "СМС сопровождение до посадки Сразу после оплаты ж/д билетов и за 3 часа до отправления мы пришлем вам СМС-напоминание о посадке.",
      photo: user2,
    },
    {
      id: 3,
      author: "Анна Иванова",
      text: "Отличный сервис! Быстрое оформление и удобная система оплаты. Рекомендую всем друзьям.",
      photo: user3,
    },
    {
      id: 4,
      author: "Петр Сидоров",
      text: "Очень понравилось обслуживание. Все четко, быстро и без лишних вопросов. Буду пользоваться еще!",
      photo: user4,
    },
  ];

  const slides = [];
  for (let i = 0; i < reviewsData.length; i += 2) {
    slides.push(reviewsData.slice(i, i + 2));
  }

  const handleDotClick = (index) => {
    setActiveSlide(index);
  };

  return (
    <section className="reviews-section" id="отзывы">
      <div className="reviews-container">
        <h2 className="reviews-title">ОТЗЫВЫ</h2>

        <div className="reviews-grid">
          {slides[activeSlide]?.map((review) => (
            <ReviewCard
              key={review.id}
              author={review.author}
              text={review.text}
              photo={review.photo}
            />
          ))}
        </div>

        <div className="reviews-pagination">
          <div className="pagination-dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === activeSlide ? "active" : ""}`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
