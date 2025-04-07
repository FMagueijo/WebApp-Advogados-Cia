// app/(colab)/colaboradores/criar/page.tsx
import * as X from "@/components/xcomponents";
import { criarColaborador } from "./actions";

export default function Utilizador() {
  return (
    <div className="flex justify-center items-start min-h-screen pt-0"> {/* Removido padding-top */}
      <div className="w-full max-w-4xl mx-auto px-4 mt-0"> {/* Removido margin-top */}
        <div className="flex flex-row gap-0"> {/* Removido gap */}
          <div className="flex flex-col gap-0 w-full"> {/* Removido gap */} 
            <X.Container className="w-full p-4"> {/* Reduzido padding */}
              <form action={criarColaborador} className="space-y-4"> {/* Reduzido espaçamento */}
                <div className="flex justify-between items-center pb-2"> {/* Adicionado padding-bottom */}
                  <p className="text-lg font-semibold">Criar Colaborador</p>
                </div>
                <X.Divider ></X.Divider> {/* Reduzido margin */}
                
                <div className="space-y-3"> {/* Reduzido espaçamento entre campos */}
                  <X.Field required type="text" placeholder="Nome Completo" name="Nome completo" />
                  <X.Field required type="email" placeholder="Exemplo@exemplo.com" name="Email" />
                  <X.Field required type="number" placeholder="Telefone" name="Telefone" />
                  <X.Field required type="text" placeholder="0000-000" name="Código Postal" />
                  <X.Field required type="text" placeholder="Endereço" name="Endereço" />
                </div>
                
                <div className="pt-2"> {/* Reduzido espaçamento antes do botão */}
                  <X.Submit>Criar Colaborador</X.Submit>
                </div>
              </form>
            </X.Container>
          </div>
        </div>
      </div>
    </div>
  );
}