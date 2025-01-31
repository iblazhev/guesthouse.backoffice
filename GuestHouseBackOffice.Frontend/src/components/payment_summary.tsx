import {Pie} from "@ant-design/charts";
import {usePaymentSummaryStore} from "../store/payments/get_payments_summary.ts";
import {useEffect} from "react";
import {LoadingOutlined} from "@ant-design/icons";
import {Flex, Spin} from "antd";
import {useTranslation} from "react-i18next";

export default function PaymentSummary() {
    const {getPaymentsSummary, expenses, income, loading} =
        usePaymentSummaryStore((state) => state);
    const {t} = useTranslation();
    useEffect(() => {
        getPaymentsSummary();
    }, []); // Empty dependency array [] ensures fetch only on initial render
    if (loading) {
        return (
            <Flex align="center" gap="middle">
                <Spin indicator={<LoadingOutlined spin/>} size="large"/>
            </Flex>
        );
    }

    const config = {
        data: [
            {type: t('income'), value: income},
            {type: t('expense'), value: expenses},
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
