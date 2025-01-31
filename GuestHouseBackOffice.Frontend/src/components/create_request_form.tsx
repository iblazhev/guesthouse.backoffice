import {DatePicker, Form, Input, InputNumber, Modal} from "antd";
import TextArea from "antd/es/input/TextArea";

import {createBookingRequestStore} from "../store/booking_request/create_booking_request.ts";
import {BookingRequest} from "../types/bookingRequest.ts";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";

const {RangePicker} = DatePicker;

interface CreateRequestFormProps {
    formOpen: boolean;
    setFormOpen: (value: boolean) => void;
}

export default function CreateRequestForm(props: CreateRequestFormProps) {
    const {createRequest} = createBookingRequestStore((state) => state);
    const {t} = useTranslation();

    function onFormFinish(values: any) {
        const {startEndDate, ...rest} = values;
        const bookingRequest = rest as BookingRequest;
        bookingRequest.startDate = dayjs(startEndDate[0]).format("YYYY-MM-DD");
        bookingRequest.endDate = dayjs(startEndDate[1]).format("YYYY-MM-DD");
        createRequest(bookingRequest);
    }

    function onSubmit() {
        form.submit();
    }

    const [form] = Form.useForm();

    return (
        <Modal
            open={props.formOpen}
            title={t('createNewRequest')}
            okText={t('create')}
            cancelText={t('cancel')}
            okButtonProps={{autoFocus: true, htmlType: "submit"}}
            onCancel={() => props.setFormOpen(false)}
            onOk={onSubmit}
            destroyOnClose
        >
            <Form
                form={form}
                labelCol={{span: 7}}
                wrapperCol={{span: 14}}
                layout="horizontal"
                style={{maxWidth: 600}}
                onFinish={onFormFinish}
            >
                <Form.Item label={t('clientName')} name={"name"} required>
                    <Input/>
                </Form.Item>
                <Form.Item label={t("email")} name={"email"}>
                    <Input/>
                </Form.Item>
                <Form.Item label={t('phone')} name={"phone"} required>
                    <Input/>
                </Form.Item>
                <Form.Item label={t('startEndDate')} name={"startEndDate"} required>
                    <RangePicker/>
                </Form.Item>
                <Form.Item label={t('peopleCount')} name={"peopleCount"} required>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label={t('kidsCount')} name={"kidsCount"} required>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label={'cityFrom'} name={"city"} required>
                    <Input/>
                </Form.Item>
                <Form.Item label={t('comments')} name={"comments"}>
                    <TextArea rows={4}/>
                </Form.Item>
            </Form>
        </Modal>
    )
}
