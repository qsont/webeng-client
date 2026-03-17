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

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: registerFields.reduce((accumulator, field) => {
      accumulator[field.name] = "";
      return accumulator;
    }, {}),
  });

  const register = useAuthStore((state) => state.register);

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
    <main className="flex items-center min-h-screen bg-background px-4 py-10">
      <section className="mx-auto w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Register</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create your account to get started.</p>

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
                <Label className="mb-2">{field.label}</Label>
                <Input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="ui-field"
                  {...form.register(field.name)}
                />
                {form.formState.errors[field.name] ? (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors[field.name].message}
                  </p>
                ) : null}
              </div>
            ))}

            <Button type="submit" className="w-full rounded-full bg-brand-violet-600 hover:bg-brand-violet-700">
              Register
            </Button>

            <p className="mt-1 text-sm text-muted-foreground text-center">
              Already have an account? {" "}
              <a className="text-brand-accent-400 hover:text-brand-accent-700 transition-colors" href="./login">
                Sign in here.
              </a>
            </p>
          </form>
        </Form>
      </section>
    </main>
  );
}

export default Register;
