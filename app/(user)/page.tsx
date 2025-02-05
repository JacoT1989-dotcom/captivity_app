import { HeroSlider } from "./_components/(hero_uploads)/Hero-slider";
import { Section1 } from "./_components/(section1)/Section1";
import { Section2 } from "./_components/(section2)/Section2";
import { RegisterSection } from "./_components/(section3)/RegisterSection";
import { ProductTabs } from "./_components/(section4)/Product-tabs";
import { PlatformSection } from "./_components/(section5)/PlatformSection";
//import connectDB from "@/config/database"

const Home = async () => {
  return (
    <div>
      <main>
        {" "}
        <HeroSlider />
        {/* Services Section */}
        <Section1 />
        {/* Categories Grid Section */}
        <Section2 />
        {/* How to register section */}
        <RegisterSection />
        {/* Product Tabs Section */}
        <ProductTabs />
        {/* Platform and FWRD Section */}
        <PlatformSection />
      </main>
    </div>
  );
};

//

export default Home;
