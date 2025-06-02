"use client"
import { FilterData } from "@/types/types";
import { Notificacao } from "@prisma/client";
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
    label?: string;
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
    min?: number;
    max?: number;
    step?: number | string;
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
    min,
    max,
    step,
}) => {
    const [internalValue, setInternalValue] = useState<string>(value);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleInternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;

        if (type === "number") {
            const numericValue = parseFloat(newValue);
            if (!isNaN(numericValue)) {
                if (min !== undefined && numericValue < min) {
                    newValue = String(min);
                }
                if (max !== undefined && numericValue > max) {
                    newValue = String(max);
                }
            } else {
                newValue = "";
            }
        }

        if (onChange) {
            onChange(e);
        }
        setInternalValue(newValue);
    };

    const inputValue = internalValue;

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
                min={type === "number" ? min : undefined}
                max={type === "number" ? max : undefined}
                step={type === "number" ? step : undefined}
            />
            {showHideToggle && (
                <ToggleBox
                    onChange={togglePasswordVisibility}
                    label="Mostrar Password"
                    checked={passwordVisible}
                />
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
const Divider: React.FC<{ orientation?: "horizontal" | "vertical"; color?: string }> = ({
    orientation = "horizontal",
    color = "--secondary-color",
}) => {
    return (
        <div
            className={`${orientation === "horizontal" ? "w-full h-px" : "h-full w-px"
                }`}
            style={{ backgroundColor: `var(${color})` }}
        />
    );
};

interface LinkProps extends ChildProps {
    href?: string;
    no_padding?: boolean;
}

const Link: React.FC<LinkProps> = ({ children, className = "", href = "", no_padding = false }) => {
    return (
        <a
            href={href}
            className={`min-h-14 min-w-max h-max content-center group flex items-center rounded-lg border-2 border-[var(--primary-color)] no-underline font-semibold hover:bg-[var(--primary-color)] gap-4 hover:text-[var(--secondary-color)] ${no_padding ? "" : "p-4"} ${className}`}
            style={{ maxWidth: '100%' }} // Only effective if parent has constrained width
        >
            <div className="flex-1 break-all whitespace-normal overflow-hidden">
                {children}
            </div>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    window.open(href, "_blank");
                }}
                className="ml-auto inline-flex group-hover:invert cursor-pointer hover:opacity-50"
                aria-label="Open in new tab"
            >
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
const Submit: React.FC<ButtonProps & { disabled?: boolean }> = ({ children, onClick, className = "", disabled = false }) => {
    return (
        <button
            type="submit"
            className={`p-4 w-full text-lg h-auto cursor-pointer rounded-lg font-semibold transition-all bg-(--submit-color) text-(--secondary-color) hover:bg-(--secondary-color) hover:text-(--submit-color) ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
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

interface DateTimePickerProps extends BaseProps {
    name: string;
    value?: Date;
    onChange?: (date: Date) => void;
    showTimeSelect?: boolean;
    required?: boolean;
    hide_label?: boolean;
    dateFormat?: string;
}
const DateTimePicker: React.FC<DateTimePickerProps & { showDayAdvanceButtons?: boolean }> = ({
    name,
    value = new Date(),
    onChange,
    showTimeSelect = false,
    required = false,
    dateFormat = "dd/MM/yyyy",
    hide_label = true,
    className = "",
    showDayAdvanceButtons = false,
}) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(value);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    const handleChange = (date: Date | null) => {
        setSelectedDate(date);
        if (onChange && date) {
            onChange(date);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
            setIsCalendarOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (selectedDate) {
            const inputElement = document.querySelector(`[name="${name}"]`) as HTMLInputElement;
            if (inputElement) {
                inputElement.value = selectedDate.toISOString();
            }
        }
    }, [selectedDate, name]);

    const handleReset = () => {
        const today = new Date();
        setSelectedDate(today);
        if (onChange) {
            onChange(today);
        }
    };

    const handleAdvanceDay = (days: number) => {
        if (!selectedDate) return;
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        setSelectedDate(newDate);
        if (onChange) {
            onChange(newDate);
        }
    };

    return (
        <div className={`flex flex-row items-center gap-4 h-22  ${className}`}>
            <div ref={pickerRef} className={`bg-(--secondary-color) p-4 rounded-lg font-light h-full flex flex-col gap-3 w-full items-center justify-center`}>
                {!hide_label && <p className="font-semibold text-xs">{required ? "{*} " : ""}{name}</p>}
                <div className="flex flex-row gap-4 w-full h-full items-center">
                    {showDayAdvanceButtons && (
                        <Button onClick={() => handleAdvanceDay(-1)} className="w-max h-full group items-center">
                            <img
                                src={"/images/icons/arrow_right.svg"}
                                alt="Toggle calendar"
                                className="w-6 h-6 rotate-180"
                            />
                        </Button>
                    )}

                    <button
                        className="group font-semibold w-full h-full flex gap-2 items-center justify-center bg-transparent border-2 border-(--secondary-color) text-(--primary-color) rounded-lg hover:opacity-75 transition-all focus:outline-none cursor-pointer"
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    >
                        <img
                            src={isCalendarOpen ? "/images/icons/close.svg" : "/images/icons/calendar.svg"}
                            alt="Toggle calendar"
                            className="w-7 h-7"
                        />
                        <p className="text-lg w-max font-light w-full select-none focus:ring-0 focus:outline-none bg-transparent border-2 border-(--secondary-color) rounded-lg">
                            {selectedDate
                                ? selectedDate.toLocaleDateString("PT-PT") +
                                (showTimeSelect
                                    ? ` ${selectedDate.toLocaleTimeString("PT-PT", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}`
                                    : "")
                                : ""}
                        </p>
                    </button>
                    {showDayAdvanceButtons && (
                        <Button onClick={() => handleAdvanceDay(1)} className="w-max h-full group items-center">
                            <img
                                src="/images/icons/arrow_right.svg"
                                alt="Toggle calendar"
                                className="w-7 h-7"
                            />
                        </Button>
                    )}
                </div>

                <input type="hidden" name={name} value={selectedDate ? selectedDate.toISOString() : ""} />
                <Popup isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} title="Selecionar Data">
                    <Calendar onDateChange={handleChange} selectedDate={selectedDate} />
                </Popup>
            </div>
            <button
                className="group font-semibold w-max h-full flex gap-2 p-4 items-center justify-center border-2 bg-(--secondary-color) border-transparent text-(--primary-color) rounded-lg hover:opacity-75 transition-all focus:outline-none cursor-pointer"
                onClick={() => handleReset()}
            >
                <img
                    src={"/images/icons/calendar_today.svg"}
                    alt="Reset date"
                    className="w-7 h-7"
                />
                Agora
            </button>
        </div>
    );
};

interface CalendarProps extends BaseProps {
    selectedDate?: Date | null;
    onDateChange?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate = new Date(), onDateChange, className = "" }) => {
    const [currentDate, setCurrentDate] = useState<Date>(selectedDate);
    const [viewMode, setViewMode] = useState<"days" | "months" | "years">("days");
    const [selectedTime, setSelectedTime] = useState<{ hour: number; minute: number }>({
        hour: selectedDate.getHours(),
        minute: selectedDate.getMinutes(),
    });

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

    const startOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handlePrev = () => {
        if (viewMode === "days") {
            setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
        } else if (viewMode === "months") {
            setCurrentDate((prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1));
        } else {
            setCurrentDate((prev) => new Date(prev.getFullYear() - 12, prev.getMonth(), 1));
        }
    };

    const handleNext = () => {
        if (viewMode === "days") {
            setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
        } else if (viewMode === "months") {
            setCurrentDate((prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1));
        } else {
            setCurrentDate((prev) => new Date(prev.getFullYear() + 12, prev.getMonth(), 1));
        }
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day, selectedTime.hour, selectedTime.minute);
        if (onDateChange) {
            onDateChange(newDate);
        }
    };

    const handleMonthClick = (month: number) => {
        setCurrentDate((prev) => new Date(prev.getFullYear(), month, 1));
        setViewMode("days");
    };

    const handleYearClick = (year: number) => {
        setCurrentDate((prev) => new Date(year, prev.getMonth(), 1));
        setViewMode("months");
    };

    const renderDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
        const startDay = startOfMonth(currentDate.getFullYear(), currentDate.getMonth());

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
        }

        for (let day = 1; day <= totalDays; day++) {
            const isSelected =
                selectedDate?.getFullYear() === currentDate.getFullYear() &&
                selectedDate?.getMonth() === currentDate.getMonth() &&
                selectedDate?.getDate() === day;

            days.push(
                <button
                    key={day}
                    className={`w-full h-10 flex items-center cursor-pointer justify-center rounded-lg transition-colors duration-200 ${isSelected
                        ? "bg-(--submit-color) text-white"
                        : "hover:bg-(--submit-color) hover:text-white"
                        }`}
                    onClick={() => handleDateClick(day)}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    const renderMonths = () => {
        return Array.from({ length: 12 }, (_, i) => (
            <button
                key={i}
                className="w-full h-10 flex items-center cursor-pointer justify-center rounded-lg transition-colors duration-200 hover:bg-(--submit-color) hover:text-white"
                onClick={() => handleMonthClick(i)}
            >
                {new Date(0, i).toLocaleString("PT-PT", { month: "short" })}
            </button>
        ));
    };

    const renderYears = () => {
        const startYear = Math.floor(currentDate.getFullYear() / 12) * 12;
        return Array.from({ length: 12 }, (_, i) => (
            <button
                key={i}
                className="w-full h-10 flex items-center cursor-pointer justify-center rounded-lg transition-colors duration-200 hover:bg-(--submit-color) hover:text-white"
                onClick={() => handleYearClick(startYear + i)}
            >
                {startYear + i}
            </button>
        ));
    };

    const handleTimeChange = (type: "hour" | "minute", value: number) => {
        setSelectedTime((prev) => {
            const newTime = { ...prev, [type]: value };
            const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), newTime.hour, newTime.minute);
            if (onDateChange) {
                onDateChange(newDate);
            }
            return newTime;
        });
    };

    return (
        <div>
            <div className={`p-4 bg-(--secondary-color) rounded-lg ${className}`}>
                <div className="flex justify-between items-center mb-4">
                    <button
                        className="text-(--primary-color) hover:opacity-75"
                        onClick={handlePrev}
                    >
                        &lt;
                    </button>
                    <span
                        className="font-semibold text-(--primary-color) cursor-pointer"
                        onClick={() => setViewMode(viewMode === "days" ? "months" : "years")}
                    >
                        {viewMode === "days"
                            ? currentDate.toLocaleString("PT-PT", { month: "long", year: "numeric" })
                            : viewMode === "months"
                                ? currentDate.getFullYear()
                                : `${Math.floor(currentDate.getFullYear() / 12) * 12} - ${Math.floor(currentDate.getFullYear() / 12) * 12 + 11}`}
                    </span>
                    <button
                        className="text-(--primary-color) hover:opacity-75"
                        onClick={handleNext}
                    >
                        &gt;
                    </button>
                </div>
                {viewMode === "days" && (
                    <div className="grid grid-cols-7 gap-2 text-center">
                        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                            <div key={day} className="font-semibold text-(--primary-color) w-full">
                                {day}
                            </div>
                        ))}
                        {renderDays()}
                    </div>
                )}
                {viewMode === "months" && <div className="grid grid-cols-3 gap-2">{renderMonths()}</div>}
                {viewMode === "years" && <div className="grid grid-cols-3 gap-2">{renderYears()}</div>}

            </div>
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                    <Field
                        type="number"
                        name="Hora"
                        value={String(selectedTime.hour)}
                        placeholder={String(selectedTime.hour)}
                        onChange={(e) => handleTimeChange("hour", Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                        className="w-16 p-2 text-center rounded-lg bg-(--background-color) text-(--primary-color)"
                        min={0}
                        max={23}

                    />
                    <label className="text-(--primary-color) font-semibold">:</label>
                    <Field
                        type="number"
                        name="Minuto"
                        placeholder={String(selectedTime.minute)}
                        value={String(selectedTime.minute)}
                        onChange={(e) => handleTimeChange("minute", Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                        className="w-16 p-2 text-center rounded-lg bg-(--background-color) text-(--primary-color)"
                        min={0}
                        max={59}
                    />

                </div>
            </div>
        </div>
    );
};

interface NotificationProps extends BaseProps {
    notificacao?: Notificacao;
    lida?: boolean;
    onClick?: () => void;
}

const Notification: React.FC<NotificationProps> = ({ notificacao = null, lida = false, className = "", onClick = null }) => {
    if (notificacao == null) return null;

    return (
        <a
            href={""}
            className={`min-h-14 max-h-32 content-center group flex flex-col items-center rounded-lg border-2 border-[var(--primary-color)] no-underline font-semibold hover:bg-[var(--primary-color)] gap-2 hover:text-[var(--secondary-color)] p-4 overflow-hidden ${className}`}
            style={{ maxWidth: '100%' }}
            onClick={onClick ? (e) => {
                e.preventDefault();
                onClick();
            } : undefined}
        >
            <div className="flex flex-row w-full items-center gap-2 ">
                {!lida && (
                    <span className="h-2 w-2 rounded-full bg-blue-500 aspect-square"></span>
                )}
                <div className="w-full truncate">
                    {notificacao.titulo}
                </div>
                <div className="w-max min-w-max font-extralight">
                    {timeAgo(notificacao.criado_em)}
                </div>
            </div>
            <div className="w-full">
                <p className="truncate w-full font-light">
                    {notificacao.mensagem}
                </p>
            </div>
        </a>



    );
};

export function timeAgo(dateTime: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - dateTime.getTime()) / 1000);

    const intervals = {
        ano: { seconds: 31536000, singular: "ano", plural: "anos" },
        mês: { seconds: 2592000, singular: "mês", plural: "meses" }, // "mês" → "meses" (plural)
        semana: { seconds: 604800, singular: "semana", plural: "semanas" },
        dia: { seconds: 86400, singular: "dia", plural: "dias" },
        hora: { seconds: 3600, singular: "hora", plural: "horas" },
        minuto: { seconds: 60, singular: "minuto", plural: "minutos" },
        segundo: { seconds: 1, singular: "segundo", plural: "segundos" },
    };

    for (const [unit, data] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / data.seconds);
        if (interval >= 1) {
            return `${interval} ${interval === 1 ? data.singular : data.plural} atrás`;
        }
    }

    return "agora mesmo";
}

interface PopupProps extends ChildProps {
    isOpen: boolean;
    onClose?: () => void;
    title?: string;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children, title, className }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 p-8 flex items-center justify-center bg-(--background-color)/90 backdrop-blur-sm">
            <div className="relative flex flex-col bg-(--background-color) max-h-full p-8 rounded-lg w-full gap-4 border-2 border-(--secondary-color)">
                <div className="flex justify-between items-center">
                    {title && <h2 className="text-lg font-semibold text-(--primary-color)">{title}</h2>}
                    <button
                        className="flex cursor-pointer items-center justify-center text-(--primary-color) hover:opacity-75"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <img src="/images/icons/close.svg" alt="Close" className="w-6 h-6" />
                    </button>
                </div>
                <Divider color="--background-color"></Divider>
                <div className="overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export { Popup };

/*

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
*/
export {
    DateTimePicker,
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
    Notification
};