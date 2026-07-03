import Aurora from "./Aurora";
import GridPattern from "./GridPattern";
import NoiseTexture from "./NoiseTexture";

const Background = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <Aurora />
      <GridPattern />
      <NoiseTexture />
    </div>
  );
};

export default Background;