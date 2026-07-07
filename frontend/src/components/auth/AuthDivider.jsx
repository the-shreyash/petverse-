const AuthDivider = ({ text = "OR" }) => {
  return (
    <div className="relative flex py-3 items-center select-none">
      <div className="flex-grow border-t border-slate-200/60" />
      <span className="flex-shrink mx-4 text-xs font-semibold tracking-widest text-slate-400 uppercase">
        {text}
      </span>
      <div className="flex-grow border-t border-slate-200/60" />
    </div>
  );
};

export default AuthDivider;
