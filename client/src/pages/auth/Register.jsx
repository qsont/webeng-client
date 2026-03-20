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
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/authStore";

const registerFields = [
  {
    label: "Name",
    name: "name",
    type: "text",
    placeholder: "Enter full name here",
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "juandelacruz@gmail.com",
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Enter password (Minimum of 8 characters)",
  },
  {
    label: "Confirm Password",
    name: "confirm",
    type: "password",
    placeholder: "Confirm password above",
  },
  {
    label: "Phone number",
    name: "phone",
    type: "tel",
    placeholder: `0912 345 6789 or 09123456789`,
  },
  {
    label: "Current address",
    name: "address",
    type: "text",
    placeholder: "Max 50 characters",
  },
];

const registerSchema = z.object({
  name: z.string().min(5, "Please enter your full name."),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  confirm: z.string().min(8, "Passwords must match"),
  phone: z.string().min(11, "Please enter a valid phone number.").max(13),
  address: z.string().min(5, "Please enter your address."),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords don't match",
  path: ["confirm"]
});

function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [storeError, setStoreError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: registerFields.reduce((accumulator, field) => {
      accumulator[field.name] = "";
      return accumulator;
    }, {}),
  });

  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

  const onSubmit = async (data) => {
    setStoreError("");

    try {
      const result = await register(data);
      if (!result?.success) {
        setStoreError(result?.message ?? "Registration failed");
        return;
      }
      toast({
        title: "Registration complete",
        description: "You can now log in.",
      });
      navigate("./login");
    } catch (error) {
      setStoreError(error?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card/90 p-6 shadow-soft sm:p-8">
        <h1 className="text-2xl font-black text-brand-violet-700 dark:text-brand-violet-300">Create account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Join and explore Graham Ice Cream Bars.</p>

        {storeError ? (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Registration failed</AlertTitle>
            <AlertDescription>{storeError}</AlertDescription>
          </Alert>
        ) : null}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {registerFields.map((field) => (
              <div key={field.name}>
                <Label className="mb-2 text-foreground/90">{field.label}</Label>

                {field.name === "password" || field.name === "confirm" ? (
                  <div className="relative">
                    <Input
                      type={
                        field.name === "password"
                          ? (showPassword ? "text" : "password")
                          : (showConfirmPassword ? "text" : "password")
                      }
                      placeholder={field.placeholder}
                      className="ui-field pr-11!"
                      {...form.register(field.name)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (field.name === "password") {
                          setShowPassword((previous) => !previous);
                        } else {
                          setShowConfirmPassword((previous) => !previous);
                        }
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={
                        field.name === "password"
                          ? (showPassword ? "Hide password" : "Show password")
                          : (showConfirmPassword ? "Hide confirm password" : "Show confirm password")
                      }
                    >
                      {(field.name === "password" ? showPassword : showConfirmPassword)
                        ? <EyeOff className="size-4" />
                        : <Eye className="size-4" />}
                    </button>
                  </div>
                ) : (
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="ui-field"
                    {...form.register(field.name)}
                  />
                )}

                {form.formState.errors[field.name] ? (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors[field.name].message}
                  </p>
                ) : null}
              </div>
            ))}

            <Button type="submit" disabled={isLoading} className="w-full rounded-2xl bg-brand-violet-600 text-white shadow-soft hover:bg-brand-violet-700 dark:bg-brand-violet-500 dark:hover:bg-brand-violet-400">
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Register"
              )}
            </Button>

            <p className="mt-1 text-sm text-muted-foreground text-center">
              Already have an account? {" "}
              <Link className="text-brand-violet-700 transition-colors hover:text-brand-violet-500 dark:text-brand-violet-300 dark:hover:text-brand-violet-200" to="/auth/login">
                Sign in here.
              </Link>
            </p>
          </form>
        </Form>
    </section>
  );
}

export default Register;
