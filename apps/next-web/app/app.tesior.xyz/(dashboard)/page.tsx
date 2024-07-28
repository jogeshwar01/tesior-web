import Intro from "@/components/landing/intro";
import DemoTabs from "@/components/landing/demo-tabs";
import FeaturesSection from "@/components/landing/features";

export default async function Home() {
  return (
    <>
      <Intro />
      <DemoTabs />
      <FeaturesSection />
    </>
  );
}
