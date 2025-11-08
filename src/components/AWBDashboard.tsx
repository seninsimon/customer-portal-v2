"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useMemo, useEffect } from "react";
import { ExternalLink, FileIcon, LoaderCircle, Package2, Truck } from "lucide-react";
import { useBookingFollowUpQuery } from "@/api/query/follow-up.query";
import { useForm } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import { Accordion, Card, TextInput, Timeline } from "@mantine/core";
import { useDetailedTrackingQuery } from "@/api/query/view-details.queries";

const AWBDashboard: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState<string>("");
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const todayString = today.toDateString();
  const monthStartString = monthStart.toDateString();

  const filterForm = useForm({
    initialValues: {
      fromDate: monthStartString,
      toDate: todayString,
      searchTerm: "",
    },
  });

  const searchParams = useSearchParams();
const awbFromUrl = searchParams.get("awb");
const dateFromUrl = searchParams.get("date");

useEffect(() => {
  if (awbFromUrl) {
    filterForm.setFieldValue("searchTerm", awbFromUrl);
  }

 if (dateFromUrl) {
    // Convert the URL date string (e.g., "2025-10-22") into a readable format
    const formattedDate = new Date(dateFromUrl).toDateString();
    filterForm.setFieldValue("fromDate", formattedDate);
  }

  
}, [awbFromUrl, dateFromUrl]);

  const { data: bookingFollowUps, isLoading: bookingFollowUpsLoading } = useBookingFollowUpQuery({
    fromDate: filterForm.values.fromDate.toString(),
    toDate: filterForm.values.toDate.toString(),
  });

  const { data: detailedTracking, isLoading: detailedTrackingLoading } = useDetailedTrackingQuery({
    bookingDocNo: selectedBooking
  });

  // ✅ Filter bookings based on search term
  const filteredBookings = useMemo(() => {
    if (!bookingFollowUps?.data) return [];
    const term = filterForm.values.searchTerm.trim().toLowerCase();
    if (!term) return bookingFollowUps.data;

    return bookingFollowUps.data.filter(item => {
      const awb = (item.AWB || "").toLowerCase();
      const carrier = (item.supplier || "").toLowerCase();
      const status = (item.status || "").toLowerCase();
      return awb.includes(term) || carrier.includes(term) || status.includes(term);
    });
  }, [bookingFollowUps?.data, filterForm.values.searchTerm]);

  return (
    <div className="bg-gray-50 pt-24 sm:pt-28 md:pt-32 lg:pt-40 min-h-screen">
      <div className="max-w-7xl py-2 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3">
            <DatePickerInput
              label="From Date"
              placeholder="Select start date"
              {...filterForm.getInputProps("fromDate")}
            />
          </div>
          <div className="lg:col-span-3">
            <DatePickerInput
              label="To Date"
              placeholder="Select end date"
              {...filterForm.getInputProps("toDate")}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-6">
            <TextInput
              label="Search"
              placeholder="Search by AWB, Carrier, or Status"
              {...filterForm.getInputProps("searchTerm")}
            />
          </div>
        </div>

        {/* Loading State */}
        {bookingFollowUpsLoading && (
          <Card className="mt-6">
            <div className="flex flex-col items-center p-8 sm:p-12">
              <LoaderCircle className="text-gray-400 animate-spin mb-4" size={40} />
              <p className="text-lg font-semibold text-gray-400 text-center">
                Fetching the details. Please wait!
              </p>
            </div>
          </Card>
        )}

        {/* No Bookings Found */}
        {filteredBookings.length === 0 && !bookingFollowUpsLoading ? (
          <Card className="mt-6">
            <div className="flex flex-col items-center p-8 sm:p-12">
              <div className="bg-gray-200 p-4 sm:p-5 rounded-full mb-4">
                <FileIcon className="text-gray-400" size={35} />
              </div>
              <p className="text-lg font-semibold mb-2">No bookings found</p>
              <p className="text-gray-600 text-center">
                No bookings found for the given criteria.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 mt-6">
            {filteredBookings.map((item) => (
              <Card key={item.docNo} radius="lg" padding="lg" withBorder className="h-fit">
                {/* AWB Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-gray-100 rounded-xl p-3 w-fit">
                    <Package2 className="text-gray-400" size={28} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs sm:text-sm">AWB Number</p>
                    <p className="text-lg sm:text-xl font-semibold break-all">
                      {item.AWB ?? "Not Available"}
                    </p>
                  </div>
                </div>

                {/* Details Grid - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-gray-500 text-xs sm:text-sm">Booked On</p>
                    <p className="text-sm sm:text-base font-medium break-words">
                      {item.bookingDate
                        ? new Date(item.bookingDate).toLocaleString()
                        : "Not Available"}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-gray-500 text-xs sm:text-sm">Updated On</p>
                    <p className="text-sm sm:text-base font-medium break-words">
                      {item.latestStatusDate
                        ? new Date(item.latestStatusDate).toLocaleString()
                        : "Not Available"}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-gray-500 text-xs sm:text-sm">Carrier</p>
                    <p className="text-sm sm:text-base font-medium break-words">
                      {item.supplier ?? "Not Available"}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-gray-500 text-xs sm:text-sm">Status</p>
                    <p className="text-sm sm:text-base font-medium break-words">
                      {item.status ?? "Not Available"}
                    </p>
                  </div>
                </div>

                {/* Accordion - Detailed Tracking */}
                <Accordion
                  variant="contained"
                  onClick={() => setSelectedBooking(item.docNo)}
                  className="border border-gray-200 rounded-lg"
                >
                  <Accordion.Item value="details">
                    <Accordion.Control className="text-sm sm:text-base">
                      <div className="flex items-center gap-2">
                        <Truck size={16} className="text-blue-600" />
                        <span className="font-semibold">Detailed Tracking</span>
                      </div>
                    </Accordion.Control>
                    <Accordion.Panel>
                      {detailedTracking && (
                        <div className="flex justify-end mb-3">
                          <a
                            target="_blank"
                            href={detailedTracking?.data?.trackingData.trackingLink}
                            className="text-blue-600 flex items-center bg-blue-50 hover:bg-blue-100 px-3 py-2 text-xs sm:text-sm rounded-lg transition-colors border border-blue-200"
                          >
                            <span>View Official Tracking</span>
                            <ExternalLink size={14} className="ml-2" />
                          </a>
                        </div>
                      )}

                      <Timeline
                        active={1}
                        bulletSize={20}
                        lineWidth={2}
                        className="pl-2"
                      >
                        
                        {detailedTrackingLoading && (
                          <div className="flex justify-center p-6">
                            <div className="flex flex-col items-center">
                              <LoaderCircle className="text-gray-400 animate-spin mb-2" size={24} />
                              <p className="text-gray-400 text-xs sm:text-sm text-center">
                                Please wait while we fetch the updates.
                              </p>
                            </div>
                          </div>
                        )}

                        {detailedTracking?.data.followUpData.length === 0 && !detailedTrackingLoading && (
                          <div className="flex justify-center p-6">
                            <p className="text-gray-400 text-xs sm:text-sm text-center">
                              No updates available for this booking.
                            </p>
                          </div>
                        )}

                        {detailedTracking?.data.followUpData.map((followUp, index) => (
                          <Timeline.Item
                            key={followUp.docNo + index}
                            bullet={<Truck size={10} />}
                            title={
                              <span className="text-sm sm:text-base font-medium">
                                {followUp.status}
                              </span>
                            }
                            className="pb-4"
                          >
                            <div className="space-y-1">
                              {/* <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                {followUp.description ?? "No detailed description available"}
                              </p> */}
                              <p className="text-gray-400 text-xs">
                                {new Date(followUp.timeUtc).toLocaleString()}
                              </p>
                            </div>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </Card>
            ))}
          </div>
        )}

        {/* Results Count - Mobile friendly */}
        {!bookingFollowUpsLoading && filteredBookings.length > 0 && (
          <div className="mt-6 p-4 bg-white rounded-xl border border-gray-300">
            <p className="text-sm text-gray-600 text-center">
              Showing <span className="font-semibold">{filteredBookings.length}</span> booking{filteredBookings.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AWBDashboard;