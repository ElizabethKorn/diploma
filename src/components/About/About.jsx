import "./About.css";

const About = () => {
  return (
    <section className="about-section" id="о-нас">
      <div className="about-orange-line"></div>

      <div className="about-container">
        <h2 className="about-title">О НАС</h2>
        <div className="about-content">

          <div className="about-vertical-line"></div>

          <div className="about-text">
            <p>
              Мы рады видеть вас! Мы работаем для Вас с 2003 года. 14 лет мы
              наблюдаем, как с каждым днем все больше людей заказывают жд билеты
              через интернет.
            </p>

            <p>
              Сегодня можно заказать железнодорожные билеты онлайн всего в 2
              клика, но стоит ли это делать?
              <br />
              Мы расскажем о преимуществах заказа через интернет.
            </p>

            <p className="about-bold">
              Покупать жд билеты дешево можно за 90 суток до отправления поезда.
              <br />
              Благодаря динамическому ценообразованию цена на билеты в это время
              самая низкая.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
