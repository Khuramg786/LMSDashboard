export const logo = [
  '240 64',
  `
  <svg viewBox="0 0 240 64" xmlns="http://www.w3.org/2000/svg">

    <!-- Gradients -->
    <defs>
      <linearGradient id="bookGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e3cff"/>
        <stop offset="100%" stop-color="#ff3c3c"/>
      </linearGradient>

      <linearGradient id="textGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#1e3cff"/>
        <stop offset="100%" stop-color="#ff3c3c"/>
      </linearGradient>

      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1.5" dy="2" stdDeviation="2" flood-opacity="0.4"/>
      </filter>
    </defs>

    <!-- Book Icon (3D Style) -->
    <g filter="url(#shadow)">
      <!-- Left Page -->
      <path
        d="M10 10C10 7.5 12 6 14.5 6H32C34.5 6 36 7.5 36 10V56C36 54 34.5 53 32 53H14.5C12 53 10 51.5 10 49V10Z"
        fill="url(#bookGradient)"
      />

      <!-- Right Page -->
      <path
        d="M32 6H50C52.5 6 54 7.5 54 10V49C54 51.5 52.5 53 50 53H32C34.5 53 36 54 36 56V10C36 7.5 34.5 6 32 6Z"
        fill="url(#bookGradient)"
        opacity="0.9"
      />

      <!-- Book Spine -->
      <line x1="32" y1="6" x2="32" y2="56" stroke="#ffffff" stroke-width="2"/>
    </g>

    <!-- Brand Text -->
    <text
      x="75"
      y="43"
      font-size="30"
      font-weight="1000"
      fill="url(#textGradient)"
      font-family="Segoe UI, Arial, sans-serif"
      filter="url(#shadow)"
    >
      Life Changer 
    </text>

  </svg>
  `
];
