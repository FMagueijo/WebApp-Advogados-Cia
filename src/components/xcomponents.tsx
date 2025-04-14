"use client"
import { FilterData } from "@/types/types";
import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

interface BaseProps {
    className?: string;
}

interface ChildProps extends BaseProps {
    children?: React.ReactNode;
}

interface ContainerProps extends ChildProps {
    direction?: 'vertical' | 'horizontal' | 'wrap';
}

const Container: React.FC<ContainerProps> = ({ children, className = "", direction = 'vertical' }) => {
    const baseStyles = "p-8 rounded-lg border-2 border-(--secondary-color) grid gap-8";
    const directionStyle = direction === 'horizontal' ? 'grid-flow-col' :
        direction === 'wrap' ? 'flex flex-wrap' : 'grid-flow-row';

    return (
        <div className={`${className} ${baseStyles}  ${directionStyle}`}>
            {children}
        </div>
    );
};

interface ToggleBoxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const ToggleBox: React.FC<ToggleBoxProps> = ({ label, checked, onChange }) => {
    return (
        <div className="flex items-center">
            <div
                className={`relative inline-block w-10 h-6 rounded-full cursor-pointer ${checked ? "bg-(--submit-color)" : "bg-(--primary-color)"
                    }`}
                onClick={() => onChange(!checked)}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200 ease-in-out bg-(--secondary-color) ${checked ? "translate-x-4" : "translate-x-0"
                        }`}
                ></div>
            </div>
            <span className="text-xs font-semibold ml-2 text-(--primary-color)">{label}</span>
        </div>
    );
};

interface TextareaProps extends BaseProps {
    name?: string;
    placeholder?: string;
    required?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    errorMessage?: string;
    rows?: number;
    maxLength?: number;
    pattern?: RegExp;
}

const Textarea: React.FC<TextareaProps> = ({
    className = "",
    name = "Textarea",
    placeholder = "placeholder",
    required = false,
    value = "",
    onChange,
    errorMessage,
    rows = 4,
    maxLength,
    pattern,
}) => {
    const [internalValue, setInternalValue] = useState<string>(value);
    const [error, setError] = useState<string | null>(null);

    const validateInput = (value: string) => {
        let e_msg = "";

        if (required && value.trim() === "") {
            e_msg += `${name} é obrigatório.\n`;
        }

        if (pattern && !pattern.test(value)) {
            e_msg += `Invalid ${name}.\n`;
        }

        return e_msg;
    };

    const handleInternalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setInternalValue(newValue);

        if (onChange) {
            onChange(e);
        }

        const validationError = validateInput(newValue);
        setError(validationError);

        if (errorMessage) {
            setError(prev => (prev ? prev + "\n" + errorMessage : errorMessage));
        }
    };

    const inputValue = onChange ? value : internalValue;
    const errorMessages = error ? error.split("\n").filter(Boolean) : [];

    return (
        <div className="bg-(--secondary-color) w-full p-4 rounded-lg font-light flex flex-col gap-3">
            <p className="font-semibold text-xs">{required ? "{*} " : ""}{name}</p>
            <textarea
                name={name}
                required={required}
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInternalChange}
                rows={rows}
                maxLength={maxLength}
                className="text-lg w-full select-none focus:ring-0 focus:outline-none bg-transparent resize-none"
            />
            {maxLength && (
                <p className="text-xs text-right text-gray-500">
                    {inputValue.length}/{maxLength}
                </p>
            )}
            {errorMessages.length > 0 && (
                <div className="text-(--error-color) font-semibold text-xs">
                    {errorMessages.map((msg, idx) => (
                        <p key={idx}>- {msg}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

interface FieldProps extends BaseProps {
    type?: string;
    name?: string;
    placeholder?: string;
    required?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errorMessage?: string;
    showHideToggle?: boolean;
    validationType?: "email" | "text" | "password";
    pattern?: RegExp;
}

const Field: React.FC<FieldProps> = ({
    className = "",
    type = "text",
    name = "Field",
    placeholder = "placeholder",
    required = false,
    value = "",
    onChange,
    errorMessage,
    showHideToggle = false,
    pattern,
}) => {
    const [internalValue, setInternalValue] = useState<string>(value);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const validateInput = (value: string) => {
        let e_msg = "";

        if (required && value.trim() === "") {
            e_msg += `${name} é obrigatório.\n`;
        }

        if (type === "email" && value.trim() !== "" && !/\S+@\S+\.\S+/.test(value)) {
            e_msg += "Please enter a valid email address.\n";
        }

        if (pattern && !pattern.test(value)) {
            e_msg += `Invalid ${name}.\n`;
        }

        return e_msg;
    };

    const handleInternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        if (onChange) {
            onChange(e);
            setInternalValue(newValue);
        } else {
            setInternalValue(newValue);
        }

        const validationError = validateInput(newValue);
        setError(validationError);

        if (errorMessage) {
            setError(prev => (prev ? prev + "\n" + errorMessage : errorMessage));
        }
    };

    const inputValue = internalValue;
    const errorMessages = error ? error.split("\n").filter(Boolean) : [];

    return (
        <div className="bg-(--secondary-color) w-full p-4 rounded-lg font-light h-max flex flex-col gap-3">
            <p className="font-semibold text-xs">{required ? "{*} " : ""}{name}</p>
            <input
                type={showHideToggle && passwordVisible ? "text" : type}
                name={name}
                required={required}
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInternalChange}
                className="text-lg w-full select-none focus:ring-0 focus:outline-none bg-transparent"
            />
            {showHideToggle && (
                <ToggleBox
                    onChange={togglePasswordVisibility}
                    label="Mostrar Password"
                    checked={passwordVisible}
                />
            )}
            {errorMessages.length > 0 && (
                <div className="text-(--error-color) font-semibold text-xs">
                    {errorMessages.map((msg, idx) => (
                        <p key={idx}>- {msg}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

interface ErrorBoxProps extends ChildProps {
    direction?: 'vertical' | 'horizontal';
    overflow?: boolean;
    visible: boolean;
    onClose?: () => void;
    hideCloseButton?: boolean;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({
    children,
    className = "",
    direction = 'vertical',
    overflow = false,
    visible,
    onClose,
    hideCloseButton = false
}) => {
    const directionStyle = direction === 'horizontal' ? 'grid-flow-col' : 'grid-flow-row';
    const overflowStyle = overflow ? 'overflow-auto' : 'overflow-hidden';

    return (
        <div className={`${!visible && 'hidden'} h-auto w-full content-center group flex gap-4 items-center rounded-lg p-4 bg-(--error-color) text-(--primary-color) font-semibold ${className}`}>
            <div className="flex-shrink-0 align-middle">
                {children}
            </div>
            {
                !hideCloseButton &&
                <button
                    onClick={onClose}
                    className="align-middle ml-auto inline-flex cursor-pointer hover:opacity-50"
                    aria-label="Close">
                    <img src="/images/icons/close.svg" alt="Close" className="w-6 h-6" />
                </button>
            }
        </div>
    );
};

interface ButtonProps extends ChildProps {
    onClick?: () => void;
    selected?: boolean;
    custombg?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = "", selected = false, custombg = undefined }) => {

    const main_col = custombg ? custombg : "--secondary-color";

    return (
        <button
            type="button"
            className={`h-14 px-4 content-center cursor-pointer group flex justify-between rounded-lg no-underline p-4 font-semibold hover:opacity-75 ${selected
                ? "text-(--secondary-color)"
                : `text-(--primary-color)`
                } ${className}`}
            onClick={onClick}
            style={{ backgroundColor: `var(${main_col})` }}
        >
            {children}
        </button>
    );
};

const Divider: React.FC = () => {
    return <div className="w-full h-px bg-(--secondary-color)" />;
};

interface LinkProps extends ChildProps {
    href?: string;
    no_padding?: boolean;
}

const Link: React.FC<LinkProps> = ({ children, className = "", href = "", no_padding = false }) => {
    return (
        <a
            href={href}
            className={`min-h-14 h-max min-w-max  content-center group flex items-center rounded-lg border-2 border-(--primary-color) no-underline font-semibold hover:bg-(--primary-color) gap-4 hover:text-(--secondary-color) ${no_padding ? "" : "p-4"
                } ${className}`}
        >
            <div className="flex-shrink-0 align-middle">
                {children}
            </div>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    window.open(href, "_blank");
                }}
                className="align-middle ml-auto inline-flex group-hover:invert cursor-pointer hover:opacity-50"
                aria-label="Open in new tab">
                <img src="/images/icons/open_in_new.svg" alt="Open link" className="w-4 h-4" />
            </button>
        </a>
    );
};

const HeaderLink: React.FC<LinkProps> = ({ children, className = "", href = "", no_padding = false }) => {
    return (
        <a
            href={href}
            className={`w-full content-center group flex items-center rounded-lg font-semibold hover:underline ${no_padding ? "" : "p-4"
                } ${className}`}
        >
            <div className="flex-shrink-0 align-middle">
                {children}
            </div>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    window.open(href, "_blank");
                }}
                className="align-middle ml-auto inline-flex cursor-pointer hover:opacity-50"
                aria-label="Open in new tab">
                <img src="/images/icons/open_in_new.svg" alt="Open link" className="w-4 h-4" />
            </button>
        </a>
    );
};

interface ButtonLinkProps extends LinkProps {
    selected?: boolean;
    custombg?: string;
    smallpadding?: boolean;
    onClick?: () => void;
}

const ButtonLink: React.FC<ButtonLinkProps> = ({
    children,
    href = "",
    className = "",
    selected = false,
    smallpadding = false,
    custombg = "",
    onClick
}) => {
    return (
        <a
            className={`min-h-14 h-max font-semibold rounded-lg hover:opacity-75 ${selected
                ? "bg-(--primary-color) text-(--secondary-color)"
                : custombg
                    ? `bg-(${custombg}) text-(--secondary-color)`
                    : "bg-(--secondary-color) text-(--primary-color)"
                } ${smallpadding ? "px-4" : "px-8"} py-4 text-center ${className}`}
            href={href}
            onClick={onClick}
        >
            {children}
        </a>
    );
};

const Submit: React.FC<ButtonProps> = ({ children, onClick, className = "" }) => {
    return (
        <button
            type="submit"
            className={`p-4 w-full text-lg h-auto cursor-pointer rounded-lg font-semibold transition-all bg-(--submit-color) text-(--secondary-color) hover:bg-(--secondary-color) hover:text-(--submit-color) ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

interface ImageProps extends BaseProps {
    src: string;
    alt: string;
    width?: string;
    height?: string;
    rounded?: boolean;
    shadow?: boolean;
}

const Image: React.FC<ImageProps> = ({
    src,
    alt,
    className = "",
    width = "100%",
    height = "auto",
    rounded = true,
    shadow = false
}) => {
    return (
        <img
            src={src}
            alt={alt}
            className={`w-full ${width} ${height} object-cover ${rounded ? "rounded-lg" : ""
                } ${shadow ? "shadow-lg" : ""} ${className}`}
        />
    );
};

interface DataFieldProps extends ChildProps {
    onClick?: () => void;
    colorOverride?: string;
    selected?: boolean;
}

const DataField: React.FC<DataFieldProps> = ({
    children,
    onClick,
    className = "",
    selected = false,
    colorOverride = "--secondary-color"
}) => {
    return (
        <div
            style={{ borderColor: `var(${colorOverride})` }}
            className={`min-h-14 border-2 rounded-lg px-4 flex gap-4 p-4 font-semibold ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

interface DadosProps {
    titulo: string;
    valor: string;
}

const Dados: React.FC<DadosProps> = ({ titulo, valor }) => (
    <Container className="w-full">
        <div className="space-y-2">
            <h2 className="text-base font-semibold text-white">{titulo}</h2>
            <p className="text-lg text-gray-500">{valor}</p>
        </div>
    </Container>
);

interface SortBoxProps {
    label: string;
    options: string[];
    onSortChange: (selectedOption: string, isInverted: boolean) => void;
    defaultIndex?: number;
}

const SortBox: React.FC<SortBoxProps> = ({ label, options, onSortChange, defaultIndex = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>(options[defaultIndex] || options[0]);
    const [isInverted, setIsInverted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelect = (option: string) => {
        setSelectedOption(option);
        onSortChange(option, isInverted);
        setIsOpen(false);
    };

    const toggleInvert = () => {
        const newInvertState = !isInverted;
        setIsInverted(newInvertState);
        onSortChange(selectedOption, newInvertState);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className="relative w-max">
            <div className="flex flex-row items-center gap-4">
                <div className="flex flex-row  rounded-lg items-center">
                    <button
                        className="group font-semibold w-max min-h-14 h-max flex items-center justify-between px-4 py-2 bg-(--secondary-color) text-(--primary-color) rounded-l-lg hover:opacity-75 transition-all focus:outline-none cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span>{label}: {selectedOption}</span>
                        <img
                            src="/images/icons/arrow_down.svg"
                            alt="Dropdown arrow"
                            className={`w-6 h-6 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    <button
                        className="group font-semibold w-max min-h-14 h-max flex items-center justify-center px-4 py-2 bg-transparent border-2 border-(--secondary-color) text-(--primary-color) rounded-r-lg hover:opacity-75 transition-all focus:outline-none cursor-pointer"
                        onClick={toggleInvert}
                    >
                        <img
                            src="/images/icons/arrow_down.svg"
                            alt="Dropdown arrow"
                            className={`w-6 h-6 transition-transform ${!isInverted ? "rotate-180" : ""}`}
                        />
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="fixed min-w-3xs gap-4 flex flex-col p-2 max-h-40 overflow-y-auto overflow-x-hidden bg-(--background-color)/90 backdrop-blur-sm mt-2 w-max rounded-lg shadow-lg z-10">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`flex min-h-14 rounded-lg h-max p-4 text-(--primary-color) ${selectedOption === option ? 'bg-(--background-color)' : 'bg-(--secondary-color)'} items-center hover:opacity-75 cursor-pointer`}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

interface DropdownProps {
    label: string;
    options: string[];
    onSelect: (selectedOption: string) => void;
    defaultIndex?: number;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, onSelect, defaultIndex = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>(options[defaultIndex] || options[0]);
    const dropdownRef = useRef<HTMLDivElement>(null); // Reference for dropdown

    const handleSelect = (option: string) => {
        console.log("Selected option:", option);
        setSelectedOption(option);
        onSelect(option);
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    // Add and remove event listener for click outside
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className="relative w-max">
            <button
                className="group font-semibold w-max min-h-14 h-max flex items-center justify-between px-4 py-2 bg-(--secondary-color) text-(--primary-color) rounded-lg hover:opacity-75 transition-all focus:outline-none cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{label}: <span className="font-light">{selectedOption}</span></span>
                <img
                    src="/images/icons/arrow_down.svg"
                    alt="Dropdown arrow"
                    className={`w-6 h-6 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="fixed min-w-3xs gap-4 flex flex-col p-2 max-h-40 overflow-y-auto overflow-x-hidden bg-(--background-color)/90 backdrop-blur-sm mt-2 w-max rounded-lg shadow-lg z-10">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`flex min-h-14 rounded-lg h-max p-4 text-(--primary-color) ${selectedOption === option ? 'bg-(--background-color)' : 'bg-(--secondary-color)'} items-center hover:opacity-75 cursor-pointer`}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface FilterBoxProps {
    label: string;
    filters: FilterData[];
    onFilterChange?: (selectedFilters: Record<string, any>) => void;
}
const FilterCard: React.FC<{ label: string; value: string; onRemove: () => void }> = ({ label, value, onRemove }) => {
    return (
        <DataField
            className="hover:bg-(--secondary-color) items-center cursor-pointer min-h-14 flex w-max flex-wrap break-words h-max gap-2"
            onClick={onRemove}
        >
            <span className="font-semibold break-words">{label}:</span>
            <span className="font-light break-words">{value}</span>
            <img src="/images/icons/close.svg" className="h-6 w-auto" alt="Remove" />
        </DataField>
    );
};
const FilterBox: React.FC<FilterBoxProps> = ({ label, filters, onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleFilterChange = (filterLabel: string, value: any) => {
        setSelectedFilters((prev) => {
            if (value === "" || value === null || value === undefined) {
                const updatedFilters = { ...prev };
                delete updatedFilters[filterLabel];
                if (onFilterChange) {
                    onFilterChange(updatedFilters);
                }
                return updatedFilters;
            }

            const updatedFilters = { ...prev, [filterLabel]: value };

            if (onFilterChange) {
                onFilterChange(updatedFilters);
            }
            return updatedFilters;
        });
    };

    const handleRemoveFilter = (filterLabel: string) => {
        setSelectedFilters((prev) => {
            const updatedFilters = { ...prev };
            delete updatedFilters[filterLabel];
            if (onFilterChange) {
                onFilterChange(updatedFilters);
            }
            return updatedFilters;
        });
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className="h-max w-max">
            <div className="flex flex-row flex-wrap w-full h-max items-center gap-4">
                <button
                    className="group font-semibold w-max min-h-14 h-max flex items-center justify-between px-4 py-2 bg-(--secondary-color) text-(--primary-color) rounded-lg hover:opacity-75 transition-all focus:outline-none cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>{label}</span>
                    <img
                        src="/images/icons/arrow_down.svg"
                        alt="Dropdown arrow"
                        className={`w-6 h-6 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                </button>
                {Object.entries(selectedFilters).map(([key, value]: [string, any], index: number) => (
                    <FilterCard
                        key={index}
                        label={key}
                        value={String(value)}
                        onRemove={() => handleRemoveFilter(key)}
                    />
                ))}
            </div>

            {isOpen && (
                <div className="fixed left-16 right-16 gap-4 flex flex-col p-4 max-h-80 overflow-y-auto overflow-x-hidden bg-(--background-color)/90 backdrop-blur-sm mt-2 w-auto rounded-lg shadow-lg z-10">
                    {filters.map((filter, index) => {
                        switch (filter.type) {
                            case "toggle":
                                return (
                                    <ToggleBox
                                        key={index}
                                        onChange={(checked) => handleFilterChange(filter.label, checked)}
                                        label={filter.label}
                                        checked={!!selectedFilters[filter.label]}
                                    />
                                );
                            case "text":
                            case "number":
                                return (
                                    <Field
                                        key={index}
                                        type={filter.type}
                                        name={filter.label}
                                        placeholder={`${filter.label}`}
                                        value={selectedFilters[filter.label] || ""}
                                        onChange={(e) => handleFilterChange(filter.label, e.target.value)}
                                    />
                                );
                            case "combobox":
                                if (filter.options) {
                                    return (
                                        <Dropdown
                                            key={index}
                                            label={filter.label}
                                            options={filter.options}
                                            onSelect={(selectedOption) => handleFilterChange(filter.label, selectedOption)}
                                        />
                                    );
                                }
                                break;
                            default:
                                return null;
                        }
                        return null;
                    })}
                </div>
            )}
        </div>
    );
};



export {
    Button,
    ButtonLink,
    HeaderLink,
    Submit,
    Container,
    Field,
    Divider,
    Link,
    Image,
    ErrorBox,
    ToggleBox,
    DataField,
    Dropdown,
    Textarea,
    FilterBox,
    Dados,
    SortBox,
};