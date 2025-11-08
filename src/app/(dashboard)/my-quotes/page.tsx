"use client";

import React, { FC, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Download,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  Button,
  Badge,
  Card,
  Text,
  Modal,
  TextInput,
  Select,
} from "@mantine/core";
import { useMyQuotesQuery } from "@/api/query/customer-enquery";
import { useDownloadQuote } from "@/api/mutation/download-file.mutation";
import { QuotesTableProps } from "@/types/my-quotes/quotes.type";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { Datum } from "@/api/query/types/my-quotes/my-quotes.response";
import { useEnquiryDetails } from "@/api/query/enquiery-details";

import EnquiryForm from "@/components/quote-form-beside/Enquiry-from";


const QuotesTable: FC<QuotesTableProps> = () => {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [docType, setDocType] = useState<string | null>(null);
  const [docNo, setDocNo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // ✅ Fetch only SE data (has all quotes + bookings + enquiry info)
  const {
    data: myQuotes,
    isLoading: myQuotesLoading,
    isError: myQuotesError,
    refetch,
  } = useMyQuotesQuery("SE");




  const { mutateAsync: downloadQuote, isPending } = useDownloadQuote();

  const handleApprovalRoute = (quote: {
    docType: string;
    quoteId: string;
    destinationCntryDocNo?: string;
    originCntryDocNo?: string;
  }) => {
    router.push(
      `/approve?docType=SQ&docNo=${quote.quoteId}&cntryDocNo=${quote.destinationCntryDocNo}&originCntryDocNo=${quote.originCntryDocNo}`
    );
  };

  const { data: enquiryDetails, isLoading: enquiryLoading } = useEnquiryDetails(
    docType ?? "",
    docNo ?? ""
  );

  // ✅ Helper function for status colors
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "quoted":
        return "blue";
      case "approved":
        return "green";
      case "expired":
        return "red";
      case "waiting for quote":
        return "yellow";
      case "booking cancelled":
        return "red";
      case "booked":
        return "cyan";
      default:
        return "gray";
    }
  };

  // ✅ Prepare merged data (SE already includes all)
  const rowData = useMemo(() => {
    const list: Datum[] = myQuotes?.data ?? [];
    return list.map((item) => {
      const parsedDate = dayjs(item.date, "YYYY-MM-DD HH:mm:ss.SSSZ").toDate();
      return {
        ...item,
        date: parsedDate,
        time: item.time,
        status: item.status ?? "N/A",
      };
    });
  }, [myQuotes]);

  // ✅ Filter data based on search query and status filter
  const filteredData = useMemo(() => {
    return rowData.filter((item) => {
      // Search filter - search across multiple fields
      const matchesSearch =
        searchQuery === "" ||
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        item.origin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.docNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.quoteId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.bookingId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.awb?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.service?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === null ||
        statusFilter === "" ||
        item.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [rowData, searchQuery, statusFilter]);

  // ✅ Status options for filter
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "quoted", label: "Quoted" },
    { value: "approved", label: "Approved" },
    { value: "expired", label: "Expired" },
    { value: "waiting for quote", label: "Waiting for Quote" },
    { value: "booking cancelled", label: "Booking Cancelled" },
    { value: "booked", label: "Booked" },
  ];

  // ✅ Card component (desktop view)
  const QuoteCard = ({ data }: { data: Datum }) => {
    const isActionable = data.docType === "SQ" || data.docType === "SE";
    const isDisabled =
      data.status?.toLowerCase() === "expired" ||
      data.status?.toLowerCase() === "waiting for quote";

    return (
      <Card
        key={data.docNo}
        shadow="md"
        padding="lg"
        radius="lg"
        withBorder
        className="mb-5 hover:shadow-lg transition-all relative"
      >
        {/* Status Badge - Top Right */}
        <div className="absolute top-4 right-4">
          <Badge
            color={getStatusColor(data.status)}
            variant="filled"
            radius="sm"
            size="sm"
          >
            {data.status}
          </Badge>
        </div>

        {/* Top Row: Date + Route */}
        <div className="border-b border-gray-200 pb-3 mb-2">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <Text size="xs" c="dimmed">
              Enquiry Date: {dayjs(data.date).format("DD/MM/YYYY")}
            </Text>
          </div>

          <div className="flex items-center">
            <Text size="md" className="text-gray-700 font-medium">
              {data.origin}
            </Text>
            <ArrowRight size={18} className="mx-2 text-gray-400" />
            <Text size="md" className="text-gray-700 font-medium">
              {data.destination}
            </Text>
          </div>
        </div>

        {/* Data Grid Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-3 gap-x-6 pt-2 pb-3 border-b border-gray-200">
          {/* Weight */}
          <div className="flex flex-col">
            <Text size="xs" c="dimmed">
              Weight
            </Text>
            <button
              className="text-blue-600 underline cursor-pointer text-left p-0"
              onClick={() => {
                setDocType(data.docType);
                setDocNo(data.docNo);
                setOpened(true);
              }}
            >
              <Text size="sm">{data.weight} kg</Text>
            </button>
            <Text size="xs" c="dimmed">
              {data.type}
            </Text>
          </div>

          {/* Service & Mode */}
          <div className="flex flex-col">
            <Text size="xs" c="dimmed">
              Service & Mode
            </Text>
            <Text size="sm">{data.service}</Text>
            <Text size="xs">{data.mode}</Text>
          </div>

          {/* Enquiry No */}
          {data.docNo && (
            <div className="flex flex-col">
              <Text size="xs" c="dimmed">
                Enquiry No
              </Text>
              <Text size="sm">{data.docNo}</Text>
            </div>
          )}

          {/* Quote No */}
          {data.quoteId && (
            <div className="flex flex-col">
              <Text size="xs" c="dimmed">
                Quote No
              </Text>
              <Text size="sm">{data.quoteId}</Text>
            </div>
          )}

          {/* Booking No */}
          {data.bookingId && (
            <div className="flex flex-col">
              <Text size="xs" c="dimmed">
                Booking No
              </Text>
              <Text size="sm">{data.bookingId}</Text>
            </div>
          )}
        </div>

        {/* AWB Section */}
        {data.awb && (
          <div className="pt-3 pb-2 border-b border-gray-200">
            <Text size="xs" c="dimmed">
              AWB No
            </Text>
            <Text size="sm">{data.awb}</Text>
          </div>
        )}

        {/* Action Buttons */}
        {isActionable && (
          <div className="flex justify-end mt-3 gap-2">
            {data.approvedBy ? (
              <Button
                variant="light"
                color="violet"
                size="xs"
                radius="md"
                disabled={isPending || isDisabled}
                onClick={async () =>
                  await downloadQuote({ docType: "SQ", docNo: data.quoteId })
                }
                leftSection={<Download size={12} />}
                className="bg-gray-700 hover:bg-gray-600 text-white"
                styles={{
                  root: {
                    height: "30px",
                    padding: "0 8px",
                    fontSize: "12px",
                    width: "150px",
                  },
                  section: { marginRight: 4 }, // reduce gap with icon
                }}
              >
                Download
              </Button>
            ) : (
              <>
                <Button
                  color="green"
                  size="xs"
                  radius="md"
                  disabled={isPending || isDisabled}
                  onClick={() => handleApprovalRoute(data)}
                  styles={{
                    root: {
                      height: "30px",
                      padding: "0 8px",
                      fontSize: "12px",
                      width: "150px",
                    },
                    section: { marginRight: 4 }, // reduce gap with icon
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="light"
                  color="violet"
                  size="xs"
                  radius="md"
                  disabled={isPending || isDisabled}
                  onClick={() =>
                    downloadQuote({ docType: "SQ", docNo: data.quoteId })
                  }
                  leftSection={<Download size={12} />}
                  className="bg-gray-700 hover:bg-gray-600 text-white"
                  styles={{
                    root: {
                      height: "30px",
                      padding: "0 8px",
                      fontSize: "12px",
                      width: "150px",
                    },
                    section: { marginRight: 4 },
                  }}
                >
                  Download
                </Button>
              </>
            )}
            {data.status?.toLowerCase() === "booked" && data.awb && (
              <Button
                variant="light"
                color="blue"
                size="xs"
                radius="md"
                onClick={() =>
                  router.push(
                    `/tracking-updates?awb=${
                      data.awb
                    }&date=${encodeURIComponent(
                      dayjs(data.date).format("YYYY-MM-DD")
                    )}`
                  )
                }
                leftSection={<ArrowRight size={12} />}
                styles={{
                  root: {
                    height: "30px",
                    padding: "0 8px",
                    fontSize: "12px",
                    width: "150px",
                  },
                  section: { marginRight: 4 },
                }}
              >
                Track Now
              </Button>
            )}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="bg-gray-50 pt-24 sm:pt-28 md:pt-32 lg:pt-35 min-h-screen">
      <div className=" max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-[40%_60%] gap-4">
          {/* Left Column - Quote Form (Visible on xl screens and above) */}
          <div className="xl:block">
            <div className="sticky top-25 h-[85vh] overflow-y-auto scrollbar-thin">
              <EnquiryForm />
            </div>
          </div>

          {/* Right Column - Quotes Table */}
          <div className="">
            <div className="bg-white rounded-lg shadow-sm p-4">
              {myQuotesError ? (
                <div className="flex items-center justify-center p-8 sm:p-12">
                  <div className="text-center max-w-md">
                    <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 mb-4 flex items-center justify-center rounded-full bg-indigo-50">
                      <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-[#01137e]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Unable to load quotes
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                      We encountered an issue while fetching your data. Please
                      check your connection and try again.
                    </p>
                    <Button
                      onClick={() => refetch()}
                      rightSection={<RefreshCw className="w-4 h-4" />}
                      size="sm"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : myQuotesLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
                  <span className="ml-2 text-gray-500">Loading data...</span>
                </div>
              ) : (
                <div>
                  {/* Header with Filters */}
                  <div className="mb-6 space-y-4">
                    {/* Title and Refresh */}
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-semibold text-gray-800 tracking-wide leading-snug">
                        Shipments Details
                      </p>
                      <button
                        onClick={() => refetch()}
                        className="p-1 w-7 h-7 flex items-center justify-center rounded-md bg-blue-100 hover:bg-blue-200 cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>

                    {/* Filters Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Global Search */}
                      <TextInput
                        placeholder="Search by origin, destination, enquiry no, etc..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftSection={<Search size={14} strokeWidth={1.5} />}
                        leftSectionWidth={36}
                        radius="md"
                        size="xs"
                        w="100%"
                        withAsterisk={false}
                        styles={{
                          input: {
                            fontSize: "12px",
                            height: "5px",
                            padding: "15px 50px",
                          },
                        }}
                      />

                      {/* Status Filter */}
                      <Select
                        placeholder="Filter by status"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        leftSection={<Search size={14} strokeWidth={1.5} />}
                        leftSectionWidth={36}
                        data={statusOptions}
                        radius="md"
                        size="xs"
                        clearable
                        w="100%"
                        styles={{
                          input: {
                            fontSize: "12px",
                            height: "5px",
                            padding: "15px 50px",
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* Desktop Cards */}
                  <div className="hidden md:block">
                    {filteredData.length > 0 ? (
                      filteredData.map((data) => (
                        <QuoteCard key={data.docNo} data={data} />
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                          No shipments found
                        </h3>
                        <p className="mt-2 text-gray-600">
                          {searchQuery || statusFilter
                            ? "Try adjusting your search or filter criteria."
                            : "No enquiries, quotes or bookings available."}
                        </p>
                        {(searchQuery || statusFilter) && (
                          <Button
                            variant="light"
                            onClick={() => {
                              setSearchQuery("");
                              setStatusFilter(null);
                            }}
                            className="mt-4"
                          >
                            Clear all filters
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Mobile simplified view */}
                  <div className="md:hidden">
                    {filteredData.length > 0 ? (
                      filteredData.map((data) => (
                        <QuoteCard key={data.docNo} data={data} />
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                          No shipments found
                        </h3>
                        <p className="mt-2 text-gray-600">
                          {searchQuery || statusFilter
                            ? "Try adjusting your search or filter criteria."
                            : "No enquiries, quotes or bookings available."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal remains same */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-medium text-gray-900">
              Package Details
            </h2>
            <span className="text-sm text-gray-500">
              (Ref: {enquiryDetails?.data[0]?.docNo ?? "N/A"})
            </span>
          </div>
        }
        centered
        size="lg"
        className="rounded-lg bg-white shadow-lg"
        overlayProps={{
          color: "gray",
          opacity: 0.55,
          blur: 3,
        }}
      >
        {/* Same Modal Content */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">Date</span>
            <span>
              {enquiryDetails?.data[0]?.date
                ? dayjs(enquiryDetails.data[0].dateTime).format("DD-MM-YYYY")
                : "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">Origin</span>
            <span>{enquiryDetails?.data[0]?.origin ?? "N/A"}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">Destination</span>
            <span>{enquiryDetails?.data[0]?.destination ?? "N/A"}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">Type</span>
            <span>{enquiryDetails?.data[0]?.type ?? "N/A"}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">Service Mode</span>
            <span>{enquiryDetails?.data[0]?.service ?? "N/A"}</span>
          </div>
        </div>

        {enquiryLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
            <span className="ml-2 text-gray-500">Loading...</span>
          </div>
        ) : enquiryDetails?.data[0]?.itemdetails?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm text-gray-600">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    #
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Actual Weight (kg)
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Chargeable Weight (kg)
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Dimensions (cm)
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Girth (cm)
                  </th>
                </tr>
              </thead>
              <tbody>
                {enquiryDetails.data[0].itemdetails.map((item, i) => (
                  <tr
                    key={i}
                    className={`${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100`}
                  >
                    <td className="px-4 py-2.5">{i + 1}</td>
                    <td className="px-4 py-2.5">{item.quantity}</td>
                    <td className="px-4 py-2.5">{item.actWeight}</td>
                    <td className="px-4 py-2.5">{item.chargeableWeight}</td>
                    <td className="px-4 py-2.5">
                      {item.lengthInCm} × {item.breadthInCm} × {item.heightInCm}
                    </td>
                    <td className="px-4 py-2.5">{item.girth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No item details found
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuotesTable;
