// subscription tier limits (can be stored in a config or database)
export const TIER_LIMITS = {
  lite: {
    maxAdmins: 1,
    maxLoanOfficers: 1,
    maxUsers: 5000,
    maxOpenLoan: 2500,
  },
  growth: {
    maxAdmins: 20,
    maxLoanOfficers: 20,
    maxUsers: 50000,
    maxOpenLoan: 30000,
  },
  enterprise: {
    maxAdmins: true,
    maxLoanOfficers: true,
    maxUsers: true,
    maxOpenLoan: true,
  },
};

export default TIER_LIMITS;