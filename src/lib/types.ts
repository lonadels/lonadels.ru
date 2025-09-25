export interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export interface CreateProxyKeyResponse {
  uuid: string;
  accessUrl: string;
  createdAt: Date;
}

export interface DialogProps {
  accessUrl: string;
}

export interface GetProxyKeyResponse {
  accessUrl: string;
  createdAt: Date;
}
