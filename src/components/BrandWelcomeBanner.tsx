import React, { useState } from 'react';
import { Language, PageId } from '../types';

interface BrandWelcomeBannerProps {
  currentLang: Language;
  onNavigate: (page: PageId) => void;
}

const BANNER_BY_LANG: Record<Language, { src: string; alt: string; slogan: string }> = {
  ca: {
    src: '/assets/aistudio/image_205564d0.png',
    alt: 'PETOZZY · Dissenyem records que abracen allò que més estimes',
    slogan: 'Dissenyem records que abracen allò que més estimes',
  },
  es: {
    src: '/assets/aistudio/image_39eb2133.png',
    alt: 'PETOZZY · Diseñamos recuerdos que abrazan lo que más amas',
    slogan: 'Diseñamos recuerdos que abrazan lo que más amas',
  },
  pt: {
    src: '/assets/aistudio/image_af5bed9a.png',
    alt: 'PETOZZY · Desenhamos lembranças que abraçam o que você mais ama.',
    slogan: 'Desenhamos lembranças que abraçam o que você mais ama.',
  },
};

export const BrandWelcomeBanner: React.FC<BrandWelcomeBannerProps> = ({
  currentLang,
  onNavigate,
}) => {
  const [bannerError, setBannerError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const banner = BANNER_BY_LANG[currentLang];

  return (
    <section className="w-full bg-[#c3d1e2] pt-6 pb-8 sm:pt-8 sm:pb-10">
      {/* Top part: ONLY the hand-drawn Petozzy cup seamlessly on the #c3d1e2 blue background (no box, no name) */}
      {!logoError && (
        <div className="flex justify-center mb-4 sm:mb-5 px-4">
          <button
            type="button"
            onClick={() => onNavigate('inici')}
            className="relative w-24 h-24 sm:w-28 sm:h-28 overflow-hidden cursor-pointer hover:scale-105 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#243B53] rounded-2xl"
            aria-label="Petozzy Inici"
          >
            <img
              src="/assets/aistudio/1_7dd131f8.png"
              alt="Tassa Petozzy"
              className="absolute max-w-none w-[225%] h-[225%] left-1/2 -translate-x-1/2 -top-[40%] mix-blend-multiply brightness-110 contrast-105"
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
            />
          </button>
        </div>
      )}

      {/* Full-width edge-to-edge darker blue line (#9eb3cc) containing the official name and slogan */}
      <div className="w-full bg-[#9eb3cc] flex items-center justify-center overflow-hidden">
        {!bannerError ? (
          <div className="relative w-full max-w-[780px] h-16 sm:h-28 md:h-32 overflow-hidden">
            <img
              src={banner.src}
              alt={banner.alt}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-auto max-w-none"
              referrerPolicy="no-referrer"
              onError={() => setBannerError(true)}
            />
          </div>
        ) : (
          <div className="py-5 px-4 text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#3B5B82] tracking-widest uppercase">
              PETOZZY
            </p>
            <p className="text-sm sm:text-base font-semibold text-[#3B5B82] mt-1">
              {banner.slogan}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
