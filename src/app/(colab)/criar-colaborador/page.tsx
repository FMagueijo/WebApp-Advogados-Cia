import * as X from "@/components/xcomponents";

export default function Utilizador() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-4xl mx-auto px-4"> 
        <div className="flex flex-row gap-8">
          <div className="flex flex-col gap-8 w-full"> 
            <X.Container className="w-full p-8">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">Criar Colaborador</p>
              </div>
              <X.Divider></X.Divider>
              <X.Field required type="text" placeholder="Nome Completo" name="Nome completo" />
              <X.Field required type="email" placeholder="Exemplo@exemplo.com" name="Email" />
              <X.Field required type="number" placeholder="Telefone" name="Telefone" />
              <X.Field required type="text" placeholder="0000-000" name="Código Postal" />
              <X.Field required type="text" placeholder="Endereço" name="Endereço" />
              <X.Submit>Criar Colaborador</X.Submit>
            </X.Container>
          </div>
        </div>
      </div>
    </div>
  );
}