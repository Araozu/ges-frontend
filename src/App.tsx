import { RouteDefinition, Router, useRoutes } from "solid-app-router";
import { Index } from "./pages/Index";

const routes = [
    {
        path: "/",
        component: <Index />,
    },
] as RouteDefinition[];

export default function() {
    const Routes = useRoutes(routes);
    return (
        <>
            <Router>
                <Routes />
            </Router>
        </>
    );
}
