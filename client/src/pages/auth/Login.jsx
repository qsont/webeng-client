import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useAuthStore from "@/store/authStore";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [storeError, setStoreError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const onSubmit = async (data) => {
    
    setStoreError("");

    try {
      const result = await login(data);
      if (!result?.success) {
        setStoreError(result?.message ?? "Login failed");
        return;
      }
      toast({
        title: "Welcome back",
        description: `Login successful. You are ${result?.user.role}`,
      });
      (result?.user.role === "admin") ? navigate("/admin/dashboard") : navigate("/shop");
    } catch (error) {
      setStoreError(error?.message || "Login failed. Please try again.");
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card/90 p-6 shadow-soft sm:p-8">
        <h1 className="text-2xl font-black text-brand-violet-700 dark:text-brand-violet-300">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to continue your sweet shopping journey.</p>

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
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="PASSWORD"
                  className="ui-field pr-11!"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {form.formState.errors.password ? (
                <p className="mt-1 text-sm text-destructive">{form.formState.errors.password.message}</p>
              ) : null}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full rounded-2xl bg-brand-violet-600 text-white shadow-soft hover:bg-brand-violet-700 dark:bg-brand-violet-500 dark:hover:bg-brand-violet-400">
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <p className="mt-1 text-sm text-muted-foreground text-center">
              Don't have an account? {" "}
              <Link className="text-brand-violet-700 transition-colors hover:text-brand-violet-500 dark:text-brand-violet-300 dark:hover:text-brand-violet-200" to="/auth/register">
                Create an account.
              </Link>
            </p>
          </form>
        </Form>
    </section>
  );
}

export default Login;