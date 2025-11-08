"use client";

import React, { FC, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  Button,
  NumberInput,
  Select,
  Checkbox,
  Modal,
  Grid,
  Stack,
  Radio,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import DeleteActionButton from "@/components/shared/action-buttons/delete.action";
import { useEnquiryMutation } from "@/api/mutation/enquiry.mutation";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import {
  enqDetailsPropsType,
  EnquiryPropsType,
} from "@/types/get-a-quote/quote-form.type";
import { useDropDown } from "@/api/query/drop-down.query";
import { Country, setmDocNoType } from "@/types/quote.form/quote.form.type";
import { useCitiesQuery } from "@/api/query/city.query";

const QuoteForm: FC = () => {
  const { mutate, isPending } = useEnquiryMutation();
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<EnquiryPropsType>({
    initialValues: {
      docDate: new Date(),
      stmDocNo: "",
      cusDocNo: "",
      originCountry: "231",
      destinationCountry: "",
      setmDocNo: "",
      slmDocNo: "",
      grossWeight: 0,
      totalPackage: 0,
      totalWeight: 0,
      volumeWeight: 0,
      chargeableWeight: 0,
      time: "",
      dimFactor: 0,
      originCity: "",
      originPostalCode: "",
      destinationCity: "",
      destinationPostalCode: "",
      isDangerous: false,
      isNonStackable: false,
      isFreightService: true,
      cargoType: "general",
      enqDetails: [
        {
          id: "1",
          actWeight: 0,
          length: 0,
          breadth: 0,
          height: 0,
          volumeWeight: 0,
          girth: 0,
          chargeableWeight: 0,
          status: "pending",
          quantity: 0,
          lengthInCm: 0,
          breadthInCm: 0,
          heightInCm: 0,
          actWeightInKg: 0,
        },
      ],
    },
    validate: {
      originCountry: (value) =>
        value.trim().length > 0 ? null : "Origin country is required",
      destinationCountry: (value) =>
        value.trim().length > 0 ? null : "Destination country is required",
      // originCity: (value) =>
      //   value.trim().length > 0 ? null : "Origin city is required",
      // destinationCity: (value) =>
      //   value.trim().length > 0 ? null : "Destination city is required",
      // originPostalCode: (value) =>
      //   value.trim().length > 0 ? null : "Origin postal code is required",
      // destinationPostalCode: (value) =>
      //   value.trim().length > 0 ? null : "Destination postal code is required",
      setmDocNo: (value) =>
        value.trim().length > 0 ? null : "Service type is required",
      enqDetails: {
        actWeight: (value) =>
          value > 0 ? null : "Weight must be greater than 0",
        lengthInCm: (value) =>
          value > 0 ? null : "Length must be greater than 0",
        breadthInCm: (value) =>
          value > 0 ? null : "Breadth must be greater than 0",
        heightInCm: (value) =>
          value > 0 ? null : "Height must be greater than 0",
        quantity: (value) => (value > 0 ? null : "Quantity must be at least 1"),
      },
    },
  });

  const addItem = () => {
    const newItem: enqDetailsPropsType = {
      id: Date.now().toString(),
      actWeight: 0,
      length: 0,
      breadth: 0,
      height: 0,
      volumeWeight: 0,
      girth: 0,
      chargeableWeight: 0,
      status: "pending",
      quantity: 0,
      lengthInCm: 0,
      breadthInCm: 0,
      heightInCm: 0,
      actWeightInKg: 0,
    };
    form.setFieldValue("enqDetails", [...form.values.enqDetails, newItem]);
  };

  const removeItem = (id: string) => {
    if (form.values.enqDetails.length > 1) {
      form.setFieldValue(
        "enqDetails",
        form.values.enqDetails.filter((item) => item.id !== id)
      );
    }
  };

  const { data: countries, isLoading: isCountriesLoading } =
    useDropDown<Country>("CNTRY");

  const { data: setmDocNo, isLoading: isServiceLoading } =
    useDropDown<setmDocNoType>("SETM");


    const { data: originCities } = useCitiesQuery(form.values.originCountry);
      const { data: destinationCities } = useCitiesQuery(form.values.destinationCountry);
    

  const serviceTypeMap: Record<string, string> = {
    1000: "SeaFreight(FCL/LCL)",
    1001: "AirExpress/Economy&Freight",
    1002: "RoadFreight(GCC)",  
  };

  const serviceOptions = setmDocNo
    ?.filter((item) => item.value !== "1000") // hide sea
    .map((item) => ({
      value: item.value,
      label: serviceTypeMap[item.value] || item.value,
    }));

  const handleSubmit = (values: EnquiryPropsType) => {
    const updatedDetails = values.enqDetails.map((item) => {
      const weight = (item.actWeight || 0) * (item.quantity || 1);
      return { ...item, chargeableWeight: weight };
    });

    const totalChargeable = updatedDetails.reduce(
      (sum, item) => sum + item.chargeableWeight,
      0
    );

    const updatedValues = {
      ...values,
      enqDetails: updatedDetails,
      chargeableWeight: totalChargeable,
    };
    mutate(updatedValues, {
      onSuccess: () => {
        form.reset()
        open();
      },
      onError: (err) => {
        notifications.show({
          title: "Error",
          message: err.message,
          color: "red",
        });
      },
    });
  };

  const totalChargeableWeight = form.values.enqDetails.reduce(
    (total, item) => total + (item.actWeight || 0) * (item.quantity || 1),
    0
  );

  useEffect(() => {
    form.setFieldValue("chargeableWeight", totalChargeableWeight);
  }, [totalChargeableWeight]);

  // Function to handle country change and reset city/postal code
  const handleCountryChange = (field: string, value: string) => {
    form.setFieldValue(field, value);

    // Reset corresponding city and postal code when country changes
    if (field === "originCountry") {
      form.setFieldValue("originCity", "");
      form.setFieldValue("originPostalCode", "");
    } else if (field === "destinationCountry") {
      form.setFieldValue("destinationCity", "");
      form.setFieldValue("destinationPostalCode", "");
    }
  };

  // Check if origin country is selected to enable origin fields
  const isOriginCountrySelected = !!form.values.originCountry;
  // Check if destination country is selected to enable destination fields
  const isDestinationCountrySelected = !!form.values.destinationCountry;

  return (
    <div className="max-w-4xl mx-auto ">
      <div className="rounded-xl ">
        {/* Header */}
        <div className="text-left mb-5">
          <h1 className="text-xl font-bold text-gray-900">Fast Quote</h1>
          <p className="text-gray-600 text-sm mt-1">
            Fill in your shipment details for an instant quote
          </p>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {/* Service & Location */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 text-base">
                Shipment Details
              </h3>

              <Grid gutter="md">
                {/* Service Type */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Service Type"
                    placeholder={
                      isServiceLoading ? "Loading..." : "Select Service"
                    }
                    description="Choose your preferred shipping method"
                    data={serviceOptions}
                    searchable
                    withAsterisk
                    size="sm"
                    styles={{
                      input: {
                        padding: "12px",
                        height: "42px",
                      },
                    }}
                    value={form.values.setmDocNo}
                    onChange={(value) =>
                      form.setFieldValue("setmDocNo", value || "")
                    }
                  />
                </Grid.Col>

                {/* Spacer */}
                <Grid.Col span={{ base: 12, md: 6 }}></Grid.Col>

                {/* Origin Section */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <div className="mb-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Origin Details
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <Select
                      label="Origin Country"
                      placeholder={
                        isCountriesLoading
                          ? "Loading..."
                          : "Select origin country"
                      }
                      data={countries}
                      searchable
                      withAsterisk
                      size="sm"
                      styles={{
                        input: {
                          padding: "12px",
                          height: "42px",
                        },
                      }}
                      {...form.getInputProps("originCountry")}
                      onChange={(value) =>
                        handleCountryChange("originCountry", value || "")
                      }
                    />

                    {/* City and Postal Code in same row */}
                    <Grid gutter="sm">
                      <Grid.Col span={6}>
                        <Select
                          label="Origin City"
                          placeholder={
                            isOriginCountrySelected
                              ? "Enter origin city"
                              : "Select country first"
                          }
                          withAsterisk
                          size="sm"
                          data={originCities || []}
                          disabled={!isOriginCountrySelected}
                          styles={{
                            input: {
                              padding: "12px",
                              height: "42px",
                              backgroundColor: !isOriginCountrySelected
                                ? "#f9fafb"
                                : "white",
                            },
                          }}
                          {...form.getInputProps("originCity")}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Origin Postal Code"
                          placeholder={
                            isOriginCountrySelected
                              ? "Enter postal code"
                              : "Select country first"
                          }
                          withAsterisk
                          size="sm"
                          disabled={!isOriginCountrySelected}
                          styles={{
                            input: {
                              padding: "12px",
                              height: "42px",
                              backgroundColor: !isOriginCountrySelected
                                ? "#f9fafb"
                                : "white",
                            },
                          }}
                          {...form.getInputProps("originPostalCode")}
                        />
                      </Grid.Col>
                    </Grid>
                  </div>
                </Grid.Col>

                {/* Destination Section */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <div className="mb-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Destination Details
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <Select
                      label="Destination Country"
                      placeholder="Select destination country"
                      data={countries}
                      searchable
                      withAsterisk
                      size="sm"
                      styles={{
                        input: {
                          padding: "12px",
                          height: "42px",
                        },
                      }}
                      {...form.getInputProps("destinationCountry")}
                      onChange={(value) =>
                        handleCountryChange("destinationCountry", value || "")
                      }
                    />

                    {/* City and Postal Code in same row */}
                    <Grid gutter="sm">
                      <Grid.Col span={6}>
                        <Select
                          label="Destination City"
                          placeholder={
                            isDestinationCountrySelected
                              ? "Enter destination city"
                              : "Select country first"
                          }
                          withAsterisk
                          size="sm"
                          data={destinationCities || []}
                          disabled={!isDestinationCountrySelected}
                          styles={{
                            input: {
                              padding: "12px",
                              height: "42px",
                              backgroundColor: !isDestinationCountrySelected
                                ? "#f9fafb"
                                : "white",
                            },
                          }}
                          {...form.getInputProps("destinationCity")}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Destination Postal Code"
                          placeholder={
                            isDestinationCountrySelected
                              ? "Enter postal code"
                              : "Select country first"
                          }
                          withAsterisk
                          size="sm"
                          disabled={!isDestinationCountrySelected}
                          styles={{
                            input: {
                              padding: "12px",
                              height: "42px",
                              backgroundColor: !isDestinationCountrySelected
                                ? "#f9fafb"
                                : "white",
                            },
                          }}
                          {...form.getInputProps("destinationPostalCode")}
                        />
                      </Grid.Col>
                    </Grid>
                  </div>
                </Grid.Col>
              </Grid>
            </div>

            {/* Package Details */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 text-base">
                  Package Details
                </h3>
                <Button
                  onClick={addItem}
                  variant="light"
                  size="sm"
                  leftSection={<Plus size={14} />}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700"
                  h={40}
                >
                  Add Item
                </Button>
              </div>

              <Stack gap="sm">
                {form.values.enqDetails.map((item, index) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-800">
                        Item {index + 1}
                      </span>
                      {form.values.enqDetails.length > 1 && (
                        <DeleteActionButton
                          onClick={() => removeItem(item.id)}
                        />
                      )}
                    </div>

                    <Grid gutter="md">
                      <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
                        <NumberInput
                          label="Weight (kg)"
                          placeholder="0.0"
                          min={0}
                          step={0.1}
                          withAsterisk
                          size="sm"
                          styles={{
                            input: {
                              padding: "12px",
                              height: "42px",
                            },
                          }}
                          {...form.getInputProps(
                            `enqDetails.${index}.actWeight`
                          )}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
                        <NumberInput
                          label="Length (cm)"
                          placeholder="0.0"
                          min={0}
                          step={0.1}
                          withAsterisk
                          size="sm"
                          styles={{
                            input: {
                              padding: "12px",
                              height: "42px",
                            },
                          }}
                          {...form.getInputProps(
                            `enqDetails.${index}.lengthInCm`
                          )}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
                        <NumberInput
                          label="Width (cm)"
                          placeholder="0.0"
                          min={0}
                          step={0.1}
                          withAsterisk
                          size="sm"
                          styles={{
                            input: {
                              padding: "12px",
                              height: "42px",
                            },
                          }}
                          {...form.getInputProps(
                            `enqDetails.${index}.breadthInCm`
                          )}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
                        <NumberInput
                          label="Height (cm)"
                          placeholder="0.0"
                          min={0}
                          step={0.1}
                          withAsterisk
                          size="sm"
                          styles={{
                            input: {
                              padding: "12px",
                              height: "42px",
                            },
                          }}
                          {...form.getInputProps(
                            `enqDetails.${index}.heightInCm`
                          )}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6, md: 2.4 }}>
                        <NumberInput
                          label="Quantity"
                          placeholder="1"
                          min={1}
                          withAsterisk
                          size="sm"
                          styles={{
                            input: {
                              padding: "12px",
                              height: "42px",
                            },
                          }}
                          {...form.getInputProps(
                            `enqDetails.${index}.quantity`
                          )}
                        />
                      </Grid.Col>
                    </Grid>
                  </div>
                ))}
              </Stack>
            </div>

            {/* Summary & Actions */}
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <div className="bg-white border border-gray-200 rounded-lg p-4 h-full">
                  <div className="text-center">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Total Weight
                    </h3>
                    <p className="text-2xl font-bold text-blue-700">
                      {totalChargeableWeight.toFixed(1)} kg
                    </p>
                  </div>
                </div>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 8 }}>
                <div className="bg-white border border-gray-200 rounded-lg p-4 h-full flex flex-col md:flex-row md:items-center">
                  {/* Special Requirements Section */}
                  <div className="flex-1">
                    <Stack gap="xs">
                      {/* Cargo Type Radio Group */}
                      <Radio.Group
                        label="Cargo Type"
                        {...form.getInputProps("cargoType")}
                      >
                        <div className="space-y-2">
                          <Radio
                            size="sm"
                            value="general"
                            label="General Cargo (Non-Dangerous, includes Hazardous Substances)"
                          />
                          <Radio size="sm" value="dg" label="DG Goods" />
                        </div>
                      </Radio.Group>

                      {/* Non-Stackable Checkbox */}
                      <Checkbox
                        label="Non-Stackable Items"
                        size="sm"
                        {...form.getInputProps("isNonStackable", {
                          type: "checkbox",
                        })}
                      />
                    </Stack>
                  </div>

                  {/* Submit Button Section */}
                  <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                    <Button
                      type="submit"
                      loading={isPending}
                      className="bg-blue-600 hover:bg-blue-700 transition-colors"
                      size="md"
                      h="3rem"
                      px="xl"
                    >
                      Get a Quote
                    </Button>
                  </div>
                </div>
              </Grid.Col>
            </Grid>
          </Stack>
        </form>
      </div>

      {/* Success Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Success"
        centered
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        size="sm"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <div className="flex flex-col items-center py-2">
          <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-center text-gray-700 font-medium mb-1 text-sm">
            Quote requested successfully
          </p>
          <p className="text-center text-gray-500 text-xs mb-4">
            Your quote is being processed
          </p>

          <div className="flex justify-end w-full">
            <Button
              h="2.5rem"
              onClick={() => router.push("/my-quotes")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 text-sm"
              size="sm"
            >
              View My Quotes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuoteForm;
