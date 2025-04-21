import Lottie from "react-lottie";
import animationData from "@/assets/lottie-json.json";

const Welcome = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Lottie options={defaultOptions} height={300} width={300} />
      <h1 className="text-4xl font-bold mt-5">Welcome to ChitChatz!</h1>
    </div>
  );
};

export default Welcome;
