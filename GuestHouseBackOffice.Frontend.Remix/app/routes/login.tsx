import {data} from "@remix-run/node";
import {Input} from "~/components/ui/input";
import {Label} from "~/components/ui/label";
import {Button} from "~/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {InputPassword} from "~/components/custom/input-password";


export function loader() {
    return data({})
}

export default function Login() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <Card className="w-[350px] border-0 shadow-none">
                <CardHeader>
                    <CardTitle>Sign in</CardTitle>
                    <CardDescription>Welcome back to Guest House Admin UI! Please enter your details below to sign
                        in.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" placeholder="Username"/>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <InputPassword/>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Button>Login</Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
