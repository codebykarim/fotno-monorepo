interface ErrorMeta {
  url?: string;
  body?: string;
  key?: string;
  env?: string;
  uid?: string | number;
  agent?: string;
  code?: number;
  message?: string;
}

export { ErrorMeta };
