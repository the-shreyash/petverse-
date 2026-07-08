import Aurora from "@/components/ui/Background/Aurora";
import GridPattern from "@/components/ui/Background/GridPattern";
import NoiseTexture from "@/components/ui/Background/NoiseTexture";

const AuthBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Aurora />
      <GridPattern />
      <NoiseTexture />
    </div>
  );
};

export default AuthBackground;
