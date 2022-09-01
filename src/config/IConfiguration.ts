export interface IConfiguration {
  Datalake: string;
  Crm: {
    baseUrl: string;
    key: string;
    workflow: string;
  };
}

export const Configuration: IConfiguration = {
  Datalake: process.env.Datalake,
  Crm: {
    baseUrl: process.env.CrmBaseUrl,
    key: process.env.CrmKey,
    workflow: process.env.CrmWorkflow,
  },
};
