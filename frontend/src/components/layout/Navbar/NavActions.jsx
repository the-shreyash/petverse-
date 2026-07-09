import { Link } from "react-router-dom";
import Button from "../../ui/Button";

const NavActions = () => {
  return (
    <div className="hidden items-center gap-4 lg:flex">
      <Link
        to="/login"
        className="font-medium text-gray-700 transition hover:text-emerald-600 cursor-pointer"
      >
        Sign In
      </Link>

      <Link to="/register" className="cursor-pointer">
        <Button>
          Get Started
        </Button>
      </Link>
    </div>
  );
};

export default NavActions;