"use client";

import React, { FC, useEffect } from "react";
import {
  Button,
  NumberInput,
  Select,
  Checkbox,
  Modal,
  Radio,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import DeleteActionButton from "@/components/shared/action-buttons/delete.action";
import { useEnquiryMutation } from "@/api/mutation/enquiry.mutation";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import {
  enqDetailsPropsType,
  EnquiryPropsType,
} from "@/types/get-a-quote/quote-form.type";
import { useDropDown } from "@/api/query/drop-down.query";
import { Country, setmDocNoType } from "@/types/quote.form/quote.form.type";
import { Loader, Plus } from "lucide-react";
import { useCitiesQuery } from "@/api/query/city.query";

interface QuoteFormProps {
  className?: string;
}

const EnquiryForm: FC<QuoteFormProps> = ({ className = "" }) => {
  const { mutate, isPending } = useEnquiryMutation();
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<EnquiryPropsType>({
    initialValues: {
      docDate: new Date(),
      stmDocNo: "",
      cusDocNo: "",
      originCountry: "231",
      destinationCountry: "",
      setmDocNo: "1001",
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

  // Add city dropdown hooks

  const { data: originCities, isLoading: isOriginCitiesLoading } = useCitiesQuery(form.values.originCountry);
  const { data: destinationCities, isLoading: isDestinationCitiesLoading } = useCitiesQuery(form.values.destinationCountry);

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
        form.reset();
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
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <div>
        <form onSubmit={form.onSubmit(handleSubmit)} className="p-3 space-y-4">
          {/* Shipment Details - Improved Layout */}
          <div className="space-y-3">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Shipment Details
              </h3>
            </div>

            {/* Service Type */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Service Type <span className="text-red-500">*</span>
              </p>
              <Select
                placeholder={
                  isServiceLoading ? "Loading..." : "Select Service Type"
                }
                data={serviceOptions}
                searchable
                size="xs"
                {...form.getInputProps("setmDocNo")}
                styles={{
                  input: {
                    padding: "8px 12px",
                    fontSize: "13px",
                    height: "34px",
                  },
                }}
              />
            </div>

            {/* Origin and Destination Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Origin Section */}
              <div className="space-y-3 border border-gray-200 rounded-md p-3 bg-gray-50/30">
                <h4 className="text-xs font-semibold text-gray-900 border-b border-gray-200 pb-1">
                  Origin Details
                </h4>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      Country <span className="text-red-500">*</span>
                    </p>
                    <Select
                      placeholder={
                        isCountriesLoading
                          ? "Loading..."
                          : "Select origin country"
                      }
                      data={countries}
                      searchable
                      size="xs"
                      {...form.getInputProps("originCountry")}
                      onChange={(value) =>
                        handleCountryChange("originCountry", value || "")
                      }
                      styles={{
                        input: {
                          padding: "8px 12px",
                          fontSize: "13px",
                          height: "34px",
                        },
                      }}
                    />
                  </div>

                  {/* City and Postal Code in same row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </p>
                      <Select
                        label=""
                        placeholder={
                          !isOriginCountrySelected
                            ? "Select country first"
                            : isOriginCitiesLoading
                            ? "Loading..."
                            : "Select city"
                        }
                        data={originCities || []}
                        rightSection={
                          isOriginCitiesLoading ? (
                            <Loader size="xs" />
                          ) : null
                        }
                        withAsterisk
                        size="xs"
                        disabled={!isOriginCountrySelected}
                        {...form.getInputProps("originCity")}
                        searchable
                        styles={{
                          input: {
                            padding: "8px 12px",
                            fontSize: "13px",
                            height: "34px",
                            backgroundColor: !isOriginCountrySelected
                              ? "#f9fafb"
                              : "white",
                          },
                        }}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        Postal Code <span className="text-red-500">*</span>
                      </p>
                      <TextInput
                        placeholder={
                          isOriginCountrySelected
                            ? "postal code"
                            : "Select country first"
                        }
                        size="xs"
                        disabled={!isOriginCountrySelected}
                        {...form.getInputProps("originPostalCode")}
                        styles={{
                          input: {
                            padding: "8px 12px",
                            fontSize: "13px",
                            height: "34px",
                            backgroundColor: !isOriginCountrySelected
                              ? "#f9fafb"
                              : "white",
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Destination Section */}
              <div className="space-y-3 border border-gray-200 rounded-md p-3 bg-gray-50/30">
                <h4 className="text-xs font-semibold text-gray-900 border-b border-gray-200 pb-1">
                  Destination Details
                </h4>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      Country <span className="text-red-500">*</span>
                    </p>
                    <Select
                      placeholder="Select destination country"
                      data={countries}
                      searchable
                      size="xs"
                      {...form.getInputProps("destinationCountry")}
                      onChange={(value) =>
                        handleCountryChange("destinationCountry", value || "")
                      }
                      styles={{
                        input: {
                          padding: "8px 12px",
                          fontSize: "13px",
                          height: "34px",
                        },
                      }}
                    />
                  </div>

                  {/* City and Postal Code in same row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </p>
                      <Select
                        label=""
                        placeholder={
                          !isDestinationCountrySelected
                            ? "Select country first"
                            : isDestinationCitiesLoading
                            ? "Loading..."
                            : "Select city"
                        }
                        data={destinationCities || []}
                        rightSection={
                          isDestinationCitiesLoading ? (
                            <Loader size="xs" />
                          ) : null
                        }
                        withAsterisk
                        size="xs"
                        disabled={!isDestinationCountrySelected}
                        {...form.getInputProps("destinationCity")}
                        searchable
                        styles={{
                          input: {
                            padding: "8px 12px",
                            fontSize: "13px",
                            height: "34px",
                            backgroundColor: !isDestinationCountrySelected
                              ? "#f9fafb"
                              : "white",
                          },
                        }}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        Postal Code <span className="text-red-500">*</span>
                      </p>
                      <TextInput
                        placeholder={
                          isDestinationCountrySelected
                            ? "postal code"
                            : "Select country first"
                        }
                        size="xs"
                        disabled={!isDestinationCountrySelected}
                        {...form.getInputProps("destinationPostalCode")}
                        styles={{
                          input: {
                            padding: "8px 12px",
                            fontSize: "13px",
                            height: "34px",
                            backgroundColor: !isDestinationCountrySelected
                              ? "#f9fafb"
                              : "white",
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Package Details - Compact */}
          <div className="space-y-2">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Package Details
              </h3>
            </div>

            <div className="space-y-2">
              {form.values.enqDetails.map((item, index) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-md p-2 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900 flex items-center text-xs">
                      Package {index + 1}
                    </h4>
                    {form.values.enqDetails.length > 1 && (
                      <DeleteActionButton onClick={() => removeItem(item.id)} />
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    <div>
                      <p className="text-xs font-normal mb-1">Weight (kg)</p>
                      <NumberInput
                        placeholder="0.0"
                        min={0}
                        withAsterisk
                        size="xs"
                        {...form.getInputProps(`enqDetails.${index}.actWeight`)}
                        styles={{
                          input: {
                            padding: "8px 12px",
                            fontSize: "13px",
                            height: "34px",
                          },
                        }}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-normal mb-1">Length (cm)</p>
                      <NumberInput
                        placeholder="0.0"
                        min={0}
                        withAsterisk
                        size="xs"
                        {...form.getInputProps(
                          `enqDetails.${index}.lengthInCm`
                        )}
                        styles={{
                          input: {
                            padding: "8px 12px",
                            fontSize: "13px",
                            height: "34px",
                          },
                        }}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-normal mb-1">Breadth (cm)</p>
                      <NumberInput
                        placeholder="0.0"
                        min={0}
                        withAsterisk
                        size="xs"
                        {...form.getInputProps(
                          `enqDetails.${index}.breadthInCm`
                        )}
                        styles={{
                          input: {
                            padding: "8px 12px",
                            fontSize: "13px",
                            height: "34px",
                          },
                        }}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-normal mb-1">Height (cm)</p>
                      <NumberInput
                        placeholder="0.0"
                        min={0}
                        withAsterisk
                        size="xs"
                        {...form.getInputProps(
                          `enqDetails.${index}.heightInCm`
                        )}
                        styles={{
                          input: {
                            padding: "8px 12px",
                            fontSize: "13px",
                            height: "34px",
                          },
                        }}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-normal mb-1">Quantity</p>
                      <NumberInput
                        placeholder="1"
                        min={1}
                        withAsterisk
                        size="xs"
                        {...form.getInputProps(`enqDetails.${index}.quantity`)}
                        styles={{
                          input: {
                            padding: "8px 12px",
                            fontSize: "13px",
                            height: "34px",
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={addItem}
                variant="light"
                size="xs"
                leftSection={<Plus size={10} />}
                styles={{
                  root: {
                    backgroundColor: "#eff6ff",
                    color: "#1d4ed8",
                    border: "1px solid #bfdbfe",
                    fontSize: "12px",
                    height: "28px",
                    padding: "0 10px",
                    borderRadius: "6px",
                    "&:hover": {
                      backgroundColor: "#dbeafe",
                    },
                  },
                }}
              >
                Add Package
              </Button>
            </div>
          </div>

          {/* Total Weight and Actions - Compact */}
          <div className="space-y-3">
            <div className="flex gap-3">
              {/* Total Weight - Square on left side */}
              <div className="bg-white border border-gray-200 rounded-md p-2 flex-1 max-w-[120px]">
                <h3 className="text-xs font-semibold text-gray-900 mb-1">
                  Total Weight
                </h3>
                <p className="text-lg font-bold text-blue-700">
                  {form.values.enqDetails
                    .reduce(
                      (total, item) =>
                        total + (item.actWeight || 0) * (item.quantity || 1),
                      0
                    )
                    .toFixed(1)}{" "}
                  kg
                </p>
              </div>

              {/* Special Requirements - Right side with button */}
              <div className="flex-1 bg-white border border-gray-200 rounded-md p-2">
                <Radio.Group size="xs" {...form.getInputProps("cargoType")}>
                  <Radio
                    value="general"
                    label="General Cargo (Non-Dangerous, includes Hazardous Substances)"
                    classNames={{ label: "text-xs" }}
                    size="xs"
                    className="mb-2"
                  />
                  <Radio
                    value="dg"
                    label="DG Goods"
                    classNames={{ label: "text-xs" }}
                    size="xs"
                    className="mb-2"
                  />
                </Radio.Group>

                {/* Checkbox and Button in same row */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Checkbox
                      label="Non-Stackable Items"
                      size="xs"
                      classNames={{ label: "text-xs" }}
                      {...form.getInputProps("isNonStackable", {
                        type: "checkbox",
                      })}
                    />
                  </div>

                  {/* Submit Button on same row */}
                  <Button
                    type="submit"
                    loading={isPending}
                    size="xs"
                    styles={{
                      root: {
                        backgroundColor: "#2563eb",
                        height: "30px",
                        fontSize: "12px",
                        padding: "0 12px",
                        borderRadius: "6px",
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#1d4ed8",
                        },
                      },
                    }}
                  >
                    Get a Quote
                  </Button>
                </div>
              </div>
            </div>
          </div>
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
        size="xs"
      >
        <div className="flex flex-col items-center py-3">
          <div className="bg-green-100 text-green-600 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
          <p className="text-center text-gray-500 text-xs mb-3">
            Your quote is being processed
          </p>
          <Button
            onClick={close}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full text-xs h-8"
            size="xs"
            h={40}
            styles={{
              root: {
                padding: "20",
              },
            }}
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default EnquiryForm;