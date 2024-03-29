// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  username: string;
  password: string;
  access: string;
};

export type Category = {
  id: string;
  name: string;
};

export type Vendor = {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  salesman: string;
  created_at: string;
  updated_at: string;
};

export type VendorField = {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  salesman: string;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  vendor_id: string;
  name: string;
  image: string;
  itemcode: string;
  barcode: string;
  quantity: number;
  size: number;
  stock: number;
  unit: string;
  created_at: string;
  updated_at: string;
}

export type ProductImage = {
  id: string;
  product_id: string;
  image_byte: Uint8Array;
  type: string;
}

export type ProductTable = {
  id: string;
  vendor_id: string;
  vendor_name: string;
  name: string;
  image: string;
  itemcode: string;
  barcode: string;
  quantity: number;
  size: number;
  stock: number;
  unit: string;
  created_at: string;
  updated_at: string;
}