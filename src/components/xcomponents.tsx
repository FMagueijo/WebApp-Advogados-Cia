"use client"
import React, { useState } from "react";

interface BaseProps {
    className?: string;
}

interface ChildProps extends BaseProps {
    children: React.ReactNode;
}

interface ContainerProps extends ChildProps {
    direction?: 'vertical' | 'horizontal' | 'wrap';
}

const Container: React.FC<ContainerProps> = ({ children, className = "", direction = 'vertical' }) => {
    const baseStyles = "p-8 rounded-lg border-2 border-[var(--secondary-color)] grid gap-8";
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
                className={`relative inline-block w-10 h-6 rounded-full cursor-pointer ${checked ? "bg-[var(--submit-color)]" : "bg-[var(--primary-color)]"
                    }`}
                onClick={() => onChange(!checked)}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200 ease-in-out bg-[var(--secondary-color)] ${checked ? "translate-x-4" : "translate-x-0"
                        }`}
                ></div>
            </div>
            <span className="text-xs font-semibold ml-2 text-[var(--primary-color)]">{label}</span>
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
        <div className="bg-[var(--secondary-color)] w-full p-4 rounded-lg font-light flex flex-col gap-3">
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
                <div className="text-[var(--error-color)] font-semibold text-xs">
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
                <div className="text-[var(--error-color)] font-semibold text-xs">
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
    onClose: () => void;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({
    children,
    className = "",
    direction = 'vertical',
    overflow = false,
    visible,
    onClose
}) => {
    const directionStyle = direction === 'horizontal' ? 'grid-flow-col' : 'grid-flow-row';
    const overflowStyle = overflow ? 'overflow-auto' : 'overflow-hidden';

    return (
        <div className={`${!visible && 'hidden'} h-auto w-full content-center group flex gap-4 items-center rounded-lg p-4 bg-[var(--error-color)] text-[var(--primary-color)] font-semibold ${className}`}>
            <div className="flex-shrink-0 align-middle">
                {children}
            </div>
            <button
                onClick={onClose}
                className="align-middle ml-auto inline-flex cursor-pointer hover:opacity-50"
                aria-label="Close">
                <img src="/images/icons/close.svg" alt="Close" className="w-6 h-6" />
            </button>
        </div>
    );
};

interface ButtonProps extends ChildProps {
    onClick?: () => void;
    selected?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = "", selected = false }) => {
    return (
        <button
            type="button"
            className={`h-14 px-4 content-center cursor-pointer group flex justify-between inline-block rounded-lg no-underline p-4 font-semibold hover:opacity-75 ${selected
                ? "bg-[var(--primary-color)] text-[var(--secondary-color)]"
                : "bg-[var(--secondary-color)] text-[var(--primary-color)]"
                } ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

const Divider: React.FC = () => {
    return <div className="w-full h-px bg-[var(--secondary-color)]" />;
};

interface LinkProps extends ChildProps {
    href?: string;
    no_padding?: boolean;
}

const Link: React.FC<LinkProps> = ({ children, className = "", href = "", no_padding = false }) => {
    return (
        <a
            href={href}
            className={`h-14 w-full content-center group flex items-center rounded-lg border-2 border-[var(--primary-color)] no-underline font-semibold hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] ${no_padding ? "" : "p-4"
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
}

const ButtonLink: React.FC<ButtonLinkProps> = ({
    children,
    href = "",
    className = "",
    selected = false,
    smallpadding = false,
    custombg = ""
}) => {
    return (
        <a
            className={`h-14 font-semibold rounded-lg hover:opacity-75 ${selected
                ? "bg-[var(--primary-color)] text-[var(--secondary-color)]"
                : custombg
                    ? `bg-(${custombg}) text-[var(--secondary-color)]`
                    : "bg-[var(--secondary-color)] text-[var(--primary-color)]"
                } ${smallpadding ? "px-4" : "px-8"} py-4 text-center ${className}`}
            href={href}
        >
            {children}
        </a>
    );
};

const Submit: React.FC<ButtonProps> = ({ children, onClick, className = "" }) => {
    return (
        <button
            type="submit"
            className={`p-4 w-full text-lg h-auto cursor-pointer rounded-lg font-semibold transition-all bg-[var(--submit-color)] text-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:text-[var(--submit-color)] ${className}`}
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

interface DropdownProps {
    label: string;
    options: string[];
    onSelect: (selectedOption: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleSelect = (option: string) => {
        setSelectedOption(option);
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                className="w-full flex items-center justify-between px-4 py-2 bg-[var(--secondary-color)] text-[var(--primary-color)] rounded-lg border-2 border-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-all focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedOption || label}</span>
                <img
                    src="/images/icons/arrow_down.svg"
                    alt="Dropdown arrow"
                    className={`w-4 h-4 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="absolute max-w-2xl mt-2 w-full bg-[var(--secondary-color)] rounded-lg shadow-lg z-10">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className="px-4 py-2 text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] cursor-pointer"
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
    Textarea
};