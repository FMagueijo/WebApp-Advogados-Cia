// components/CasosList.tsx
import { GenericList } from "./generic_list";
import * as X from "@/components/xcomponents";
import { fetchClientes } from "@/app/(client)/clientes/action";

interface ClienteListProps {
    mode?: 'view' | 'select';
    onSelect?: (selectedCases: any[]) => void;
    selectedCaseIds?: (string | number)[];
}

export function ClienteList({
    mode = 'view',
    onSelect,
    selectedCaseIds = [],
}: ClienteListProps) {
    const columns = [
        {
            header: "ID",
            accessor: (caso: any) => (
                mode === 'view' ? (
                    <X.Link
                        className="inline-flex gap-2 hover:text-[var(--primary-color)]"
                        href={`/cliente/${caso.id}`}
                    >
                        <span>[{caso.id}]</span>
                    </X.Link>
                ) : (
                    <span className="inline-flex gap-2">
                        <span>[{caso.id}]</span>
                    </span>
                )
            ),
        },
        {
            header: "Nome",
            accessor: "nome",
            render: (value: string, caso: any) => (
                <X.DataField className="hover:bg-[var(--secondary-color)]/5">
                    {value}
                </X.DataField>
            ),
        },
        {
            header: "Email",
            accessor: "email",
            render: (value: string) => (
                <X.Link href={`mailto:${value}`} className="hover:text-[var(--primary-color)]">
                    {value}
                </X.Link>
            ),
        }
    ];

    const filters = [
        {
            label: "Filtrar Por Estado",
            field: "estado",
            options: [
                { value: "Aberto", label: "Aberto" },
                { value: "Fechado", label: "Fechado" },
                { value: "Terminado", label: "Terminado" },
            ],
        },
    ];

    const sortOptions = [
        { label: "ID", field: "id" },
        { label: "Processo", field: "processo" },
        { label: "Assunto", field: "assunto" },
    ];

    return (
        <GenericList
            fetchData={fetchClientes}
            columns={columns}
            filters={filters}
            sortOptions={sortOptions}
            selection={
                mode === 'select'
                    ? {
                        selectedIds: selectedCaseIds,
                        onSelectionChange: (selectedItems) => {
                            if (onSelect) {
                                onSelect(selectedItems);
                            }
                        },
                    }
                    : undefined
            }
            emptyMessage="Nenhum cliente encontrado"
        />
    );
}