export type UserRole = 'USER' | 'REALSTATE' | null;

export interface RealStateFormFields {
  name: string;
  address: string;
  phone: string;
  website: string;
}

export interface UserFormFields {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface FormState extends UserFormFields, RealStateFormFields {
  auth_provider: string;
}

export interface Property {
  id: number;
  title: string;
  address: string;
  isAvailable: boolean;
  description?: string;
  price?: number;
  rooms?: number;
  images?: string[];
}

export interface PropertyFormDataType {
  title: string;
  description: string;
  address: string;
  price: number;
  rooms: number;
  isAvailable: boolean;
  images: string;
}

export const initialPropertyFormState: PropertyFormDataType = {
  title: '',
  description: '',
  address: '',
  price: 0,
  rooms: 0,
  isAvailable: true,
  images: '',
};

export interface FormProps<T> {
    form: T & { auth_provider: string };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    loading: boolean;
}