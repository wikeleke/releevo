import React from 'react';

const Logo = ({ className = 'h-10 w-auto' }) => (
    <svg
        className={className}
        viewBox="0 0 350 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Isotipo: Círculo y Píldora */}
        <circle cx="22" cy="20" r="10" fill="#2897FF" />
        <path d="M 33 46 L 56 12" stroke="#2897FF" strokeWidth="16" strokeLinecap="round" />

        {/* Separador vertical */}
        <line x1="82" y1="8" x2="82" y2="48" stroke="#1F2024" strokeWidth="2.5" />

        {/* Nombre "releevo" */}
        <text
            x="105"
            y="38"
            fontFamily="'Inter', system-ui, -apple-system, sans-serif"
            fontWeight="800"
            fontSize="46"
            letterSpacing="-2.5"
            fill="#000000"
        >
            releevo
        </text>

        {/* Subtítulo */}
        <text
            x="108"
            y="52"
            fontFamily="'Inter', system-ui, -apple-system, sans-serif"
            fontWeight="500"
            fontSize="10"
            letterSpacing="2.5"
            fill="#71727A"
        >
            CONTINUIDAD DE LOS NEGOCIOS
        </text>
    </svg>
);

export default Logo;
