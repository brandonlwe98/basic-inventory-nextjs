// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  password: string;
};

export type Vendor = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type VendorField = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  vendor_id: string;
  name: string;
  image_url: string;
  barcode: string;
  quantity: number;
  unit: string;
  created_at: string;
  updated_at: string;
}

export type ProductTable = {
  id: string;
  vendor_id: string;
  vendor_name: string;
  name: string;
  image_url: string;
  barcode: string;
  quantity: number;
  unit: string;
  created_at: string;
  updated_at: string;
}