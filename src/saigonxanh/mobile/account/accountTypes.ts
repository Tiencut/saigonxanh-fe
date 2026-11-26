import type { CampaignItem } from '../../types';

export type AccountPage =
  | 'edit'
  | 'gifts'
  | 'orders'
  | 'notifications'
  | 'privacy'
  | 'permissions'
  | 'registrations';
export type AccountOrder = {
  id: string;
  rewardName: string;
  pointsSpent: number;
  status: string;
  redeemedAt: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
};
export type AccountProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  redemptions: AccountOrder[];
  registrations: { id: string; status: string; campaign: CampaignItem }[];
};
export type AccountNotice = {
  id: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
};
export type PrivacyRequest = { id: string; message: string; status: string; createdAt: string };
export const accountPath = '/public/saigonxanh/account';
export const orderStatuses: Record<string, string> = {
  PENDING: 'Chờ xử lý',
  SHIPPED: 'Đang giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy · Đã hoàn điểm',
};
export const privacyStatuses: Record<string, string> = {
  PENDING: 'Chờ tiếp nhận',
  PROCESSING: 'Đang xử lý',
  COMPLETED: 'Đã xử lý',
  REJECTED: 'Chưa chấp nhận',
};
