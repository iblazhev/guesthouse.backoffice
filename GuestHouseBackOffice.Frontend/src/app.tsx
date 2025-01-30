import Login from "./components/login/login.tsx";
import Home from "./pages/home.tsx";
import {createAxios} from "./services/api";
import {useUserState} from "./store/user";

export default function App() {
    createAxios();
    const {authorized} = useUserState((state) => state);

    return (
        <>
            {authorized && <Home/>}
            {!authorized && <Login/>}
        </>
    );
}
