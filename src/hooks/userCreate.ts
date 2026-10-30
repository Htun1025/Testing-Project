"use client";

import { UserFormData } from "@/types";
import { useForm } from "react-hook-form";

export function useCreateUser(){
    const form = useForm<UserFormData>({
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: UserFormData)=>{
        console.log("User Data:",data);

        form.reset();
    };

    return{
        ...form,
        onSubmit,
    };
}