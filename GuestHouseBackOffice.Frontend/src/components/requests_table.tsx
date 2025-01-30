import { Skeleton, Table, TableProps } from "antd";
import { useEffect } from "react";
import { useBookingRequestStore } from "../store/booking_request/get_booking_requests.ts";
import { BookingRequest } from "../types/bookingRequest.ts";

const columns: TableProps<BookingRequest>["columns"] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate",
  },
  {
    title: "People Count",
    dataIndex: "peopleCount",
    key: "peopleCount",
  },
  {
    title: "Adults Count",
    dataIndex: "adultsCount",
    key: "adultsCount",
  },
  {
    title: "Kids Count",
    dataIndex: "kidsCount",
    key: "kidsCount",
  },
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
  },
  {
    title: "Comments",
    dataIndex: "comments",
    key: "comments",
  },
  {
    title: "Approved",
    dataIndex: "approved",
    key: "approved",
    render: (approved: boolean) => (approved ? "Yes" : "No"),
  },
  {
    title: "Approved At",
    dataIndex: "approvedAt",
    key: "approvedAt",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
  },
];

export default function RequestsTable() {
  const { getRequests, requests, loading } = useBookingRequestStore(
    (state) => state,
  );

  useEffect(() => {
    getRequests({});
  }, []); // Empty dependency array [] ensures fetch only on initial render

  if (loading) {
    return <Skeleton active />;
  } else {
    return <Table columns={columns} dataSource={requests} />;
  }
}
