import AuthLayout from "@/components/auth/AuthLayout";
import VerifyOTPForm from "./VerifyOTPForm";

const VerifyOTP = () => {
  return (
    <AuthLayout
      title="Verify Account ✉️"
      subtitle="Enter the 6-digit code sent to your email address."
    >
      <VerifyOTPForm />
    </AuthLayout>
  );
};

export default VerifyOTP;
