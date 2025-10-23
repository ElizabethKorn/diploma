import "./Footer.css";

import phoneIcon from "../../assets/images/phone.png";
import emailIcon from "../../assets/images/mail.png";
import skypeIcon from "../../assets/images/skype.png";
import addressIcon from "../../assets/images/location.png";
import youtubeIcon from "../../assets/images/youtube.png";
import inIcon from "../../assets/images/in.png";
import facebookIcon from "../../assets/images/facebook.png";
import twitterIcon from "../../assets/images/twitter.png";
import gIcon from "../../assets/images/g.png";
import youtubeIconHover from "../../assets/images/youtHover.png";
import inIconHover from "../../assets/images/inHover.png";
import twitterIconHover from "../../assets/images/twitHover.png";
import gIconHover from "../../assets/images/gHover.png";
import facebookIconHover from "../../assets/images/fHover.png";
import footerArrow from "../../assets/images/footArrow.png";

const Footer = () => {
  return (
    <footer className="footer" id="контакты">
      <div className="footer-container">
        <div className="footer-column">
          <h3 className="footer-title">Свяжитесь с нами</h3>
          <div className="contact-info">
            <a href="tel:88000000000" className="contact-item">
              <img src={phoneIcon} alt="Телефон" className="contact-icon" />
              <span className="contact-text">8 (800) 000 00 00</span>
            </a>
            <a href="mailto:inbox@mail.ru" className="contact-item">
              <img src={emailIcon} alt="Email" className="contact-icon" />
              <span className="contact-text">inbox@mail.ru</span>
            </a>
            <a href="skype:tu.train.tickets?call" className="contact-item">
              <img src={skypeIcon} alt="Skype" className="contact-icon" />
              <span className="contact-text">tu.train.tickets</span>
            </a>
            <div className="contact-item">
              <img src={addressIcon} alt="Адрес" className="contact-icon" />
              <span className="contact-text">
                г. Москва
                <br />
                ул. Московская 27-35
                <br />
                555 555
              </span>
            </div>
          </div>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">Подписка</h3>
          <p className="subscription-text">Будьте в курсе событий</p>
          <div className="subscription-form">
            <input type="email" placeholder="email" className="email-input" />
            <button className="send-button">ОТПРАВИТЬ</button>
          </div>

          <div className="social-section">
            <h3 className="social-title">Подписывайтесь на нас</h3>
            <div className="social-icons">
              <a href="/" className="social-icon">
                <img
                  src={youtubeIcon}
                  alt="Social 1"
                  className="icon-default"
                />
                <img
                  src={youtubeIconHover}
                  alt="YouTube"
                  className="icon-hover"
                />
              </a>
              <a href="/" className="social-icon">
                <img src={inIcon} alt="Social 2" className="icon-default" />
                <img src={inIconHover} alt="LinkedIn" className="icon-hover" />
              </a>
              <a href="/" className="social-icon">
                <img src={gIcon} alt="Social 3" className="icon-default" />
                <img src={gIconHover} alt="LinkedIn" className="icon-hover" />
              </a>
              <a href="/" className="social-icon">
                <img
                  src={facebookIcon}
                  alt="Social 4"
                  className="icon-default"
                />
                <img
                  src={facebookIconHover}
                  alt="LinkedIn"
                  className="icon-hover"
                />
              </a>
              <a href="/" className="social-icon">
                <img
                  src={twitterIcon}
                  alt="Social 5"
                  className="icon-default"
                />
                <img
                  src={twitterIconHover}
                  alt="LinkedIn"
                  className="icon-hover"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="logo">Лого</div>
          <div className="center-image">
            <img src={footerArrow} alt="Иконка" />
          </div>
          <div className="copyright">2018 WEB</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
