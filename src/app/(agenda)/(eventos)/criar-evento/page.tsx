    "use client";

    import React, { useState } from "react";
    import * as X from "@/components/xcomponents";
    import { CasosList } from "@/components/lists/listar_casos";
    import { ColabList } from "@/components/lists/listar_colab";
    import { criarEvento } from "./actions";
    import { TipoEvento } from "@prisma/client";
    import { useSession } from "next-auth/react";
    import SimpleSkeleton from "@/components/loading/simple_skeleton";

    const CreateEventPage: React.FC = () => {
        const [showToAll, setShowToAll] = useState(true);

        const tiposEventos: Record<string, TipoEvento> = {
            "Evento": TipoEvento.EVENTO,
            "Compromisso": TipoEvento.COMPROMISSO,
            "Prazo Processual": TipoEvento.PRAZO_PROCESSUAL,
        };
        const [tipoEvento, setTipoEvento] = useState<string>(Object.keys(tiposEventos)[0]);
        const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        const dataParam = searchParams?.get("data");
        const [defaultDate, setDefaultDate] = useState<Date | undefined>(
            dataParam ? new Date(dataParam) : undefined
        );

        const [showAssociarCasos, setShowAssociarCasos] = useState(false);
        const [selectedCases, setSelectedCases] = useState<any[]>([]);

        const [showAssociarColab, setShowAssociarColab] = useState(false);
        const [selectedColabs, setSelectedColabs] = useState<any[]>([]);

        const { data: session, status } = useSession();
        const user = session?.user;

        const [isSubmitting, setIsSubmitting] = useState(false);

        const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (isSubmitting) return;

            setIsSubmitting(true);

            const formData = new FormData(event.currentTarget);

            try {
                await criarEvento(formData, Number(user?.id), tiposEventos[tipoEvento], selectedColabs, selectedCases);
            } finally {
                setIsSubmitting(false);
            }
        };

        // Show skeleton while loading session
        if (status === "loading") {
            return (
                <div className="p-8">
                    <SimpleSkeleton  />
                </div>
            );
        }

        return (
            <form onSubmit={handleSubmit} method="post">
                <div className="flex flex-row gap-8 ">
                    <X.Container className="w-full p-8 h-max">
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold">Criar evento</p>
                        </div>
                        <X.Divider></X.Divider>
                        <X.Dropdown
                            label="Tipo"
                            options={Object.keys(tiposEventos)}
                            onSelect={(selectedOption: string) => {
                                setTipoEvento(selectedOption);
                            }}
                            defaultIndex={0}
                        />
                        <X.DateTimePicker showDayAdvanceButtons showTimeSelect required name="Data" value={defaultDate} />
                        <X.Field required type="text" placeholder="" name="Titulo" />
                        <X.Textarea placeholder="" name="Descrição" maxLength={256} rows={6} />
                        <X.Field type="text" placeholder="" name="Local" />
                        <X.Submit disabled={isSubmitting}>{isSubmitting ? "Criando..." : "Criar evento"}</X.Submit>
                    </X.Container>

                    <div className="flex flex-col gap-8 min-w-xl">
                        <X.Container>
                            <h2 className="font-semibold">Casos Associados</h2>
                            <X.Divider></X.Divider>
                            <X.Button onClick={() => { setShowAssociarCasos(true) }}>Associar Caso</X.Button>
                            <X.Divider></X.Divider>
                            {selectedCases.map((caseItem) => (
                                <div key={caseItem.id} className="flex items-center gap-4">
                                    <X.Button
                                        onClick={() =>
                                            setSelectedCases((prevCases) =>
                                                prevCases.filter((c) => c.id !== caseItem.id)
                                            )
                                        }
                                    >
                                        <img
                                            className={"min-w-6 flex-shrink-0"}
                                            src={"/images/icons/close.svg"}
                                            alt={caseItem.processo}
                                        />
                                    </X.Button>
                                    <X.Link href={`/caso/${caseItem.id}`} className="w-full">
                                        [{caseItem.id}] #{caseItem.processo}
                                    </X.Link>
                                </div>
                            ))}
                        </X.Container>
                        <X.Container>
                            <h2 className="font-semibold">Colaboradores Associados</h2>
                            <X.Divider></X.Divider>
                            <X.Button onClick={() => { setShowAssociarColab(true) }}>Associar Colaborador</X.Button>
                            <X.Divider></X.Divider>
                            {selectedColabs.map((colabItem) => (
                                <div key={colabItem.id} className="flex items-center gap-4">
                                    <X.Button
                                        onClick={() =>
                                            setSelectedColabs((prevColabs) =>
                                                prevColabs.filter((c) => c.id !== colabItem.id)
                                            )
                                        }
                                    >
                                        <img
                                            className={"min-w-6 flex-shrink-0"}
                                            src={"/images/icons/close.svg"}
                                            alt={colabItem.nome}
                                        />
                                    </X.Button>
                                    <X.Link href={`/caso/${colabItem.id}`} className="w-full">
                                        [{colabItem.id}] #{colabItem.nome}
                                    </X.Link>
                                </div>
                            ))}
                        </X.Container>
                    </div>
                </div>
                <X.Popup isOpen={showAssociarCasos} title="Selecionar Casos" onClose={() => { setShowAssociarCasos(false) }} className="w-full h-full">
                    <CasosList
                        mode="select"
                        selectedCaseIds={selectedCases.map((caseItem) => caseItem.id)}
                        onSelect={(selectedCases) => {
                            setSelectedCases(selectedCases);
                        }}
                    />
                </X.Popup>
                <X.Popup isOpen={showAssociarColab} title="Selecionar Colaboradores" onClose={() => { setShowAssociarColab(false) }} className="w-full h-full">
                    <ColabList
                        mode="select"
                        selectedCaseIds={selectedColabs.map((colabItem) => colabItem.id)}
                        onSelect={(selectedColabs) => {
                            setSelectedColabs(selectedColabs);
                        }}
                    />
                </X.Popup>
            </form >
        );
    };

    export default CreateEventPage;