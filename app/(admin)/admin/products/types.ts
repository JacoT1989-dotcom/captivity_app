// Types
export type MenuLink = {
  name: string;
  href: string;
  count?: number;
};

export type MenuItem = {
  title: string;
  links: MenuLink[];
};

export type UserCounts = {
  pendingApproval: number;
  customers: number;
  subscribers: number;
  promo: number;
  distributors: number;
  shopManagers: number;
  editors: number;
  vendors: number;
};

export type CollectionCounts = {
  winter: number;
  summer: number;
  camo: number;
  baseball: number;
  signature: number;
  fashion: number;
  leisure: number;
  sport: number;
  african: number;
  industrial: number;
};
