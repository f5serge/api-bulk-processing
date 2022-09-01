import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IConfiguration } from '../../config/IConfiguration';

export class CrmClient {
  private connectionInstance: AxiosInstance;

  constructor(private config: IConfiguration) {
    this.connectionInstance = axios.create({
      baseURL: this.config.Crm.baseUrl,
      timeout: 180000,
    });
    this.connectionInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.connectionInstance.interceptors.response.use(
      async (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        if (error.response?.data['message']) {
          return Promise.reject(new Error(error.response?.data['message']));
        }
        return Promise.reject(error);
      }
    );
  }

  fetchInvitationCode = async (
    contactId: string
  ): Promise<{
    invitationCode?: string;
    contactId?: string;
    expiryDate?: Date;
    error?: { code: string; message: string };
  }> => {
    try {
      const uri = `workflows/${this.config.Crm.workflow}/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=${this.config.Crm.key}`;
      const res = await this.connectionInstance.post(uri, { contactId });
      return res.data;
    } catch (error) {
      return error?.response?.data || error;
    }
  };
}
