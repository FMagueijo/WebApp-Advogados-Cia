"use client";

import React, { useState } from "react";
import * as X from "@/components/xcomponents"; // Ajuste o caminho conforme necessário

const CreateEventPage: React.FC = () => {
    const [showToAll, setShowToAll] = useState(true);

    return (
        <div className="flex flex-row gap-8 "> {/* Fundo igual ao da Navbar */}
            {/* Conteúdo da Página */}
            <X.Container className="w-full p-8">
                <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">Criar evento</p>
                </div>
                <X.Divider></X.Divider>
                <X.Field required type="text" placeholder="Ida a tribunal" name="Assunto" />
                <X.Field required type="text" placeholder="23 de fevreiro 2025 - 14:30" name="Data" />
                <div className="mb-6">
                    <X.ToggleBox
                        label="Mostrar para todos?"
                        checked={showToAll}
                        onChange={(checked) => setShowToAll(checked)}
                    />
                </div>
                <X.Submit>Criar evento</X.Submit>
            </X.Container>

            <div className="flex flex-col gap-8 min-w-xl">
                <X.Container>
                    <h2 className="font-semibold">Casos Associados</h2>
                    <X.Divider></X.Divider>
                    <X.Button>Associar Caso</X.Button>
                    <X.Divider></X.Divider>
                    <X.Link>[43] #AAA43</X.Link>
                </X.Container>
                <X.Container>
                    <h2 className="font-semibold">Colaboradores Associados</h2>
                    <X.Divider></X.Divider>
                    <X.Button>Associar Colaborador</X.Button>
                    <X.Divider></X.Divider>
                    <X.Link>[4] Telmo Maia</X.Link>
                </X.Container>
            </div>
        </div>
    );
};

export default CreateEventPage;