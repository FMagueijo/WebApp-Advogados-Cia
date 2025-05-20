// components/CasosList.tsx
import { fetchCasos } from "@/app/(caso)/casos/actions";
import { GenericList } from "./generic_list";
import * as X from "@/components/xcomponents";

interface CasosListProps {
    mode?: 'view' | 'select';
    onSelect?: (selectedCases: any[]) => void;
    selectedCaseIds?: (string | number)[];
}

export function CasosList({
    mode = 'view',
    onSelect,
    selectedCaseIds = [],
}: CasosListProps) {
    const columns = [
        {
            header: "ID / Processo",
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
            header: "Assunto",
            accessor: "assunto",
            render: (value: string, caso: any) => (
                <X.DataField className="hover:bg-[var(--secondary-color)]/5">
                    {value}
                </X.DataField>
            ),
        },
        {
            header: "Criado por",
            accessor: "criadoPor",
            render: (value: string) => (
                <X.Link className="hover:text-[var(--primary-color)]">
                    {value}
                </X.Link>
            ),
        },
        {
            header: "Estado",
            accessor: "estado",
            render: (value: string, caso: any) => (
                <X.DataField
                    className="rounded-lg p-2"
                    colorOverride={
                        value === "Aberto"
                            ? "--open-color"
                            : value === "Fechado"
                                ? "--error-color"
                                : "--success-color"
                    }
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
            fetchData={fetchCasos}
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