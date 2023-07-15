interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Owner'],
  customerRoles: ['End User'],
  tenantRoles: ['Owner', 'Admin', 'Team Member', 'Collaborator'],
  tenantName: 'Company',
  applicationName: 'Form Generator',
  addOns: ['chat', 'notifications', 'file'],
};
