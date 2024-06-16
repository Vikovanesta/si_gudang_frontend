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
  is_in_cart: boolean;
  warehouse: Warehouse;
  material: Material;
}

export interface CartItem {
  id: number;
  item: Item;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Warehouse {
  id: number;
  name: string;
}

export interface Material {
  id: number;
  name: string;
}

export interface CartItem {
  id: number;
  item: Item;
}

export interface BorrowingRequest {
  id: number;
  purpose: string;
  status: string;
  is_revised: boolean;
  created_at: string;
  updated_at: string;
  borrowed_items_count: number;
  details: BorrowingRequestDetail[];
  sender: User;
  handler: User;
  school_subject: SchoolSubject;
}

export interface SchoolSubject {
    id: number;
    name: string;
}

export interface BorrowingRequestDetail {
  id: number;
  start_date: string;
  end_date: string;
  note: string;
  is_revision: boolean;
  status: BorrowingRequestStatus;
  borrowed_items: BorrowedItem[];
}

export interface BorrowingRequestStatus {
  id: number;
  name: string;
}

export interface BorrowedItem {
  id: number;
  quantity: number;
  returned_quantity: number;
  borrowed_at: string;
  returned_at: string;
  is_cancelled: boolean;
  status: BorrowingStatus;
  item: Item;
}

export interface BorrowingStatus {
  id: number;
  name: string;
}
