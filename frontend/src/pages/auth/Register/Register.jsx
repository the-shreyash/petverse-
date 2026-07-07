import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "./RegisterForm";

const Register = () => {
  return (
    <AuthLayout
      title="Create Account 🐾"
      subtitle="Join PetVerse and unlock premium AI pet care."
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
