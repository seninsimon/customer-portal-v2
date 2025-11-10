"use client";

import React from "react";
import {
  TextInput,
  Textarea,
  Button,
  Select,
  Loader,
  Fieldset,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQuoteApproveMutation } from "@/api/mutation/approve.mutation";
import { useSearchParams, useRouter } from "next/navigation";
import { useCitiesQuery } from "@/api/query/city.query";
import { useEnquiryDetails } from "@/api/query/enquiery-details";
import dayjs from "dayjs";

const QuoteApprovePage: React.FC = () => {
  const searchParams = useSearchParams();
  const docType = searchParams.get("docType") || "";
  const docNo = searchParams.get("docNo") || "";
  const cntryDocNo = searchParams.get("cntryDocNo") || "";
  const originCntryDocNo = searchParams.get("originCntryDocNo") || "";

  const mutation = useQuoteApproveMutation();

  const { data: cities, isLoading: citiesLoading } = useCitiesQuery(cntryDocNo);
  const { data: ShipperCities, isLoading: shipperCitiesLoading } =
    useCitiesQuery(originCntryDocNo);

  const form = useForm({
    initialValues: {
      remarks: "",
      contactEmail: "",
      contactNo: "",
      contactPerson: "",
      consignee: "",
      consigneeAddress: "",
      consigneeAddress1: "",
      consigneeCityDocNo: "",
      consigneeContactPerson: "",
      consigneeEmail: "",
      consigneeMobile: "",
      consigneePhone: "",
      consigneePostalCode: "",
      shipper: "",
      shipperAddress: "",
      shipperAddress1: "",
      shipperCityDocNo: "",
      shipperContactPerson: "",
      shipperEmail: "",
      shipperMobile: "",
      shipperPhone: "",
      shipperPostalCode: "",
    },
    validate: {
      // contactEmail: (value) =>
      //   !value
      //     ? "Contact email is required"
      //     : !/^\S+@\S+\.\S+$/.test(value)
      //     ? "Invalid email"
      //     : null,
      // contactNo: (value) =>
      //   !value
      //     ? "Contact number is required"
      //     : !/^\d{7,15}$/.test(value)
      //     ? "Contact number must be 7–15 digits"
      //     : null,
      // contactPerson: (value) => (!value ? "Contact person is required" : null),

      consignee: (value) => (!value ? "Consignee name is required" : null),
      consigneeAddress: (value) =>
        !value ? "Consignee address is required" : null,
      consigneeCityDocNo: (value, values) =>
        !value && !values.consigneePostalCode
          ? "Either city or postal code is required"
          : null,
      consigneePostalCode: (value, values) => {
        if (!value && !values.consigneeCityDocNo)
          return "Either city or postal code is required";
        if (value && !/^[A-Za-z0-9\s-]{3,10}$/.test(value))
          return "Postal code must be 4–10 digits";
        return null;
      },
      consigneeContactPerson: (value) =>
        !value ? "Consignee contact person is required" : null,
      consigneeEmail: (value) =>
        !value
          ? "Consignee email is required"
          : !/^\S+@\S+\.\S+$/.test(value)
          ? "Invalid email"
          : null,
      consigneeMobile: (value) =>
        !value
          ? "Consignee mobile is required"
          : !/^\d{7,15}$/.test(value)
          ? "Mobile must be 7–15 digits"
          : null,
      consigneePhone: (value) =>
        !value
          ? "Consignee phone is required"
          : !/^\d{7,15}$/.test(value)
          ? "Phone must be 7–15 digits"
          : null,

      shipper: (value) => (!value ? "Shipper name is required" : null),
      shipperAddress: (value) =>
        !value ? "Shipper address is required" : null,
      shipperCityDocNo: (value, values) =>
        !value && !values.shipperPostalCode
          ? "Either city or postal code is required"
          : null,
      shipperPostalCode: (value, values) => {
        if (!value && !values.shipperCityDocNo)
          return "Either city or postal code is required";
        if (value && !/^[A-Za-z0-9\s-]{3,10}$/.test(value))
          return "Postal code must be 4–10 digits";
        return null;
      },
      shipperContactPerson: (value) =>
        !value ? "Shipper contact person is required" : null,
      shipperEmail: (value) =>
        !value
          ? "Shipper email is required"
          : !/^\S+@\S+\.\S+$/.test(value)
          ? "Invalid email"
          : null,
      shipperMobile: (value) =>
        !value
          ? "Shipper mobile is required"
          : !/^\d{7,15}$/.test(value)
          ? "Mobile must be 7–15 digits"
          : null,
      shipperPhone: (value) =>
        !value
          ? "Shipper phone is required"
          : !/^\d{7,15}$/.test(value)
          ? "Phone must be 7–15 digits"
          : null,
    },
  });

  const router = useRouter();

  const handleSubmit = form.onSubmit(async (values) => {
    await mutation.mutateAsync({
      ...values,
      docType,
      docNo,
    });
    router.push("/my-quotes");
  });

  const { data: enquiryDetails, isLoading: enquiryLoading } = useEnquiryDetails(
    docType,
    docNo
  );

  if (enquiryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader size="lg" variant="dots" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading quotation details...</p>
        </div>
      </div>
    );
  }

  if (!enquiryDetails?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            No Quotation Details Found
          </h1>
          <p className="text-gray-600 mb-4">
            The quotation you are looking for does not exist or may have
            expired.
          </p>
          <Button onClick={() => router.push("/my-quotes")}>
            Back to My Quotes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {enquiryLoading ? (
        <div className="p-2 text-gray-500">Loading quotation details...</div>
      ) : enquiryDetails?.data ? (
        <div
          className="bg-white rounded-lg p-4 mb-6  border border-black/10 
  max-w-[400px] sm:max-w-[600px] md:max-w-[1250px]  
  mx-auto"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Quotation Details (Ref: {enquiryDetails.data[0].docNo})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-700">
            <div>
              <b>Date:</b>{" "}
              {dayjs(enquiryDetails.data[0].date).format("DD-MM-YYYY")}
            </div>
            <div>
              <b>Origin:</b> {enquiryDetails.data[0].origin}
            </div>
            <div>
              <b>Destination:</b> {enquiryDetails.data[0].destination}
            </div>
            <div>
              <b>Type:</b> {enquiryDetails.data[0].type}
            </div>
            <div>
              <b>Service Mode:</b> {enquiryDetails.data[0].service || "N/A"}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 text-gray-500">No enquiry details found</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 p-4"
      >
        {/* <TextInput
          label="Contact Email"
          placeholder="Enter contact email"
          withAsterisk
          className="col-span-1 sm:col-span-1 lg:col-span-4"
          {...form.getInputProps("contactEmail")}
          styles={{
            input: {
              padding: "20px",
            },
          }}
        />
        <TextInput
          label="Contact Number"
          placeholder="Enter contact number"
          withAsterisk
          className="col-span-1 sm:col-span-1 lg:col-span-4"
          {...form.getInputProps("contactNo")}
          styles={{
            input: {
              padding: "20px",
            },
          }}
        />
        <TextInput
          label="Contact Person"
          placeholder="Enter contact person"
          withAsterisk
          className="col-span-1 sm:col-span-2 lg:col-span-4"
          {...form.getInputProps("contactPerson")}
          styles={{
            input: {
              padding: "20px",
            },
          }}
        /> */}

        {/* Consignee Section */}
        <Fieldset
          legend={<p className="text-xl font-semibold px-2">Consignee</p>}
          className="col-span-1 sm:col-span-2 lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5"
        >
          <TextInput
            label="Name"
            placeholder="Enter consignee name"
            withAsterisk
            className="col-span-1 sm:col-span-2 lg:col-span-1"
            {...form.getInputProps("consignee")}
            styles={{
              input: {
                padding: "20px",
              },
            }}
          />
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Address"
              placeholder="Enter consignee address"
              withAsterisk
              {...form.getInputProps("consigneeAddress")}
              styles={{
                input: {
                  padding: "20px",
                },
              }}
            />
            <TextInput
              label="Address 1"
              placeholder="Enter consignee address 1"
              {...form.getInputProps("consigneeAddress1")}
              styles={{
                input: {
                  padding: "20px",
                },
              }}
            />
          </div>
          
          <TextInput
            label="Contact Person"
            placeholder="Enter consignee contact person"
            withAsterisk
            className="col-span-1"
            {...form.getInputProps("consigneeContactPerson")}
            styles={{
              input: {
                padding: "20px",
              },
            }}
          />
          <TextInput
            label="Email"
            placeholder="Enter consignee email"
            withAsterisk
            className="col-span-1"
            {...form.getInputProps("consigneeEmail")}
            styles={{
              input: {
                padding: "20px",
              },
            }}
          />
          <TextInput
            label="Mobile"
            placeholder="Enter consignee mobile"
            withAsterisk
            className="col-span-1"
            {...form.getInputProps("consigneeMobile")}
            styles={{
              input: {
                padding: "20px",
              },
            }}
          />
          <TextInput
            label="Phone"
            placeholder="Enter consignee phone"
            withAsterisk
            className="col-span-1"
            {...form.getInputProps("consigneePhone")}
            styles={{
              input: {
                padding: "20px",
              },
            }}
          />
          <TextInput
            label="Postal Code"
            placeholder="Enter consignee postal code"
            withAsterisk
            className="col-span-1"
            {...form.getInputProps("consigneePostalCode")}
            styles={{
              input: {
                padding: "20px",
              },
            }}
          />
          <Select
            label="City"
            placeholder="Select city"
            data={cities || []}
            rightSection={citiesLoading ? <Loader size="xs" /> : null}
            withAsterisk
            className="col-span-1"
            {...form.getInputProps("consigneeCityDocNo")}
            searchable
            styles={{
              input: {
                padding: "20px",
              },
            }}
          />
        </Fieldset>

        {/* Shipper Section */}
        <Fieldset
          legend={<p className="text-xl font-semibold px-2">Shipper</p>}
          className="col-span-1 sm:col-span-2 lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5"
        >
          <TextInput
            label="Name"
            placeholder="Enter shipper name"
            withAsterisk
            className="col-span-1 sm:col-span-2 lg:col-span-1"
            {...form.getInputProps("shipper")}
            styles={{
              input: {
                padding: "20px",
              },
            }}
          />
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Address"
              placeholder="Enter shipper address"
              withAsterisk
              {...form.getInputProps("shipperAddress")}
              styles={{
                input: {
                  padding: "20px",
                },
              }}
            />
            <TextInput
              label="Address 1"
              placeholder="Enter shipper address 1"
              {...form.getInputProps("shipperAddress1")}
              styles={{
                input: {
                  padding: "20px",
                },
              }}
            />
          </div>
        
          <TextInput
            label="Contact Person"
            placeholder="Enter shipper contact person"
            withAsterisk
            className="col-span-1"
            {...form.getInputProps("shipperContactPerson")}
            styles={{
              input: {
                padding: "20px",
              },
            }}
          />
          <TextInput
            label="Email"
            placeholder="Enter shipper email"
            withAsterisk
            className="col-span-1"
            {...form.getInputProps("shipperEmail")}
            styles={{
              input: {
                padding: "20px",
              },
            }}
          />
          <TextInput
            label="Mobile"
            placeholder="Enter shipper mobile"
            withAsterisk
            className="col-span-1"
            {...form.getInputProps("shipperMobile")}
            styles={{
              input: {
                padding: "20px",
              },
            }}
          />
          <TextInput
            label="Phone"
            placeholder="Enter shipper phone"
            withAsterisk
            className="col-span-1"
            {...form.getInputProps("shipperPhone")}
            styles={{
              input: {
                padding: "20px",
              },
            }}
          />
          <TextInput
            label="Postal Code"
            placeholder="Enter shipper postal code"
            withAsterisk
            className="col-span-1"
            {...form.getInputProps("shipperPostalCode")}
            styles={{
              input: {
                padding: "20px",
              },
            }}
          />

            <Select
            label="City"
            placeholder="Select city"
            data={ShipperCities || []}
            rightSection={shipperCitiesLoading ? <Loader size="xs" /> : null}
            withAsterisk
            className="col-span-1"
            {...form.getInputProps("shipperCityDocNo")}
            styles={{
              input: {
                padding: "20px",
              },
            }}
            searchable
          />
        </Fieldset>

        <Textarea
          label="Remarks"
          placeholder="Enter additional notes or instructions"
          className="col-span-1 sm:col-span-2 lg:col-span-12 mt-5"
          {...form.getInputProps("remarks")}
          styles={{
            input: {
              padding: "20px",
            },
          }}
        />

        {/* Submit Button */}
        <div className="flex col-span-1 sm:col-span-2 lg:col-span-12 justify-end mt-5">
          <Button
            type="submit"
            loading={mutation.isPending}
            className="w-full sm:w-auto"
            h="2.75rem"
          >
            Approve this quote
          </Button>
        </div>
      </form>
    </>
  );
};

export default QuoteApprovePage;
