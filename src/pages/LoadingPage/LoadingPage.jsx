import "./LoadingPage.css";
import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import Footer from "../../components/Footer/Footer";
import trainGif from "../../assets/images/анимация-загрузки.gif";

const LoadingPage = () => {
  return (
    <div className="loading-page">
      <Header />
      <Hero variant="tickets" />
      <div className="loading-container">
        <div className="loading-content">
          <div className="search-text">
            <h2>Идет поиск</h2>
          </div>
          <div className="train-animation">
            <img src={trainGif} alt="Loading animation" className="train-gif" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoadingPage;
