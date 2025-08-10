export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
} 