import Button from "../../ui/Button";

const NavActions = () => {
  return (
    <div className="hidden items-center gap-4 lg:flex">
      <button className="font-medium text-gray-700 transition hover:text-emerald-600">
        Sign In
      </button>

      <Button>
        Get Started
      </Button>
    </div>
  );
};

export default NavActions;