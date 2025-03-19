import type { Route } from "./+types/home";
import * as X from "../components/xcomponents";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}
export default function Cunt() {
    return (
        <div className="flex items-center justify-center w-full">
            <div className="flex flex-col gap-8 w-full lg:w-xl items-center justify-center grid-flow-row">
                <X.Container className="w-full items-center justify-center">
                    <img src="/images/brand/logo.svg" className="h-max" />
                </X.Container>

                {/* Form container, stretched to full width on small devices */}
                <form action="" className="w-full">
                    <X.Container className="w-full">
                        <X.Field required type="email" placeholder="Email" name="Email" />
                        <X.Field required type="password" placeholder="Password" name="Password" />
                        <X.Submit>Login</X.Submit>
                    </X.Container>
                </form>
                <X.Link href="" className="">Esqueceu-se da Password?</X.Link>
            </div>
        </div>
    );
}

