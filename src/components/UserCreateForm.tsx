"use client";

import { useCreateUser } from "@/hooks/userCreate";
import { error } from "console";
import "../app/globals.css";

export default function UserCreateForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    onSubmit,
  } = useCreateUser();

  return (
    <section className="user-card">
      <p className="form-description">Enter the user information below.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-field">
          <input
            id="name"
            type="text"
            placeholder=" "
            {...register("name", {
              required: "Name is required",
            })}
            aria-invalid={!!errors.name}
          />
          <label htmlFor="name">Name</label>
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>
        <div className="form-field">
          <input
            id="username"
            type="text"
            placeholder=" "
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "At least 3 characters required",
              },
            })}
            aria-invalid={!!errors.username}
          />
          <label htmlFor="username">Username</label>
          {errors.username && (
            <p className="error-text">{errors.username.message}</p>
          )}
        </div>

        <div className="form-field">
          <input
            id="email"
            type="email"
            placeholder=" "
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
            aria-invalid={!!errors.email}
          />
          <label htmlFor="email">Email</label>
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div className="form-field">
          <input
            id="password"
            type="password"
            placeholder=" "
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Enter a valid password",
              },
            })}
            aria-invalid={!!errors.password}
          />
          <label htmlFor="password">Password</label>
          {errors.email && (
            <p className="error-text">{errors.password?.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={isSubmitting ? "btn-active" : "btn-"}
        >
          {isSubmitting ? "Creating..." : "create User"}
        </button>
      </form>
    </section>
  );
}
