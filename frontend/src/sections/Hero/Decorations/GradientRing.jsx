const GradientRing = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

      <div
        className="
          h-[580px]
          w-[580px]
          rounded-full
          border
          border-emerald-200/60
        "
      />

      <div
        className="
          absolute
          h-[720px]
          w-[720px]
          rounded-full
          border
          border-cyan-100/60
        "
      />

    </div>
  );
};

export default GradientRing;