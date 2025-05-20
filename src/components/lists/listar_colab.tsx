// components/CasosList.tsx
import { fetchCasos } from "@/app/(caso)/casos/actions";
import { GenericList } from "./generic_list";
import * as X from "@/components/xcomponents";
import { fetchColaboradores } from "@/app/(colab)/colaboradores/actions";

interface CasosListProps {
    mode?: 'view' | 'select';
    onSelect?: (selectedCases: any[]) => void;
    selectedCaseIds?: (string | number)[];
}

export function ColabList({
    mode = 'view',
    onSelect,
    selectedCaseIds = [],
}: CasosListProps) {
    const columns = [
        {
            header: "ID",
            accessor: (caso: any) => (
                mode === 'view' ? (
                    <X.Link
                        className="inline-flex gap-2 hover:text-[var(--primary-color)]"
                        href={`/caso/${caso.id}`}
                    >
                        <span>[{caso.id}]</span>
                        <span>{caso.processo}</span>
                    </X.Link>
                ) : (
                    <span className="inline-flex gap-2">
                        <span>[{caso.id}]</span>
                        <span>{caso.processo}</span>
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
        },
        {
            header: "Nº Casos",
            accessor: "casosCount",
            render: (value: string) => (
                <X.DataField
                    className="rounded-lg p-2"
                >
                    {value}
                </X.DataField>
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
            fetchData={fetchColaboradores}
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
            emptyMessage="Nenhum caso encontrado"
        />
    );
}