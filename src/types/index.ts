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
