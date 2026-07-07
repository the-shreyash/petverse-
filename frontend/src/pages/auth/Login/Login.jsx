import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <AuthLayout
      title="Welcome Back 👋"
      subtitle="Continue your pet care journey with PetVerse."
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;