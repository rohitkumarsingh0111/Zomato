import axios from "axios";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
} from "react";

import { authService } from "../main";
import type { AppContextType, LocationData, User } from "../types";

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const [location, setLocation] = useState<LocationData | null>(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [city, setCity] = useState("Fetching Location...");

    // ✅ Fetch User (optimized + safe)
    const fetchUser = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            const { data } = await axios.get(
                `${authService}/api/auth/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUser(data);
            setIsAuth(true);
        } catch (error) {
            console.log("User fetch error:", error);
            setIsAuth(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // ✅ Fetch Location (fixed infinite loop + error handling)
    useEffect(() => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            setCity("Not Supported");
            return;
        }

        setLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const res = await fetch(
                        `/geo/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();

                    setLocation({
                        latitude,
                        longitude,
                        formattedAddress:
                            data.display_name || "Current Location",
                    });

                    setCity(
                        data.address?.city ||
                            data.address?.town ||
                            data.address?.village ||
                            "Your Address"
                    );
                } catch (error) {
                    console.error("Location fetch error:", error);

                    setLocation({
                        latitude,
                        longitude,
                        formattedAddress: "Current Location",
                    });

                    setCity("Failed to load");
                } finally {
                    setLoadingLocation(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                setCity("Permission denied");
                setLoadingLocation(false);
            }
        );
    }, []);

    return (
        <AppContext.Provider
            value={{
                isAuth,
                loading,
                setIsAuth,
                setLoading,
                setUser,
                user,
                location,
                loadingLocation,
                city,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppData = (): AppContextType => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("useAppData must be used within AppProvider");
    }

    return context;
};