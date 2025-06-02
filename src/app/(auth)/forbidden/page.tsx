"use client";
import * as X from "@/components/xcomponents";
import { signOut } from "next-auth/react";


async function logout() {
    console.log("Logging out...");
    await signOut({callbackUrl: '/', redirect: true});
}

export default function UnauthPage() {

    return (
        <div className="flex items-center justify-center w-full">
            <div className="flex flex-col gap-8 w-full lg:w-xl items-center justify-center grid-flow-row">
                <X.Container className="w-full text-center">
                    <div className="flex flex-col gap-4">
                        <span className="text-7xl font-bold">403</span>
                        <span className="text-4xl font-semibold">Acesso Bloqueado.</span>
                    </div>
                    <X.Button custombg="--error-color" onClick={logout} >
                        <div className="flex flex-row items-center gap-2">
                            <img src="/images/icons/logout.svg" alt="" />
                            Sair da Conta
                        </div>
                    </X.Button>
                </X.Container>

                {/*<X.Link href="/" className="">Voltar para o inicio?</X.Link>*/}
            </div>
        </div>
    );
}

