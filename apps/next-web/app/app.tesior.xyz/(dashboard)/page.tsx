import Intro from "@/components/landing/intro";
import DemoTabs from "@/components/landing/demo-tabs";
import FeaturesSection from "@/components/landing/features-section";

export default async function Home() {
  return (
    <>
      <Intro />
      <DemoTabs />
      <FeaturesSection />
    </>
  );
}
