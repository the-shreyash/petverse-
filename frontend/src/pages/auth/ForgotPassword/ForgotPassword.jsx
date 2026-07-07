import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <AuthLayout
      title="Forgot Password? 🔒"
      subtitle="Enter your email to receive password recovery instructions."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPassword;
