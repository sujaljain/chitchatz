import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client.js";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (password != confirmPassword) {
      toast.error("Password and Confirm Password should match");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      // alert("Done Bhaisaab!");
      const response = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );

      console.log({ response });

      if (response.status === 201) {
        setUserInfo(response.data.user);
        navigate("/profile");
      }
    }
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );

      console.log({ response });

      if (response.data.user.id) {
        setUserInfo(response.data.user);
        if (response.data.user.profileSetup) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      }
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="h-[85vh] w-[90vw] bg-white border border-gray-300 shadow-lg md:w-[80vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 overflow-hidden">
        <div className="flex flex-col gap-8 items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold md:text-5xl text-blue-900 flex justify-center items-center">
              Welcome <img src={Victory} alt="victory_img" className="h-20" />
            </h1>
            <p className="font-medium text-gray-600 mt-4">
              Fill in the details to get started with the best realtime chatting
              application made with ❤️ by our founder: Mr. Sujal Jain!
            </p>
          </div>
          <div className="w-full">
            <Tabs className="w-full" defaultValue="login">
              <TabsList className="flex justify-center bg-gray-100 rounded-lg p-2 shadow-md">
                <TabsTrigger
                  value="login"
                  className="w-1/2 text-center py-2 text-gray-700 font-medium rounded-lg transition-all duration-300 hover:bg-blue-100 focus:ring-2 focus:ring-blue-700 focus:outline-none data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="w-1/2 text-center py-2 text-gray-700 font-medium rounded-lg transition-all duration-300 hover:bg-blue-100 focus:ring-2 focus:ring-blue-700 focus:outline-none data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                >
                  SignUp
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-4 mt-6" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-lg p-4 border border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-lg p-4 border border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="rounded-lg p-4 bg-blue-700 text-white font-semibold hover:bg-blue-800 focus:ring-2 focus:ring-blue-700 focus:outline-none transition-all duration-300"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-4 mt-6" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-lg p-4 border border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-lg p-4 border border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-lg p-4 border border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  className="rounded-lg p-4 bg-blue-700 text-white font-semibold hover:bg-blue-800 focus:ring-2 focus:ring-blue-700 focus:outline-none transition-all duration-300"
                  onClick={handleSignup}
                >
                  Sign Up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center bg-purple-100">
          <img
            src={Background}
            alt="background_login_img"
            className="h-[80%] object-contain drop-shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
