import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle} from "react-icons/fc"

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const responseGoogle = async (authResult : any) => {
        setLoading(true);
        try {
            const result = await axios.post(`${authService}/api/auth/login`, {
                code: authResult["code"],
            });

            localStorage.setItem("token", result.data.token);
            toast.success(result.data.message);
            setLoading(false);
            navigate("/")
            } catch(error) {
                console.log("Problem while login");
                setLoading(false);
                
            }   
    };
    const GoogleLogin = useGoogleLogin ({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: "auth-code",
    });

    
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm space-y-6">
            <h1 className="text-center text-3xl font-bold text-[#e23737]">
                Zomato

            </h1>
            <p className="text-center text-sm text-gray-500">
                Login or sign up to continue
            </p>
            <button onClick={GoogleLogin} disabled= {loading} className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-3 py-2">
                <FcGoogle size={20}/> {loading? "Signing in...": "Continue with Google"}
            </button>

            <p className="text-center text-xs text-gray-400">
                By continuing, you agree with our {" "}
                <span className="text-[#e23737]">Terms of Services</span> &{" "}
                <span className="text-[#e23737]">Privacy</span> {" "}
            </p>

        </div>
    </div>
  )
}

export default Login