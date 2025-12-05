export interface User {
  id: string;
  name: string;
  username: string;
  phone: string;
  role?: string;
}

export interface LoginResponse {
  token: string;
  data?: {
    user?: {
      id?: string;
      [key: string]: any;
    };
  };
}

export interface Record {
  id: string;
  name?: string;
  surname?: string;
  passportSeriya?: "AD" | "AB" | "KA" | "AE" | "AC";
  passportCode?: string;
  passportHash?: string;
  passportPreview?: string;
  type: "NasiyaMijoz" | "TolovQilinmagan";
  time?: number;
  userId: string;
  user?: User;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SearchParams {
  passportSeriya: string;
  passportCode: string;
}

export interface CreateRecordData {
  name?: string;
  surname?: string;
  passportSeriya: "AD" | "AB" | "KA" | "AE" | "AC";
  passportCode: string;
  type: "NasiyaMijoz" | "TolovQilinmagan";
  time?: number;
}
