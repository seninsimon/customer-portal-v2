"use client";

import { Card, Button, ActionIcon } from "@mantine/core";
import { MutateOptions } from "@tanstack/react-query";
import { ColDef, themeQuartz } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import dayjs from "dayjs";
import { Download, Loader } from "lucide-react";
import React, { FC, useEffect, useState } from "react";

interface MyQuotesTableProps {
  myQuotesLoading: boolean;
  rowData: {
    origin: string;
    destination: string;
    date: Date;
    time: string;
    status: string;
    weight: string;
    type: string;
    service: string;
    mode: string;
    docNo: string;
    docType: string;
    destinationCntryDocNo: string;
    originCntryDocNo: string;
    approvedBy: string;
  }[];
  activeTab: string;
  isPending: boolean;
  mobileColDefs: ColDef[];
  desktopColDefs: ColDef[];
  downloadQuote: (
    variables: {
      docType: string;
      docNo: string;
    },
    options?: MutateOptions<
      {
        blob: Blob;
        docNo: string;
      },
      Error,
      {
        docType: string;
        docNo: string;
      },
      unknown
    >
  ) => Promise<{
    blob: Blob;
    docNo: string;
  }>;
  handleApprovalRoute: (quote: {
    docType: string;
    docNo: string;
    destinationCntryDocNo?: string;
    originCntryDocNo?: string;
  }) => void;
}

const MyQuotesTable: FC<MyQuotesTableProps> = ({
  myQuotesLoading,
  rowData,
  activeTab,
  isPending,
  mobileColDefs,
  desktopColDefs,
  downloadQuote,
  handleApprovalRoute,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <>
      {/* Mobile View */}
      {isMobile ? (
        <div className="p-4">
          {myQuotesLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader />
            </div>
          ) : rowData && rowData.length > 0 ? (
            <div className="space-y-4">
              {rowData?.map((item, index) => (
                <Card key={index} padding="md" radius="md" withBorder>
                  <div className="space-y-3">
                    {/* Route */}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-base">
                          {item.origin} → {item.destination}
                        </div>
                        <div className="text-sm text-gray-600">
                          {dayjs(item.date).format("DD-MM-YYYY")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{item.status}</div>
                        <div className="text-xs text-gray-500">
                          {item.weight}kg
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Type:</span> {item.type}
                      </div>
                      <div>
                        <span className="text-gray-500">Service:</span>{" "}
                        {item.service}
                      </div>
                      <div>
                        <span className="text-gray-500">Mode:</span> {item.mode}
                      </div>
                      <div>
                        <span className="text-gray-500">Time:</span>{" "}
                        {dayjs(item.time).format("HH:mm")}
                      </div>
                    </div>

                    {/* Actions */}
                    {activeTab === "SQ" && (
                      <div className="flex gap-2 pt-2">
                        {item.approvedBy ? (
                          <Button
                            color="blue"
                            fullWidth
                            onClick={async () =>
                              await downloadQuote({
                                docType: item.docType,
                                docNo: item.docNo,
                              })
                            }
                            disabled={isPending}
                            leftSection={<Download size={16} />}
                            h={"2.4rem"}
                          >
                            Download Quote
                          </Button>
                        ) : (
                          <>
                            <Button
                              color="green"
                              fullWidth
                              onClick={() => handleApprovalRoute(item)}
                              disabled={isPending}
                              h={"2.4rem"}
                            >
                              Approve
                            </Button>
                            <ActionIcon
                              variant="light"
                              color="blue"
                              size="lg"
                              h={"2.4rem"}
                              radius={"0.75rem"}
                              onClick={async () =>
                                await downloadQuote({
                                  docType: item.docType,
                                  docNo: item.docNo,
                                })
                              }
                              disabled={isPending}
                            >
                              <Download size={16} />
                            </ActionIcon>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </div>
      ) : (
        /* Desktop/Tablet Table View */
        <div className="w-full" style={{ height: 500 }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={
              window.innerWidth < 1024 ? mobileColDefs : desktopColDefs
            }
            pagination={false}
            animateRows={true}
            theme={themeQuartz.withParams({
              fontFamily: "Reddit Sans Condensed, sans-serif",
              fontSize: window.innerWidth < 1024 ? "12px" : "14px",
            })}
            loading={myQuotesLoading}
            suppressCellFocus={true}
            domLayout="normal"
            suppressHorizontalScroll={false}
            rowClassRules={{
              "qa-row": (params) =>
                activeTab === "SE" &&
                params.data?.docNo?.toLowerCase().startsWith("qa"),
            }}
            enableCellTextSelection={true}
            ensureDomOrder={true}
          />
        </div>
      )}
    </>
  );
};

export default MyQuotesTable;
