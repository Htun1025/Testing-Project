import type { ReactNode } from "react";

export type UserFormData = {
    name: string;
    username: string;
    email: string;
    password: string;
};

export type Props ={
    onCreateUser:()=> void;
}

export type SidebarProps = {
  collapsed: boolean;
  pathname: string;
  onToggle: () => void;
};

export type DashboardLayoutProps = {
  children: ReactNode;
};


export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  nrc:string;
  address: string;
  status: "Active" | "Inactive";
  
  role: "ADMIN" | "USER";
};

export type UserForm = {
  name: string;
  username: string;
  email: string;
  phone: string;
  password?: string;
  nrc: string;
  address: string;
  status: "Active" | "Inactive";

  
};

export const emptyForm: UserForm = {
  name: "",
  username: "",
  email: "",
  phone: "",
  nrc: "",
  address: "",
  status: "Active",
};


export type TableColumn = {
  id: string;
  label: string;
};

export type Permission = {
  id: number;
  name: string;
  module: string;
  action: string;
  description: string;
  status: "Active" | "Inactive";
};

export type SummaryItem = {
  label: string;
  value: number | string;
  icon: ReactNode;
  color: string;
  background: string;
};

export type RoleStatus = "ACTIVE" | "INACTIVE";

export type Role = {
  id: number;
  name: string;
  code: string;
  description: string;
  status: RoleStatus;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
    rolePermissions: number;
  };
};

export type RoleForm = {
  name: string;
  code: string;
  status: RoleStatus;
};
