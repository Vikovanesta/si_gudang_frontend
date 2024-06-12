export interface User {
  id: number;
  email: string;
  phone: string;
  is_verified: boolean;
  profile_image_url: string;
  role: Role;
  profile: Student | Teacher |Laboran | null;
}

export interface Role {
  id: number;
  name: string;
}

export interface Student {
  id: number;
  name: string;
  year_in: number;
  date_of_birth: string;
  class: Class;   
}

export interface Teacher {
  id: number;
  name: string;
  nip: string;
  subject: Subject;
}

export interface Laboran {
  id: number;
  name: string;
  nip: string;
}

export interface Class {
  id: number;
  name: string;
}

export interface Subject {
  id: number;
  name: string;
}

export interface Item {
  id: number;
  name: string;
  stock: number;
  max_stock: number;
  image_url: string;
}
