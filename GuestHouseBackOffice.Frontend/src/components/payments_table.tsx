import { Skeleton, Table, TableProps } from "antd";
import { useEffect } from "react";
import { usePaymentStore } from "../store/payments/get_payments.ts";

import { DownSquareTwoTone, UpSquareTwoTone } from "@ant-design/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Payment } from "../types/payment.ts";

const columns: TableProps<Payment>["columns"] = [
  {
    title: "",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Име",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Коментар",
    dataIndex: "comments",
    key: "comments",
  },
  {
    title: "Сума",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Тип",
    dataIndex: "isExpense",
    key: "isExpense",
    render: (isExpense: boolean) =>
      isExpense ? (
        <DownSquareTwoTone twoToneColor={"#eb2f96"} style={{ fontSize: 30 }} />
      ) : (
        <UpSquareTwoTone twoToneColor={"#52c41a"} style={{ fontSize: 30 }} />
      ),
  },
  {
    title: "Създадено на",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (createdAt: number) =>
      dayjs.utc(createdAt).local().format("DD.MM.YYYY HH:mm:ss"),
  },
];

export default function PaymentsTable() {
  dayjs.extend(utc);
  const { getPayments, payments, loading } = usePaymentStore((state) => state);

  useEffect(() => {
    getPayments({});
  }, []); // Empty dependency array [] ensures fetch only on initial render

  if (loading) {
    return <Skeleton active />;
  } else {
    return (
      <div className={"table-box"}>
        <Table className={"table"} columns={columns} dataSource={payments} />
      </div>
    );
  }
}
