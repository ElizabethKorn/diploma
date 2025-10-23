import "./Hero.css";
import SearchForm from "../SearchForm/SearchForm";
import "../SearchForm/SearchFormTickets.css";

const Hero = ({ variant = "home"}) => {
  return (
    <section className={`hero hero-${variant}`}>
      <div className="hero-overlay">
        <div className="hero-container">
          {/* Для главной страницы */}
          {variant === "home" && (
            <>
              <div className="heroTitle">
                <h1 className="hero-title">
                  Вся жизнь - <span className="bold-text">путешествие!</span>
                </h1>
              </div>
              <SearchForm />
            </>
          )}

          {/* Для страницы билетов*/}
          {variant === "tickets" && (
            <div className="tickets-hero-content">
              <SearchForm className="tickets-page" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
