import {Skeleton, Table, TableProps} from "antd";
import {useEffect} from "react";
import {useBookingRequestStore} from "../store/booking_request/get_booking_requests.ts";
import {BookingRequest} from "../types/bookingRequest.ts";
import i18next from "i18next";

const columns: TableProps<BookingRequest>["columns"] = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
    },
    {
        title: i18next.t("name"),
        dataIndex: "name",
        key: "name",
    },
    {
        title: i18next.t("email"),
        dataIndex: "email",
        key: "email",
    },
    {
        title: i18next.t("phone"),
        dataIndex: "phone",
        key: "phone",
    },
    {
        title: i18next.t("startDate"),
        dataIndex: "startDate",
        key: "startDate",
    },
    {
        title: i18next.t("endDate"),
        dataIndex: "endDate",
        key: "endDate",
    },
    {
        title: i18next.t("peopleCount"),
        dataIndex: "peopleCount",
        key: "peopleCount",
    },
    {
        title: i18next.t("adultsCount"),
        dataIndex: "adultsCount",
        key: "adultsCount",
    },
    {
        title: i18next.t("kidsCount"),
        dataIndex: "kidsCount",
        key: "kidsCount",
    },
    {
        title: i18next.t("country"),
        dataIndex: "country",
        key: "country",
    },
    {
        title: i18next.t("comments"),
        dataIndex: "comments",
        key: "comments",
    },
    {
        title: i18next.t("approved"),
        dataIndex: "approved",
        key: "approved",
        render: (approved: boolean) => (approved ? "Yes" : "No"),
    },
    {
        title: i18next.t("approvedAt"),
        dataIndex: "approvedAt",
        key: "approvedAt",
    },
    {
        title: i18next.t("createdAt"),
        dataIndex: "createdAt",
        key: "createdAt",
    },
];

export default function RequestsTable() {
    const {getRequests, requests, loading} = useBookingRequestStore(
        (state) => state,
    );

    useEffect(() => {
        getRequests({});
    }, []); // Empty dependency array [] ensures fetch only on initial render

    if (loading) {
        return <Skeleton active/>;
    } else {
        return <Table columns={columns} dataSource={requests}/>;
    }
}
