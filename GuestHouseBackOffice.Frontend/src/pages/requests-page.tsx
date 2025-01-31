import {Button} from "antd";
import CreateRequestForm from "../components/create_request_form.tsx";
import {useState} from "react";
import RequestsTable from "../components/requests_table.tsx";
import {useTranslation} from "react-i18next";

export default function RequestsPage() {
    const [formOpen, setFormOpen] = useState(false);
    const {t} = useTranslation();
    return (
        <>
            <div className={"table-button-header"}>
                <Button
                    size={"large"}
                    type={"primary"}
                    onClick={() => setFormOpen(true)}
                >
                    t('createRequest')
                </Button>
            </div>
            <CreateRequestForm formOpen={formOpen} setFormOpen={setFormOpen}/>
            <RequestsTable/>
        </>
    );
}
