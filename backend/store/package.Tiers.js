const tiers = [
  {
    id: 1,
    name: "LITE",
    total_client: "5,000",
    // price: 9.99,
    features: [
      "Flat interest",
      "1 Admin, 1 Loan Officer",
      "Manual review",
      "Basic support",
      "Standard HostPay STK push",
      "Transactional text alerts",
    ],
  },
  {
    id: 2,
    name: "GROWTH",
    total_client: "50,000",
    // price: 19.99,
    features: [
      "Up to 20 concurrent seats",
      "Reducing balance option",
      "Rule-based algorithmic limits",
      "Automated B2C & C2B HostPay webhooks",
      "Scheduled reminder queues",
    ],
  },
  {
    id: 3,
    name: "ENTERPRISE",
    total_client: "Unlimited",
    // price: 49.99,
    features: [
      "Full loan restructuring models",
      "Unlimited corporate seats",
      "Custom advanced credit matrices",
      "Automated multi-wallet float routing",
      "Cross-channel notification alerts",
    ],
  },
];

export default tiers;