const mapping: Record<string, string> = {
  companies: 'company',
  forms: 'form',
  submissions: 'submission',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
