import "./MenuTabs.css";

const MenuTabs = ({ currentStep = "tickets" }) => {
  const tabs = [
    { id: "tickets", label: "Билеты", number: 1 },
    { id: "passengers", label: "Пассажиры", number: 2 },
    { id: "payment", label: "Оплата", number: 3 },
    { id: "verification", label: "Проверка", number: 4 }
  ];

  const getTabStatus = (tabId, index) => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentStep);
    if (index < currentIndex) {
      return "completed";
    } else if (index === currentIndex) {
      return "active";
    } else {
      return "inactive";
    }
  };

  return (
    <div className="menu-tabs">
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          className={`menu-tab ${getTabStatus(tab.id, index)}`}
        >
          <span className="tab-number">{tab.number}</span>
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default MenuTabs;