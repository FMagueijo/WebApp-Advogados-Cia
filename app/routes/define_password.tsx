import type { Route } from "./+types/home";
import * as X from "../components/xcomponents";
import { useState } from "react";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

const PasswordForm: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Handle password change
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    // Handle repeat password change
    const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatPassword(e.target.value);
    };

    // Validate passwords on form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== repeatPassword) {
            setError('Passwords do not match!');
        } else {
            setError('');
            // Proceed with form submission (e.g., send data to API)
            console.log('Passwords match, form submitted!');
        }
    };

    return (
        <form  className="w-full" onSubmit={handleSubmit}>
            <X.Container>
                <X.Field
                    required
                    type="password"
                    placeholder="Password"
                    name="Nova Password"
                    value={password}
                    onChange={handlePasswordChange}
                    showHideToggle
                    errorMessage={error && password && repeatPassword ? error : ''} // Show error if passwords don't match
                />
                <X.Field
                    required
                    type="password"
                    placeholder="Password"
                    name="Confirme a Password"
                    value={repeatPassword}
                    onChange={handleRepeatPasswordChange}
                    showHideToggle
                    errorMessage={error && password && repeatPassword ? error : ''} // Show error if passwords don't match
                />
                <X.Submit>
                    Definir Nova Password
                </X.Submit>
            </X.Container>
        </form>
    );
};

export default function Login() {
    return (
        <div className="flex items-center justify-center w-full">
            <div className="flex flex-col gap-8 w-full lg:w-xl items-center justify-center grid-flow-row">
                <X.Container className="w-full items-center justify-center">
                    <img src="/images/brand/logo.svg" className="h-max" />
                </X.Container>
                <PasswordForm></PasswordForm>
                <X.Link href="" className="">Esqueceu-se da Password?</X.Link>
            </div>
        </div>
    );
}

