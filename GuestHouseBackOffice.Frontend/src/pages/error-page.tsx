import {ErrorResponse, isRouteErrorResponse, useRouteError,} from "react-router-dom";
import {useTranslation} from "react-i18next";

export default function ErrorPage() {
    const error = useRouteError();
    const {t} = useTranslation();
    let errorMessage: string;

    if (isRouteErrorResponse(error)) {
        // error is type `ErrorResponse`
        errorMessage = (error as ErrorResponse).statusText;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === "string") {
        errorMessage = error;
    } else {
        console.error(error);
        errorMessage = "Unknown error";
    }

    return (
        <div id="error-page">
            <h1>{t('oops')}</h1>
            <p>{t('errorOccured')}</p>
            <p>
                <i>{errorMessage}</i>
            </p>
        </div>
    );
}
