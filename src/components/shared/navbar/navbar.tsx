"use client";

import { Button, Modal } from "@mantine/core";
import { ArrowRight, UserCircle2Icon, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useMeQuery } from "@/api/query/user.query";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { notifications } from "@mantine/notifications";

import { useQueryClient } from "@tanstack/react-query";

const Navbar: FC = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const [opened, { open, close }] = useDisclosure(false);

  const { data: user, isLoading , refetch} = useMeQuery();

  const queryClient = useQueryClient(); // ✅ instance, not class

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user]);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    try {
      localStorage.clear();
      await axios.post("/api/logout");
      // queryClient.removeQueries({ queryKey: ["me"] });
      // await queryClient.refetchQueries({ queryKey: ["me"] });
      queryClient.clear();
      router.replace("/login");
    } catch {
      notifications.show({
        title: "Logout failed",
        message: "An error occurred while logging out.",
        color: "red",
      });
    }
  }

  async function handleLogin() {
    try {
      localStorage.clear();
      await axios.post("/api/logout");
       await refetch();
      router.replace("/login");
    } catch {
      notifications.show({
        title: "Login failed",
        message: "An error occurred while logging in.",
        color: "red",
      });
    }
  }

  const navigationItems = [
    { label: "Fast Quote", path: "/get-a-quote" },
    { label: "My Quotes", path: "/my-quotes" },
    { label: "Tracking Updates", path: "/tracking-updates" },
  ];

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <React.Fragment>
      <nav className="fixed top-0 left-0 w-full z-50 shadow-md">
        <motion.div
          initial={false}
          animate={{
            marginTop: 0,
            borderRadius: 0,
            width: "100%",
            backgroundColor: "rgba(255,255,255,1)",
            boxShadow: scrolled
              ? "0 2px 8px rgba(0,0,0,0.08)"
              : "0 2px 8px rgba(0,0,0,0.05)",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="mx-auto"
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
            {/* Logo */}
            <div
              onClick={() => router.push("/")}
              className="text-2xl font-semibold cursor-pointer flex-shrink-0"
            >
              <Image
                src="https://meridian.ociuzerp.in/media/logowhitepngwebp.webp"
                alt="Meridian Express Logistics Logo"
                height={40}
                width={120}
                className="h-8 w-auto sm:h-10"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoading && <div className="h-[2.7rem] p-5"></div>}

              {user && (
                <Button
                  leftSection={
                    <UserCircle2Icon size={16} className="inline-block" />
                  }
                  h={"2.7rem"}
                  variant="light"
                  onClick={() => router.push("/user-info")}
                  className="text-sm"
                >
                  {user.firstName}
                </Button>
              )}

              {!isLoading && !user && (
                <Button
                  onClick={() => handleLogin()}
                  leftSection={
                    <UserCircle2Icon size={16} className="inline-block" />
                  }
                  h={"2.7rem"}
                  variant="light"
                >
                  Login
                </Button>
              )}

              {user && (
                <Button
                  h={"2.7rem"}
                  rightSection={
                    <ArrowRight size={16} className="inline-block" />
                  }
                  onClick={open}
                >
                  Logout
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
          </div>

          {/* Desktop Sub Navigation */}
          {pathname !== "/" && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block bg-white border-t-2 border-[#01137e]"
            >
              <div className="max-w-7xl mx-auto px-4 text-[#01137e] flex items-center font-semibold">
                {navigationItems.map(({ label, path }) => (
                  <div
                    key={path}
                    className={`p-2 cursor-pointer px-4 transition-all duration-200 ${
                      pathname === path
                        ? "bg-[#01137e] text-white"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => router.push(path)}
                  >
                    <p className="text-sm lg:text-base">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-t border-gray-300 shadow-lg overflow-hidden"
            >
              <div className="px-4 py-2 space-y-2">
                {/* User Info Section */}
                <div className="py-2 border-b border-gray-100">
                  {isLoading && (
                    <div className="h-12 flex items-center">
                      <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                    </div>
                  )}

                  {user && (
                    <div className="space-y-2">
                      <Button
                        fullWidth
                        leftSection={
                          <UserCircle2Icon size={16} className="inline-block" />
                        }
                        variant="light"
                        onClick={() => router.push("/user-info")}
                        className="justify-start"
                      >
                        {user.firstName}
                      </Button>
                      <Button
                        fullWidth
                        rightSection={
                          <ArrowRight size={16} className="inline-block" />
                        }
                        onClick={open}
                        className="justify-start"
                      >
                        Logout
                      </Button>
                    </div>
                  )}

                  {!isLoading && !user && (
                    <Button
                      fullWidth
                      onClick={() => handleLogin()}
                      leftSection={
                        <UserCircle2Icon size={16} className="inline-block" />
                      }
                      variant="light"
                      className="justify-start"
                    >
                      Login
                    </Button>
                  )}
                </div>

                {/* Navigation Items - Only show if not on homepage */}
                {pathname !== "/" && (
                  <div className="py-2 space-y-1">
                    {navigationItems.map(({ label, path }) => (
                      <button
                        key={path}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          pathname === path
                            ? "bg-[#01137e] text-white"
                            : "text-[#01137e] hover:bg-gray-100"
                        }`}
                        onClick={() => router.push(path)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Logout Confirmation Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={<p className="text-lg font-semibold">Confirm logout</p>}
        size="sm"
      >
        <div className="flex flex-col">
          <p className="text-sm md:text-base">
            Are you sure you want to logout? <br />
            <span className="text-[#01137e] font-medium">
              You will need to login again to access your account.
            </span>
          </p>
          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" onClick={close} className="text-sm">
              Cancel
            </Button>
            <Button
              onClick={() => {
                close();
                handleLogout();
              }}
              className="bg-[#01137e] text-white text-sm"
            >
              Yes, Logout
            </Button>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default Navbar;
