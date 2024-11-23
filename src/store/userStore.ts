import { create } from "zustand";
import { User } from "@/db/schema";

type UserStore = {
    user: Partial<User>;
    setUser: (user: Partial<User>) => void;
}

const useUserStore = create<UserStore>((set) => ({
    user: {
        id: "",
        username: "",
        email: "",
        imageUrl: "",
        // createdAt: new Date(),
    },
    setUser: (user: Partial<User>) => set({
        user: {
            ...user,
            // createdAt: new Date(),
        },
    }),
}));

export default useUserStore;