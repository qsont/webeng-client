import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [storeError, setStoreError] = useState("");

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setStoreError("");

    const authStore = await import("@/store/authStore");

    if (typeof authStore.login !== "function") {
      setStoreError("authStore.login is not implemented yet.");
      return;
    }

    try {
      const result = await authStore.login(data);

      if (result?.error) {
        setStoreError(result.error);
        return;
      }

      if (result?.token) {
        localStorage.setItem("auth_token", result.token);
      }

      toast({
        title: "Welcome back",
        description: "Login successful.",
      });
      navigate("/dashboard");
    } catch (error) {
      setStoreError(error?.message || "Login failed. Please try again.");
    }
  };

  return (
    <main className="flex items-center min-h-screen bg-background px-4 py-10">
      <section className="mx-auto w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to continue.</p>

        {storeError ? (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Login failed</AlertTitle>
            <AlertDescription>{storeError}</AlertDescription>
          </Alert>
        ) : null}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <Input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="ui-field"
                {...form.register("email")}
              />
              {form.formState.errors.email ? (
                <p className="mt-1 text-sm text-destructive">{form.formState.errors.email.message}</p>
              ) : null}
            </div>

            <div>
              <Input
                type="password"
                placeholder="PASSWORD"
                className="ui-field"
                {...form.register("password")}
              />
              {form.formState.errors.password ? (
                <p className="mt-1 text-sm text-destructive">{form.formState.errors.password.message}</p>
              ) : null}
            </div>

            <Button type="submit" className="w-full rounded-full bg-brand-violet-600 hover:bg-brand-violet-700">
              Login
            </Button>

            <p className="mt-1 text-sm text-muted-foreground text-center">
              Don't have an account? {" "}
              <a className={`text-brand-accent-400 hover:text-brand-accent-700 transition-colors`} href="./register">
                Create an account.
              </a>
            </p>
          </form>
        </Form>
      </section>
    </main>
  );
}

export default Login;