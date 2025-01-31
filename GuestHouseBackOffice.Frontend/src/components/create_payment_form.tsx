import {Form, Input, InputNumber, Modal} from "antd";
import TextArea from "antd/es/input/TextArea";

import {createPaymentStore} from "../store/payments/create_payment.ts";
import {Payment} from "../types/payment.ts";
import {useTranslation} from "react-i18next";

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
    const {createPayment} = createPaymentStore((state) => state);
    const {t} = useTranslation();


    function onFormFinish(values: Payment) {
        values.isExpense = isExpense;
        createPayment(values);
        setFormOpen(false);
    }

    function onSubmit() {
        form.submit();
    }

    const [form] = Form.useForm();
    const type = isExpense ? t('expense') : t('income');
    return (
        <Modal
            open={formOpen}
            title={t('createTitle', {type})}
            okText={t('create')}
            cancelText={('cancel')}
            okButtonProps={{autoFocus: true, htmlType: "submit"}}
            onCancel={() => setFormOpen(false)}
            onOk={onSubmit}
            destroyOnClose
        >
            <Form
                clearOnDestroy
                form={form}
                labelCol={{span: 7}}
                wrapperCol={{span: 14}}
                layout="horizontal"
                style={{maxWidth: 600}}
                onFinish={onFormFinish}
                requiredMark={false}
            >
                <Form.Item
                    label={t('name')}
                    name={"name"}
                    rules={[{required: true, message: t('requiredField')}]}
                    tooltip={t('requiredField')}
                >
                    <Input/>
                </Form.Item>
                <Form.Item label={t('comments')} name={"comments"}>
                    <TextArea rows={4}/>
                </Form.Item>
                <Form.Item
                    label={t('amount')}
                    name={"amount"}
                    tooltip={t('requiredField')}
                    rules={[
                        {required: true, message: t('requiredField')},
                        {
                            type: "number",
                            max: 100000,
                            min: 0,
                            message: t('invalidAmount'),
                            transform(value) {
                                return Number(value);
                            },
                        },
                    ]}
                >
                    <InputNumber/>
                </Form.Item>
            </Form>
        </Modal>
    );
}
