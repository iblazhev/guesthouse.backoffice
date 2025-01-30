import { Pie } from "@ant-design/charts";
import { usePaymentSummaryStore } from "../store/payments/get_payments_summary.ts";
import { useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";

export default function PaymentSummary() {
  const { getPaymentsSummary, expenses, income, loading } =
    usePaymentSummaryStore((state) => state);

  useEffect(() => {
    getPaymentsSummary();
  }, []); // Empty dependency array [] ensures fetch only on initial render
  if (loading) {
    return (
      <Flex align="center" gap="middle">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </Flex>
    );
  }

  const config = {
    data: [
      { type: "Приход", value: income },
      { type: "Разход", value: expenses },
    ],
    angleField: "value",
    colorField: "type",
    label: {
      text: "value",
      position: "outside",
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
  };
  return <Pie {...config} />;
}
