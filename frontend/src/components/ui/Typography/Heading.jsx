const Heading = ({
  children,
  className = "",
}) => {
  return (
    <h2
      className={`
        text-3xl
        md:text-4xl
        lg:text-5xl
        font-bold
        tracking-tight
        text-gray-900
        ${className}
      `}
    >
      {children}
    </h2>
  );
};

export default Heading;