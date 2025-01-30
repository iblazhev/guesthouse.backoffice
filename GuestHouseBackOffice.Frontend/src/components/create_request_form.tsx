import { DatePicker, Form, Input, InputNumber, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";

import { createBookingRequestStore } from "../store/booking_request/create_booking_request.ts";
import { BookingRequest } from "../types/bookingRequest.ts";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface CreateRequestFormProps {
  formOpen: boolean;
  setFormOpen: (value: boolean) => void;
}

export default function CreateRequestForm(props: CreateRequestFormProps) {
  const { createRequest } = createBookingRequestStore((state) => state);

  function onFormFinish(values: any) {
    const { startEndDate, ...rest } = values;
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
      title="Създаване на нова заявка за резервация"
      okText="Създай"
      cancelText="Откажи"
      okButtonProps={{ autoFocus: true, htmlType: "submit" }}
      onCancel={() => props.setFormOpen(false)}
      onOk={onSubmit}
      destroyOnClose
    >
      <Form
        form={form}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
        onFinish={onFormFinish}
      >
        <Form.Item label="Име на клиента" name={"name"} required>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name={"email"}>
          <Input />
        </Form.Item>
        <Form.Item label="Телефон" name={"phone"} required>
          <Input />
        </Form.Item>
        <Form.Item label="От дата до дата" name={"startEndDate"} required>
          <RangePicker />
        </Form.Item>
        <Form.Item label="Брой хора" name={"peopleCount"} required>
          <InputNumber />
        </Form.Item>
        <Form.Item label="Брой деца" name={"kidsCount"} required>
          <InputNumber />
        </Form.Item>
        <Form.Item label="От град" name={"city"} required>
          <Input />
        </Form.Item>
        <Form.Item label="Коментари" name={"comments"}>
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
