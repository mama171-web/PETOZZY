import React, { useState } from 'react';
import { Coffee } from 'lucide-react';

interface PetozzyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'header' | 'lg' | 'xl';
  showText?: boolean;
  withBg?: boolean;
  seamless?: boolean;
}

export const PetozzyLogo: React.FC<PetozzyLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  withBg = false,
  seamless = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const dimensionClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    header: 'w-16 h-16 sm:w-20 sm:h-20',
    lg: 'w-32 h-32 sm:w-36 sm:h-36',
    xl: 'w-56 h-56 sm:w-68 sm:h-68',
  }[size];

  return (
    <div
      className={`inline-flex flex-col items-center justify-center select-none ${
        withBg ? 'bg-[#EBF2FF] p-3 rounded-3xl border border-[#C3D1E2] shadow-xs' : ''
      } ${className}`}
    >
      {!imgError ? (
        <div
          className={`${dimensionClasses} aspect-square overflow-hidden flex items-center justify-center shrink-0 ${
            seamless ? 'mix-blend-multiply bg-transparent' : 'rounded-2xl bg-[#EBF2FF]'
          }`}
        >
          <img
            src="/assets/aistudio/1_7dd131f8.png"
            alt="Logotip oficial de Petozzy"
            className="w-full h-full object-contain scale-[1.68] origin-[50%_43.8%]"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div
          className={`${dimensionClasses} aspect-square rounded-2xl bg-[#EBF2FF] border border-[#C3D1E2] flex flex-col items-center justify-center text-[#1E324B]`}
        >
          <Coffee className="w-1/2 h-1/2" />
        </div>
      )}

      {showText && (
        <span className="mt-2 font-extrabold tracking-[0.2em] text-[#1E324B] uppercase text-xs">
          PETOZZY
        </span>
      )}
    </div>
  );
};
