// Eagerly load critical components
import QuickMenus from "../components/customs/menu/QuickMenus";
import PromoSlider from "../components/homepage/PromoSlider";
import IncomeCard from "../components/customs/card/IncomeCard";

const Home = () => {
  return (
    <>
      <PromoSlider />
      <IncomeCard />
      <QuickMenus />
      {/* Below-the-fold content - lazy loaded */}
    </>
  );
};

export default Home;
