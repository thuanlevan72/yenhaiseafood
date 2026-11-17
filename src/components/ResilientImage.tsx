import React, { useState } from 'react';

interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
}

function getSeafoodArtwork(label: string) {
  const text = label.toLowerCase();

  if (text.includes('tôm hùm') || text.includes('combo tiệc')) {
    return {
      bg: 'from-[#102A45] via-[#1B436B] to-[#0A2540]',
      accent: '#FF6B4A',
      tag: 'TÔM HÙM BÔNG NHA TRANG',
      svg: (
        <svg viewBox="0 0 240 160" className="w-full h-full" fill="none">
          <defs>
            <radialGradient id="lobGlow" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#FF785A" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0A2540" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="lobBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B4A" />
              <stop offset="50%" stopColor="#E04F36" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
          </defs>
          <circle cx="120" cy="80" r="75" fill="url(#lobGlow)" />
          {/* Water ripples */}
          <ellipse cx="120" cy="130" rx="85" ry="14" stroke="#38BDF8" strokeOpacity="0.25" strokeWidth="1.5" />
          <ellipse cx="120" cy="130" rx="60" ry="9" stroke="#38BDF8" strokeOpacity="0.35" strokeWidth="1.5" />
          {/* Antennae */}
          <path d="M95 52 C60 25, 30 20, 12 32" stroke="#FCA5A5" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M145 52 C180 25, 210 20, 228 32" stroke="#FCA5A5" strokeWidth="2.5" strokeLinecap="round" />
          {/* Claws */}
          <path d="M88 64 C62 50, 48 64, 58 80 C68 92, 84 82, 92 72 Z" fill="url(#lobBody)" stroke="#FDE047" strokeWidth="1.2" />
          <path d="M152 64 C178 50, 192 64, 182 80 C172 92, 156 82, 148 72 Z" fill="url(#lobBody)" stroke="#FDE047" strokeWidth="1.2" />
          {/* Segmented Carapace & Tail */}
          <ellipse cx="120" cy="68" rx="24" ry="30" fill="url(#lobBody)" stroke="#FED7AA" strokeWidth="1.5" />
          <path d="M99 85 Q120 94 141 85 L136 102 Q120 110 104 102 Z" fill="#C93B24" stroke="#FED7AA" strokeWidth="1.2" />
          <path d="M104 102 Q120 110 136 102 L131 117 Q120 124 109 117 Z" fill="#B91C1C" stroke="#FED7AA" strokeWidth="1.2" />
          {/* Tail fan */}
          <path d="M108 117 L92 134 Q120 144 148 134 L132 117 Z" fill="#E04F36" stroke="#FDE047" strokeWidth="1.2" />
          {/* Eyes & Legs */}
          <circle cx="110" cy="46" r="3.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.2" />
          <circle cx="130" cy="46" r="3.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.2" />
          <path d="M96 78 L72 92 M98 88 L74 104 M144 78 L168 92 M142 88 L166 104" stroke="#FB923C" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    };
  }

  if (text.includes('cua cà mau') || text.includes('cua')) {
    return {
      bg: 'from-[#1F2937] via-[#0F3538] to-[#0A2540]',
      accent: '#F97316',
      tag: 'CUA CÀ MAU GẠCH SON',
      svg: (
        <svg viewBox="0 0 240 160" className="w-full h-full" fill="none">
          <defs>
            <radialGradient id="crabGlow" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0A2540" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="crabShell" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="60%" stopColor="#C2410C" />
              <stop offset="100%" stopColor="#7C2D12" />
            </linearGradient>
          </defs>
          <circle cx="120" cy="82" r="72" fill="url(#crabGlow)" />
          {/* Legs */}
          <path d="M75 82 L38 72 L26 90 M78 92 L40 94 L28 112 M84 102 L50 112 L42 128" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M165 82 L202 72 L214 90 M162 92 L200 94 L212 112 M156 102 L190 112 L198 128" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {/* Big Claws */}
          <path d="M85 65 C60 40, 42 52, 54 70 C62 80, 76 74, 85 65 Z" fill="#F97316" stroke="#FDE047" strokeWidth="1.5" />
          <path d="M155 65 C180 40, 198 52, 186 70 C178 80, 164 74, 155 65 Z" fill="#F97316" stroke="#FDE047" strokeWidth="1.5" />
          {/* Crab Carapace with Roe Glow */}
          <ellipse cx="120" cy="86" rx="46" ry="32" fill="url(#crabShell)" stroke="#FDBA74" strokeWidth="2" />
          <ellipse cx="120" cy="84" rx="28" ry="16" fill="#F59E0B" fillOpacity="0.45" />
          <circle cx="105" cy="58" r="4" fill="#1E293B" stroke="#FDE047" strokeWidth="1.5" />
          <circle cx="135" cy="58" r="4" fill="#1E293B" stroke="#FDE047" strokeWidth="1.5" />
        </svg>
      )
    };
  }

  if (text.includes('tôm sú')) {
    return {
      bg: 'from-[#0B3B49] via-[#0E4D64] to-[#0A2540]',
      accent: '#38BDF8',
      tag: 'TÔM SÚ BIỂN CỌP ĐẠI',
      svg: (
        <svg viewBox="0 0 240 160" className="w-full h-full" fill="none">
          <circle cx="120" cy="80" r="68" fill="#0284C7" fillOpacity="0.25" />
          {/* Curved Prawn Body */}
          <path
            d="M70 105 C62 65, 98 38, 145 48 C175 55, 185 82, 162 106 C145 122, 118 118, 108 104"
            stroke="#FB923C"
            strokeWidth="22"
            strokeLinecap="round"
          />
          {/* Tiger Stripes */}
          <path
            d="M84 68 L98 78 M104 54 L112 70 M128 50 L130 68 M150 58 L144 74 M164 74 L150 86"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Antennae */}
          <path d="M68 95 C42 82, 24 62, 18 40" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round" />
          <circle cx="74" cy="96" r="4" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      )
    };
  }

  if (text.includes('cá hồi')) {
    return {
      bg: 'from-[#1E293B] via-[#0F3047] to-[#0A2540]',
      accent: '#FB7185',
      tag: 'CÁ HỒI NAUY FILLET',
      svg: (
        <svg viewBox="0 0 240 160" className="w-full h-full" fill="none">
          <circle cx="120" cy="80" r="68" fill="#FB7185" fillOpacity="0.2" />
          {/* Salmon Fillet Block */}
          <path
            d="M48 96 L82 48 L192 56 L176 112 L48 96 Z"
            fill="#F97316"
            stroke="#FED7AA"
            strokeWidth="2"
          />
          {/* White Marbling Lines */}
          <path
            d="M76 58 Q95 80 82 98 M102 54 Q122 80 108 102 M128 54 Q148 82 134 105 M154 55 Q172 84 158 108"
            stroke="#FFF7ED"
            strokeWidth="2.5"
            strokeOpacity="0.85"
            strokeLinecap="round"
          />
        </svg>
      )
    };
  }

  if (text.includes('cá chỉ vàng')) {
    return {
      bg: 'from-[#451A03] via-[#78350F] to-[#1E293B]',
      accent: '#FBBF24',
      tag: 'CÁ CHỈ VÀNG 1 NẮNG',
      svg: (
        <svg viewBox="0 0 240 160" className="w-full h-full" fill="none">
          <circle cx="120" cy="80" r="68" fill="#F59E0B" fillOpacity="0.25" />
          <ellipse cx="105" cy="76" rx="44" ry="24" fill="#D97706" stroke="#FDE68A" strokeWidth="2" />
          <ellipse cx="138" cy="88" rx="44" ry="24" fill="#B45309" stroke="#FDE68A" strokeWidth="2" />
          <path d="M65 76 L142 76 M98 88 L176 88" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="4 4" />
        </svg>
      )
    };
  }

  // Default: Squid (Mực Ống Côn Đảo / Mực Câu 1 Nắng)
  return {
    bg: 'from-[#0F2942] via-[#153E63] to-[#0A2540]',
    accent: '#F8FAFC',
    tag: text.includes('một nắng') || text.includes('1 nắng')
      ? 'MỰC CÂU MỘT NẮNG'
      : 'MỰC ỐNG CÔN ĐẢO',
    svg: (
      <svg viewBox="0 0 240 160" className="w-full h-full" fill="none">
        <circle cx="120" cy="80" r="68" fill="#38BDF8" fillOpacity="0.2" />
        {/* Squid Mantle & Fins */}
        <path d="M120 24 L152 54 L120 66 L88 54 Z" fill="#F1F5F9" stroke="#FDA4AF" strokeWidth="2" />
        <path d="M98 48 L142 48 L134 106 L106 106 Z" fill="#FFF1F2" stroke="#FB7185" strokeWidth="2" />
        {/* Tentacles */}
        <path
          d="M108 106 C102 122, 92 132, 86 140 M114 106 C112 124, 108 136, 106 144 M126 106 C128 124, 132 136, 134 144 M132 106 C138 122, 148 132, 154 140"
          stroke="#FDA4AF"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="112" cy="96" r="3" fill="#0F172A" />
        <circle cx="128" cy="96" r="3" fill="#0F172A" />
      </svg>
    )
  };
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  title,
  width = 600,
  height = 450,
  loading = 'lazy',
  decoding = 'async',
  className = '',
  fallbackTitle,
  onClick,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const label = alt || fallbackTitle || 'Hải Sản Yến Hải - Vựa Hải Sản Tươi Sống, Đông Lạnh & Đồ Khô';
  const imageTitle = title || fallbackTitle || label;

  if (hasError || !src) {
    const art = getSeafoodArtwork(label);
    return (
      <div
        onClick={onClick}
        className={`bg-gradient-to-br ${art.bg} text-white flex flex-col items-center justify-center relative overflow-hidden select-none ${className}`}
        role="img"
        aria-label={label}
        title={imageTitle}
      >
        <div className="w-full h-full flex items-center justify-center p-2">
          {art.svg}
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={label}
      title={imageTitle}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      onError={() => setHasError(true)}
      onClick={onClick}
      className={className}
      {...rest}
    />
  );
};
