import { data } from "@remix-run/node";

export async function loader() {
    return data(null, { status: 404 });
}

export default function NotFound() {
    return <h1>Not Found</h1>;
}
