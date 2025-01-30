import { Form, Input, InputNumber, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";

import { createPaymentStore } from "../store/payments/create_payment.ts";
import { Payment } from "../types/payment.ts";

interface Props {
  isExpense: boolean;
  formOpen: boolean;
  setFormOpen: (value: boolean) => void;
}

export default function CreatePaymentForm({
  isExpense,
  formOpen,
  setFormOpen,
}: Props) {
  const { createPayment } = createPaymentStore((state) => state);

  function onFormFinish(values: Payment) {
    values.isExpense = isExpense;
    createPayment(values);
    setFormOpen(false);
  }

  function onSubmit() {
    form.submit();
  }

  const [form] = Form.useForm();

  return (
    <Modal
      open={formOpen}
      title={"Създаване на нов " + (isExpense ? "разход" : "приход")}
      okText="Създай"
      cancelText="Откажи"
      okButtonProps={{ autoFocus: true, htmlType: "submit" }}
      onCancel={() => setFormOpen(false)}
      onOk={onSubmit}
      destroyOnClose
    >
      <Form
        clearOnDestroy
        form={form}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
        onFinish={onFormFinish}
        requiredMark={false}
      >
        <Form.Item
          label="Име"
          name={"name"}
          rules={[{ required: true, message: "Задължително поле" }]}
          tooltip="Задължително поле"
        >
          <Input />
        </Form.Item>
        <Form.Item label="Коментари" name={"comments"}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="Сума"
          name={"amount"}
          tooltip="Задължително поле"
          rules={[
            { required: true, message: "Задължително поле" },
            {
              type: "number",
              max: 100000,
              min: 0,
              message: "Невалидни сума",
              transform(value) {
                return Number(value);
              },
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
}
