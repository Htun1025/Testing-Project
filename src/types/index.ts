import type { ReactNode } from "react";

export type FakeLoginUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  nrc:string;
  password: string;
  address: string;
  status: "ACTIVE" | "INACTIVE";
 role: "ADMIN" | "USER" | "CHECKER" | "MAKER" | "APPROVER";

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
  status: "ACTIVE" | "INACTIVE";
 role: "ADMIN" | "USER" | "CHECKER" | "APPROVER";

};

export type UserForm = {
  name: string;
  username: string;
  email: string;
  phone: string;
  password?: string;
  nrc: string;
  address: string;
  status: "ACTIVE" | "INACTIVE";

  
};

export const emptyForm: UserForm = {
  name: "",
  username: "",
  email: "",
  phone: "",
  nrc: "",
  address: "",
  status: "ACTIVE",
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
  status: "ACTIVE" | "INACTIVE";
};

export type PermissionForm = {
  name: string;
  module: string;
  action: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
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


export type SettingsProfile = {
  name: string;
  email: string;
  phone: string;
  status: string;
  about: string;
};
