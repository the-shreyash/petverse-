const Label = ({
  children,
  className = "",
}) => {
  return (
    <span
      className={`
        text-sm
        font-medium
        tracking-wide
        uppercase
        text-emerald-600
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Label;