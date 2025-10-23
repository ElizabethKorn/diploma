import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import About from "../../components/About/About";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import Reviews from "../../components/ReviewsComp/Reviews";
import Footer from "../../components/Footer/Footer";

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="main-container">
        <Header />
        <Hero />
      </div>
      <About />
      <HowItWorks />
      <Reviews />
      <Footer />
    </div>
  );
};

export default HomePage;
