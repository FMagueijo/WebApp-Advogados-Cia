import * as X from "@/components/xcomponents";

export default function CriarCaso() {
    return (
        <div className="flex w-full justify-center items-center ">
            <div className="flex w-full xl:flex-row justify-center gap-8 flex-col xl:w-4/5">
                <X.Container className="xl:w-2/3 h-max">
                    <p className="font-semibold">Criar Caso</p>
                    <X.Divider></X.Divider>
                    <X.Field required type="text" placeholder="Processo" name="Processo" />
                    <X.Field required type="text" placeholder="Resumo" name="Resumo" />
                    <X.Textarea maxLength={256} placeholder="Descrição Detalhada" name="Descrição Detalhada" />
                    <X.Submit>Criar Caso</X.Submit>
                </X.Container>
                <X.Container className="xl:w-1/3 h-max">
                    <p className="font-semibold">Clientes Associados</p>
                    <X.Divider></X.Divider>
                    <X.Button>Associar Cliente</X.Button>
                    <X.Button>Criar e Associar Cliente</X.Button>
                    <X.Divider></X.Divider>
                    <X.Link>[23] Nuno Pinho</X.Link>
                    <X.Link>[64] Lidl</X.Link>
                </X.Container>
            </div>
        </div>
    );
}