
import HeroSection from '@/components/sections/hero-section';
import FeaturesSection from '@/components/sections/features-section';
import TrustedBySection from '@/components/sections/trusted-by-section';
import GlobalReviewsSection from '@/components/sections/global-reviews-section';
import CtaBannerSection from '@/components/sections/cta-banner-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <TrustedBySection />
      <GlobalReviewsSection />
      <CtaBannerSection />
    </>
  );
}
