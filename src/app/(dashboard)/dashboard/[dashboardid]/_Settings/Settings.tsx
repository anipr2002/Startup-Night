"use client";
import React, { use, useEffect } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { CameraIcon, Settings, SettingsIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changeUsername, getUserDetails } from "@/actions/userActions";
import { getCurrentUser } from "../../_components/util";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useHouseHoldIDStore from "@/store/store";
import {
  getHouseholdAdminId,
  getHouseholdNameFromId,
  deleteHousehold,
} from "@/actions/householdActions";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter, usePathname } from "next/navigation";

const SettingsMenu = () => {
  const [userData, setUserData] = React.useState({
    userID: "",
    username: "",
    email: "",
    imageUrl: "",
    isAdmin: false,
  });
  const [householdName, setHouseholdName] = React.useState<string>("");

  const { householdId } = useHouseHoldIDStore();

  const FormSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });
  const onSubmit = React.useCallback(
    (data: z.infer<typeof FormSchema>) => {
      changeUsername(userData.userID, data.username);
    },
    [userData.userID]
  );

  useEffect(() => {
    const fetchData = async () => {
      const user = await getCurrentUser();
      if (user) {
        const userDetails = await getUserDetails(user);
        const adminId = await getHouseholdAdminId(householdId);
        const isAdmin = adminId === user;
        let householdName = "";
        if (isAdmin) {
          householdName = (await getHouseholdNameFromId(householdId)) || "";
        }

        setUserData({
          userID: user,
          username: userDetails?.username || "",
          email: userDetails?.email || "",
          imageUrl: userDetails?.imageUrl ?? "",
          isAdmin,
        });

        setHouseholdName(householdName);
      }
    };

    fetchData();
  }, [householdId]);

  console.log("Username", userData.username);

  const { setTheme, theme } = useTheme();

  const router = useRouter();

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="link" size="icon" className="ml-auto">
            <Settings className="h-6 w-6 text-muted-foreground" />
            <span className="sr-only">Open settings</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full max-w-md">
          <div className="flex flex-col gap-8 p-6">
            <div>
              <h2 className="text-xl font-bold">Profile</h2>
              <div className="mt-4 grid grid-cols-[80px_1fr] items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userData.imageUrl} alt="User avatar" />
                    <AvatarFallback>
                      {userData.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-2 -bottom-2 rounded-full"
                  >
                    <CameraIcon className="h-5 w-5" />
                    <span className="sr-only">Change profile image</span>
                  </Button>
                </div>
                <div className="space-y-2">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="w-full space-y-6"
                    >
                      <div className="flex gap-x-2">
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder={userData.username}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit">Change</Button>
                      </div>
                    </form>
                  </Form>
                  <Input defaultValue={userData.email} type="email" />
                </div>
              </div>
            </div>
            {userData.isAdmin && (
              <>
                <div>
                  <h2 className="text-xl font-bold">Admin</h2>
                  <div className="mt-4 flex items-center justify-between">
                    <Label htmlFor="householdName">Household Name</Label>
                    <Input defaultValue={householdName} />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        deleteHousehold(householdId).then(() => {
                          router.push("/dashboard");
                        });
                      }}
                    >
                      Delete Household
                    </Button>
                  </div>
                </div>
              </>
            )}

            <div>
              <h2 className="text-xl font-bold">Appearance</h2>
              <div className="mt-4 flex items-center justify-between">
                <span>Dark Mode</span>
                <ToggleGroup type="single">
                  <ToggleGroupItem
                    value="light"
                    onClick={() => {
                      setTheme("light");
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("rounded-md")}
                    >
                      <Sun className="h-5 w-5" />
                    </Button>
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="dark"
                    onClick={() => {
                      setTheme("dark");
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("rounded-md")}
                    >
                      <Moon className="h-5 w-5" />
                    </Button>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
          <SheetFooter className="border-t p-4">
            <Button className="ml-auto">Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SettingsMenu;
