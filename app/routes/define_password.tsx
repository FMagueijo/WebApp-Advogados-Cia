import { useState } from "react";
import * as X from "../components/xcomponents";

const PasswordForm: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false); // Estado para controle do submit

    // Atualiza o estado da senha
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    // Atualiza o estado da repetição da senha
    const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatPassword(e.target.value);
    };

    // Validação das senhas no submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true); // Marca que o formulário foi submetido

        if (password !== repeatPassword) {
            setError('As senhas não correspondem.');
        } else {
            setError('');
            console.log('Senhas correspondem! Formulário enviado.');
        }
    };

    return (
        <form className="w-full" onSubmit={handleSubmit}>
            <X.Container>
                {/* Exibe o erro apenas após o submit */}
                {submitted && error && (
                    <X.ErrorBox>
                        <p>{error}</p>
                    </X.ErrorBox>
                )}

                <X.Field
                    required
                    type="password"
                    placeholder="Nova Password"
                    name="Nova Password"
                    value={password}
                    onChange={handlePasswordChange}
                    showHideToggle
                />
                <X.Field
                    required
                    type="password"
                    placeholder="Confirme a Password"
                    name="Confirme a Password"
                    value={repeatPassword}
                    onChange={handleRepeatPasswordChange}
                    showHideToggle
                />
                <X.Submit>Definir Nova Password</X.Submit>
            </X.Container>
        </form>
    );
};

export default function Login() {
    return (
        <div className="flex items-center justify-center w-full">
            <div className="flex flex-col gap-8 w-full lg:w-xl items-center justify-center">
                <X.Container className="w-full items-center justify-center">
                    <img src="/images/brand/logo.svg" className="h-max" />
                </X.Container>
                <PasswordForm />
                <X.Link href="">Esqueceu-se da Password?</X.Link>
            </div>
        </div>
    );
}
