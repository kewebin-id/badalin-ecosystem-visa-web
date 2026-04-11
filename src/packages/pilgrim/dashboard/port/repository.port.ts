import { IVisaHistory } from '../domain';

export interface IDashboardRepository {
  getHistory(): Promise<IVisaHistory[]>;
}
