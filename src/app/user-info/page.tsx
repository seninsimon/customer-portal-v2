"use client";

import {
  Loader,
  Avatar,
  Button,
  Modal,
  PasswordInput,
  Group,
  Box,
  Text,
  Card,
  Divider,
  Alert,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  User,
  Phone,
  MapPin,
  Contact,
  Key,
  Shield,
  Check,
  X,
} from "lucide-react";

import { useCustomerInfo } from "@/api/query/customer-info.query";
import { useMeQuery } from "@/api/query/user.query";
import { Customer } from "@/api/query/types/customer-info/customer-info.type";
import { useResetPasseword } from "@/api/mutation/resetPassword.mutation";

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function CustomerDetailsPage() {
  const {
    data: customerData,
    isLoading: customerLoading,
    isError: customerError,
  } = useCustomerInfo();
  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } = useMeQuery();
  const { mutateAsync: resetPassword } =
    useResetPasseword();

  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<ChangePasswordForm>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      currentPassword: (value) =>
        !value ? "Current password is required" : null,
      newPassword: (value) => {
        if (!value) return "New password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.newPassword ? "Passwords do not match" : null,
    },
  });

  const handleChangePassword = async (values: ChangePasswordForm) => {
    try {
      const payload: ChangePasswordForm = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      };

      // 🔹 Call the reset password mutation
      await resetPassword(payload);

      notifications.show({
        title: "Password changed successfully",
        message: "Your password has been updated",
        color: "green",
        icon: <Check size={16} />,
      });

      form.reset();
      close();
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Please check your current password and try again";

      notifications.show({
        title: "Failed to change password",
        message: errMsg,
        color: "red",
        icon: <X size={16} />,
      });
    }
  };

  const isLoading = customerLoading || userLoading;
  const isError = customerError || userError;

  if (isLoading) {
    return (
      <div className="bg-gray-50 pt-24 sm:pt-28 md:pt-32 lg:pt-40 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <Loader size="lg" color="blue" />
              <p className="text-gray-600 text-sm sm:text-base">
                Loading customer details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gray-50 pt-24 sm:pt-28 md:pt-32 lg:pt-40 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="bg-white rounded-xl p-8 sm:p-12 border border-red-200 shadow-sm max-w-md w-full">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 mb-4 flex items-center justify-center rounded-full bg-red-50">
                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Unable to load details
                </h3>
                <p className="text-red-600 text-sm sm:text-base">
                  Failed to load customer details. Please try again later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const customer: Customer = customerData?.data?.[0];
  const user = userData;

  return (
    <div className="bg-gray-50 pt-24 sm:pt-28 md:pt-32 lg:pt-40 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* User Information Card */}
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="bg-white"
          >
            <Card.Section withBorder inheritPadding py="xs">
              <Group justify="space-between">
                <Text fw={500} size="lg">
                  User Information
                </Text>
                <Shield size={20} className="text-blue-600" />
              </Group>
            </Card.Section>

            <div className="flex flex-col items-center text-center mt-6 mb-6">
              <Avatar size="xl" radius="100%" color="blue" className="mb-4">
                {user?.firstName?.charAt(0).toUpperCase() || "U"}
              </Avatar>
              <Text fw={600} size="xl" className="text-gray-800 mb-1">
                {user?.firstName}
              </Text>
              <Text c="dimmed" size="sm">
                {user?.email || "No email provided"}
              </Text>
            </div>

            <Divider my="md" />

            <div className="space-y-4">
              <Group>
                <Text fw={500} c="dimmed" size="sm">
                  User ID:
                </Text>
                <Text size="sm">{user?.docNo || "N/A"}</Text>
              </Group>
              <Group>
                <Text fw={500} c="dimmed" size="sm">
                  Status:
                </Text>
                <Text
                  size="sm"
                  className={`capitalize ${
                    user?.status === "Active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {user?.status || "N/A"}
                </Text>
              </Group>
              <Group>
                <Text fw={500} c="dimmed" size="sm">
                  Username:
                </Text>
                <Text size="sm">{user?.userName || "N/A"}</Text>
              </Group>
              <Group>
                <Text fw={500} c="dimmed" size="sm">
                  phone:
                </Text>
                <Text size="sm">{user?.phone || "N/A"}</Text>
              </Group>
            </div>

            <Button
              fullWidth
              mt="md"
              leftSection={<Key size={16} />}
              onClick={open}
              variant="light"
            >
              Change Password
            </Button>
          </Card>

          {/* Customer Profile Card */}
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="bg-white"
          >
            <Card.Section withBorder inheritPadding py="xs">
              <Group justify="space-between">
                <Text fw={500} size="lg">
                  Customer Profile
                </Text>
                <User size={20} className="text-green-600" />
              </Group>
            </Card.Section>

            {/* Profile Header */}
            <div className="flex flex-col items-center text-center mt-6 mb-6">
              <Avatar size="xl" radius="100%" color="green" className="mb-4">
                {customer?.customerName?.charAt(0).toUpperCase() || "C"}
              </Avatar>
              <Text fw={600} size="xl" className="text-gray-800 mb-1">
                {customer?.customerName || "Unknown Customer"}
              </Text>
              <Text c="dimmed" size="sm">
                {customer?.email || "No email provided"}
              </Text>
            </div>

            <Divider my="md" />

            {/* Contact Information */}
            <div className="space-y-4">
              <Text fw={500} size="md" className="text-gray-800 mb-2">
                Contact Information
              </Text>

              {/* Phone */}
              <Group align="flex-start">
                <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <Box style={{ flex: 1 }}>
                  <Text fw={500} c="dimmed" size="sm">
                    Phone Number
                  </Text>
                  <Text size="sm" className="break-all">
                    {customer?.mobile || "Not provided"}
                  </Text>
                </Box>
              </Group>

              {/* Address */}
              <Group align="flex-start">
                <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <Box style={{ flex: 1 }}>
                  <Text fw={500} c="dimmed" size="sm">
                    Address
                  </Text>
                  <Text size="sm" className="break-words leading-relaxed">
                    {customer?.address || "Not provided"}
                  </Text>
                </Box>
              </Group>

              {/* Contact Person */}
              <Group align="flex-start">
                <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                  <Contact className="w-4 h-4 text-purple-600" />
                </div>
                <Box style={{ flex: 1 }}>
                  <Text fw={500} c="dimmed" size="sm">
                    Contact Person
                  </Text>
                  <Text size="sm" className="break-all">
                    {customer?.contactName || "Not provided"}
                  </Text>
                </Box>
              </Group>
            </div>
          </Card>
        </div>

        {/* Footer Space */}
        <div className="pb-8"></div>
      </div>

      {/* Change Password Modal */}
      <Modal
        opened={opened}
        onClose={() => {
          close();
          form.reset();
        }}
        title={
          <Group>
            <Key size={20} />
            <Text fw={500}>Change Password</Text>
          </Group>
        }
        size="md"
        centered
      >
        <Alert color="blue" variant="light" mb="md">
          Please enter your current password and set a new password.
        </Alert>

        <form onSubmit={form.onSubmit(handleChangePassword)}>
          <PasswordInput
            label="Current Password"
            placeholder="Enter your current password"
            required
            {...form.getInputProps("currentPassword")}
            mb="xs"
            styles={{
              input: { padding: "6px 8px", fontSize: "13px" },
              label: { fontSize: "13px", marginBottom: "4px" },
            }}
          />

          <PasswordInput
            label="New Password"
            placeholder="Enter your new password"
            required
            {...form.getInputProps("newPassword")}
            mb="xs"
            styles={{
              input: { padding: "6px 8px", fontSize: "13px" },
              label: { fontSize: "13px", marginBottom: "4px" },
            }}
          />

          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm your new password"
            required
            {...form.getInputProps("confirmPassword")}
            mb="xs"
            styles={{
              input: { padding: "6px 8px", fontSize: "13px" },
              label: { fontSize: "13px", marginBottom: "4px" },
            }}
          />

          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={() => {
                close();
                form.reset();
              }}
               h={30}
              px={12}
              radius="sm"
              fw={500}
              color="white"
              type="submit"
              styles={{
                root: {
                  backgroundColor: "#1E3A8A",
                  fontSize: "13px",
                  padding: "4px 10px",
                  height: "30px",
                  borderRadius: "6px",
                  "&:hover": {
                    backgroundColor: "#2563EB",
                  },
                },
              }}
            >
              Cancel
            </Button>
            <Button
              h={30}
              px={12}
              radius="sm"
              fw={500}
              color="blue"
              variant="filled"
              type="submit"
              styles={{
                root: {
                  backgroundColor: "#1E3A8A",
                  fontSize: "13px",
                  padding: "4px 10px",
                  height: "30px",
                  borderRadius: "6px",
                  "&:hover": {
                    backgroundColor: "#2563EB",
                  },
                },
              }}
            >
              Change Password
            </Button>
          </Group>
        </form>
      </Modal>
    </div>
  );
}
