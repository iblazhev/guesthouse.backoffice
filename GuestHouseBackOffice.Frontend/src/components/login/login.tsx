import {Alert, Button, Checkbox, Form, FormProps, Input, Typography,} from "antd";
import {useState} from "react";
import {UserState, useUserState} from "../../store/user.ts";
import {loginApi} from "../../services/api.ts";
import {Log} from "../../utils/log.ts";
import styles from "./login.module.scss"

const {Text, Title} = Typography;

type FieldType = {
    username: string;
    password: string;
    remember?: string;
};
export default function Login() {
    const {updateUser} = useUserState((state) => state);
    const [errorMsg, setErrorMsg] = useState("");

    const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
        console.log("Success:", values);
        loginApi({email: values.username, password: values.password}).then(
            (value: UserState | string) => {
                if (value) {
                    if (typeof value === "string" || value instanceof String) {
                        const error = value as string;
                        setErrorMsg(error);
                    } else {
                        Log.info("succesful log in");
                        value.username = values.username;
                        updateUser(value);
                    }
                }
            },
        );
    };

    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
        errorInfo,
    ) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <section className={styles.login}>
            <div className={styles.header}>
                <Title>Sign in</Title>
                <Text>
                    Welcome back to Guest House Admin UI! Please enter your details
                    below to sign in.
                </Text>
            </div>
            <Form
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                style={{maxWidth: 800}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Username"
                    name="username"
                    rules={[{required: true, message: "Please input your username!"}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[{required: true, message: "Please input your password!"}]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item<FieldType>
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{offset: 8, span: 16}}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>

                <Form.ErrorList
                    errors={
                        errorMsg
                            ? [
                                <>
                                    <Alert message={errorMsg} type="error" showIcon/>
                                </>,
                            ]
                            : undefined
                    }
                />
            </Form>
        </section>
    );
}
