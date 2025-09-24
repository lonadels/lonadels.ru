export interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export interface CreateProxyKeyResponse {
  accessUrl: string;
}

export interface DialogProps {
  accessUrl: string;
}
