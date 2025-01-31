import * as ReactDOM from "react-dom/client";
import "./utils/i18.ts";
import App from "./app.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LandingPage from "./pages/landing-page.tsx";
import RequestsPage from "./pages/requests-page.tsx";
import PaymentsPage from "./pages/payments-page.tsx"; // Import Bulgarian locale for Ant Design
// Import Bulgarian locale for Ant Design
// Import Bulgarian locale for Ant Design

const router = createBrowserRouter(
    [
        {
            path: "",
            element: <App/>,
            // errorElement: <ErrorPage />,
            children: [
                {
                    path: "",
                    element: <LandingPage/>,
                },
                {
                    path: "requests",
                    element: <RequestsPage/>,
                },
                {
                    path: "payments",
                    element: <PaymentsPage/>,
                }
            ],
        },
    ],
    {
        basename: "/",
    },
);

ReactDOM.createRoot(document.getElementById("root")!).render(
    //<ConfigProvider locale={bgBG} theme={theme}>
    <RouterProvider router={router}/>
    // </ConfigProvider>,
);
