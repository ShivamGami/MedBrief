import { createContext, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";
import type { User } from "../Config/Types";

type RoleType = "doctor" | "patient" | null;

export const AuthContext = createContext<{
    role: RoleType;
    setrole: Dispatch<SetStateAction<RoleType>>;
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
} | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [role, setrole] = useState<RoleType>(null);
    const [user, setUser] = useState<User | null>(null);

    return (
        <AuthContext.Provider value={{ role, setrole, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}