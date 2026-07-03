const dots = [
  "top-20 left-24",
  "top-36 right-10",
  "bottom-40 left-10",
  "bottom-24 right-24",
];

const FloatingDots = () => {
  return (
    <>
      {dots.map((dot, index) => (
        <span
          key={index}
          className={`
            absolute
            h-3
            w-3
            rounded-full
            bg-emerald-400
            opacity-40
            ${dot}
          `}
        />
      ))}
    </>
  );
};

export default FloatingDots;