import React from "react";
import "./HowItWorks.css";

import step1 from "../../assets/images/step1.png";
import step2 from "../../assets/images/step2.png";
import step3 from "../../assets/images/step3.png";
import howItWorks from "../../assets/images/HowItWorks.png";

const HowItWorks = () => {
  return (
    <section
      className="how-it-works"
      id="как-это-работает"
      style={{ backgroundImage: `url(${howItWorks})` }}
    >
      <div className="how-it-works-container">
        <h2 className="how-it-works-title">КАК ЭТО РАБОТАЕТ</h2>

        <button className="learn-more-top-btn">Узнать больше</button>

        <div className="steps-container">
          <div className="step-card">
            <img src={step1} alt="Удобный заказ" className="step-image" />
            <h3 className="step-caption">
              Удобный заказ
              <br />
              на сайте
            </h3>
          </div>

          <div className="step-card">
            <img src={step2} alt="Нет необходимости" className="step-image" />
            <h3 className="step-caption">
              Нет необходимости
              <br />
              ехать в офис
            </h3>
          </div>

          <div className="step-card">
            <img src={step3} alt="Огромный выбор" className="step-image" />
            <h3 className="step-caption">
              Огромный выбор
              <br />
              направлений
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
