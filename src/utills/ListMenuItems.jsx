export const listMenuItems = (token) => {
  const soundBoxIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
          d="M11 5 6 9H3v6h3l5 4V5Zm6.5 2.5a5 5 0 0 1 0 9M15 9a3 3 0 0 1 0 6"
        />
      </svg>
    );
  };

  const posIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <rect
          width="18"
          height="12"
          x="3"
          y="6"
          rx="2"
          ry="2"
          strokeWidth="1.75"
        />
        <path d="M3 10h18" strokeWidth="1.75" />
      </svg>
    );
  };

  const nobankIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
          d="M3 10h18M6 10v8m12-8v8M4 18h16M3 6l9-3 9 3"
        />
      </svg>
    );
  };

  const invoiceIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
          d="M9 14h6M9 10h6M3 7h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
        />
      </svg>
    );
  };

  const iconCS = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
          d="M3 11a9 9 0 1 1 18 0v6a3 3 0 0 1-3 3h-2v-6h5M6 20H5a2 2 0 0 1-2-2v-6h5v6H6Z"
        />
      </svg>
    );
  };

  const iconPPOB = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
          d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    );
  };

  const DATA_MENU = [
    {
      id: "soundbox",
      name: "Soundbox",
      url: `${import.meta.env.VITE_BASE_URL_DEV}?user_token=${token}`,
      icon: soundBoxIcon(),
    },
    {
      id: "pos",
      name: "POS",
      url: "/pos",
      target: "_blank",
      icon: posIcon(),
    },
    {
      id: "nobank",
      name: "Uang Saku",
      url: "https://nobank.id/",
      icon: nobankIcon(),
    },
    {
      id: "invoice",
      name: "Invoice",
      url: "/invoice",
      icon: invoiceIcon(),
    },
    {
      id: "cs",
      name: "CS",
      url: "/customer-support",
      icon: iconCS(),
    },
    {
      id: "ppob",
      name: "PPOB",
      url: "/ppob",
      icon: iconPPOB(),
    },
  ];

  return DATA_MENU;
};
