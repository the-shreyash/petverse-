import { useAuthHover } from "@/hooks/useAuthHover";
import Button from "@/components/ui/Button";

const AuthButton = ({
  children,
  isLoading,
  className = "",
  disabled,
  ...props
}) => {
  const { setIsHoveringButton } = useAuthHover();

  return (
    <Button
      onMouseEnter={() => setIsHoveringButton(true)}
      onMouseLeave={() => setIsHoveringButton(false)}
      disabled={disabled || isLoading}
      className={`
        w-full
        rounded-xl
        disabled:opacity-50
        disabled:pointer-events-none
        flex items-center justify-center gap-2
        cursor-pointer
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        children
      )}
    </Button>
  );
};

export default AuthButton;
