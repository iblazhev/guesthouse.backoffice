import {useState} from "react";
import PaymentsTable from "../components/payments_table.tsx";
import {Button, Tabs} from "antd";
import CreatePaymentForm from "../components/create_payment_form.tsx";
import "../styles/tables.scss";
import PaymentSummary from "../components/payment_summary.tsx";
import {PieChartOutlined, TableOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";

export default function PaymentsPage() {
    const [formIncomeOpen, setFormIncomeOpen] = useState(false);
    const [formOutcomeOpen, setFormOutcomeOpen] = useState(false);
    const {t} = useTranslation();
    return (
        <>
            <div className={"table-button-header"}>
                <Button
                    size={"large"}
                    type={"primary"}
                    onClick={() => setFormIncomeOpen(true)}
                >
                    {t('createIncome')}
                </Button>
                <Button
                    size={"large"}
                    type={"primary"}
                    onClick={() => setFormOutcomeOpen(true)}
                >
                    {t('createOutcome')}
                </Button>
            </div>
            <CreatePaymentForm
                isExpense={true}
                formOpen={formOutcomeOpen}
                setFormOpen={setFormOutcomeOpen}
            />
            <CreatePaymentForm
                isExpense={false}
                formOpen={formIncomeOpen}
                setFormOpen={setFormIncomeOpen}
            />
            <Tabs
                centered
                items={[
                    {
                        key: "1",
                        label: t('table'),
                        children: <PaymentsTable/>,
                        icon: <TableOutlined/>,
                    },
                    {
                        key: "2",
                        label: t('chart'),
                        children: <PaymentSummary/>,
                        icon: <PieChartOutlined/>,
                    },
                ]}
            ></Tabs>
        </>
    );
}
