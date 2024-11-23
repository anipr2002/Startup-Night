import { create } from "zustand";

type HouseHoldStore = {
    householdId: string;
    setHouseholdId: (householdId: string) => void;
    householdName: string;
    setHouseholdName: (householdName: string) => void;
}

const useHouseHoldIDStore = create<HouseHoldStore>((set) => ({
    householdId: "",
    setHouseholdId: (householdId: string) => set({
        householdId: householdId,
    }),
    householdName: "",
    setHouseholdName: (householdName: string) => set({
        householdName: householdName,
    }),
}));

export default useHouseHoldIDStore;

type HouseholdStore = {
   openCreateHousehold: boolean;
   setOpenCreateHousehold: (open: boolean) => void;
   openJoinHousehold: boolean;
   setOpenJoinHousehold: (open: boolean) => void;
}

export const useHouseholdStore = create<HouseholdStore>((set) => ({
    openCreateHousehold: false,
    setOpenCreateHousehold: (open: boolean) => set({
        openCreateHousehold: open,
    }),
    openJoinHousehold: false,
    setOpenJoinHousehold: (open: boolean) => set({
        openJoinHousehold: open,
    }),
}));