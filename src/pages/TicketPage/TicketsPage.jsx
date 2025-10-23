import "./TicketsPage.css";
import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import MenuTabs from "../../components/MenuTabs/MenuTabs";
import Footer from "../../components/Footer/Footer";

const TicketsPage = () => {
  return (
    <div className="tickets-page">
      <Header />
      <Hero variant="tickets" />
      <MenuTabs />
      <Footer />
    </div>
  );
};

export default TicketsPage;
