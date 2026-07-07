import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPassword = () => {
  return (
    <AuthLayout
      title="Reset Password 🔑"
      subtitle="Create a strong, secure new password for your account."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPassword;
