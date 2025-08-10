export interface CreateUserRequestDTO {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserResponseDTO {
  id: number;
  name: string;
  email: string;
} 