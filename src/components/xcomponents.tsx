"use client"
import React, { useState } from "react";

interface BaseProps {
    className?: string;
}

interface ChildProps extends BaseProps {
    children: React.ReactNode;
}

interface ContainerProps extends ChildProps {
    direction?: 'vertical' | 'horizontal' | 'wrap'; // New property to select direction
    overflow?: boolean; // New boolean property to control overflow
}

const Container: React.FC<ContainerProps> = ({ children, className = "", direction = 'vertical', overflow = false }) => {
    const baseStyles = `p-8 rounded-lg border-2 border-[var(--secondary-color)] grid gap-[32px]`;

    // Determine the grid direction based on the direction prop
    let directionStyle = '';
    if (direction === 'horizontal') {
        directionStyle = 'grid-flow-col';
    } else if (direction === 'vertical') {
        directionStyle = 'grid-flow-row';
    } else if (direction === 'wrap') {
        directionStyle = 'flex flex-wrap ';
    }

    // Overflow style based on the overflow prop
    const overflowStyle = overflow ? 'overflow-auto' : 'overflow-hidden';

    return (
        <div className={`${className} ${baseStyles} ${overflowStyle} ${directionStyle}`}>
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
                className={`relative inline-block w-10 h-6 ${checked ? "bg-(--submit-color)" : "bg-(--primary-color)"} rounded-full`}
                onClick={() => onChange(!checked)}
                style={{ cursor: "pointer" }}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full  transition-transform duration-200 ease-in-out ${checked ? "translate-x-4 bg-(--secondary-color)" : "translate-x-0 bg-(--secondary-color)"}`}
                ></div>
            </div>
            <span className="text-xs font-semibold ml-2 text-(--primary-color)">{label}</span>
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
    errorMessage?: string;  // Custom error message from outside
    showHideToggle?: boolean;  // Toggle for password visibility
    validationType?: "email" | "text" | "password"; // Type of validation needed
    pattern?: RegExp; // Custom validation pattern
}

const Field: React.FC<FieldProps> = ({
    className = "",
    type = "text",
    name = "Field",
    placeholder = "placeholder",
    required = false,
    value = "",  // Value for controlled components
    onChange,    // External onChange for controlled input
    errorMessage,  // Custom external error message
    showHideToggle = false,  // Toggle for password visibility
    pattern,  // Custom validation pattern
}) => {
    const [internalValue, setInternalValue] = useState<string>(value);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null); // Error state

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Validate input based on required fields, email, custom patterns, etc.
    const validateInput = (value: string) => {
        let e_msg = "";

        // Internal validation: Required field
        if (required && value.trim() === "") {
            e_msg += `${name} é obrigatório.\n`; // Required field validation
        }

        // Email validation (if type is "email")
        if (type === "email" && value.trim() !== "" && !/\S+@\S+\.\S+/.test(value)) {
            e_msg += "Please enter a valid email address.\n"; // Basic email validation
        }

        // Pattern validation (if pattern is provided)
        if (pattern && !pattern.test(value)) {
            e_msg += `Invalid ${name}.\n`; // Pattern validation
        }

        return e_msg; // Return the accumulated error message
    };

    // Handle input change and validate
    const handleInternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInternalValue(newValue);


        // Call external onChange if it's provided
        if (onChange) {
            onChange(e);
        }

        // Perform internal validation
        const validationError = validateInput(newValue);
        setError(validationError); // Set internal validation errors

        // If there's an external error message passed as a prop, combine it with the internal validation errors
        if (errorMessage) {
            setError(prev => (prev ? prev + "\n" + errorMessage : errorMessage)); // Combine external error with internal errors
        }

    };

    const inputValue = onChange ? value : internalValue;

    // Split error messages by line to render them individually
    const errorMessages = error ? error.split("\n").filter(Boolean) : [];

    return (
        <div className="bg-(--secondary-color) w-full p-4 rounded-lg font-light h-auto flex flex-col gap-3">
            <p className="font-semibold text-xs">{required ? "{*} " : ""}{name}</p>
            <input
                type={showHideToggle && passwordVisible ? "text" : type}
                name={name}
                required={required}
                placeholder={placeholder}
                value={inputValue}  // Controlled value if passed from parent or internal state
                onChange={handleInternalChange}  // Internal change handler
                className={`text-lg w-full select-none focus:ring-0 focus:outline-none focus:ring-0 focus:border-transparent ${className}`}
            />
            {showHideToggle && (
                <ToggleBox onChange={togglePasswordVisibility} label="Mostrar Password" checked={passwordVisible}></ToggleBox>
            )}

            {/* Render error messages */}
            {errorMessages.length > 0 && (
                <div className="text-(--error-color) font-semibold text-xs">
                    {errorMessages.map((msg, idx) => (
                        <p key={idx}>- {msg}</p> // Render each error message in its own <p> element
                    ))}
                </div>
            )}
        </div>
    );
};


interface ErrorBoxProps extends ChildProps {
    direction?: 'vertical' | 'horizontal'; // New property to select direction
    overflow?: boolean; // New boolean property to control overflow
}

const ErrorBox: React.FC<ErrorBoxProps & { visible: boolean; onClose: () => void }> = ({
    children,
    className = "",
    direction = 'vertical',
    overflow = false,
    visible,
    onClose
}) => {

    const directionStyle = direction === 'horizontal' ? 'grid-flow-col' : 'grid-flow-row';
    const overflowStyle = overflow ? 'overflow-auto' : 'overflow-hidden';

    const baseStyles = "h-auto w-full content-center group flex gap-4 items-center rounded-lg p-4 bg-(--error-color) text-(--primary-color) p-4 font-semibold";
    const hiddenStyle = visible ? "" : "hidden"; // Now controlled from parent

    return (
        <div className={`${baseStyles} ${className} ${hiddenStyle}`}>
            <div className="flex-shrink-0 align-middle">
                {children}
            </div>
            <button
                onClick={onClose} // Closes the error box
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
    const main_color = selected ? "var(--primary-color)" : "var(--secondary-color)";
    const text_color = selected ? "var(--secondary-color)" : "var(--primary-color)";

    const buttonStyle = {
        backgroundColor: main_color,
        color: text_color,
    };

    const baseStyle = `h-[56px] px-4 content-center cursor-pointer group flex justify-between inline-block rounded-lg no-underline p-4 font-semibold`;
    const onHoverStyle = `hover:bg-opacity-50`;

    return (
        <button
            type="button"
            className={`${baseStyle} ${onHoverStyle} ${className}`}
            style={buttonStyle} // Apply inline style for colors
            onClick={onClick}
        >
            {children}
        </button>
    );
};

const gradientStyles = "bg-gradient-to-r from-[#F23558] to-[#F24B88] text-white hover:opacity-90";

const Divider: React.FC = () => {
    return (
        <div className="w-full h-[2px] bg-[var(--secondary-color)]" />
    );
};

interface LinkProps extends ChildProps {
    href?: string;
}

const Link: React.FC<LinkProps> = ({ children, className = "", href = "" }) => {
    const baseStyles = "h-[56px] w-full content-center group flex items-center rounded-lg border-2 border-[var(--primary-color)] no-underline p-4 font-semibold";
    const hoverStyle = "hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)]";

    return (
        <a href={href} className={`${baseStyles} ${className} ${hoverStyle}`}>
            <div className="flex-shrink-0 align-middle">
                {children}
            </div>
            <button
                onClick={(e) => {
                    e.preventDefault(); // Prevents the parent <a> from triggering
                    window.open(href, "_blank");
                }}
                className="align-middle ml-auto inline-flex group-hover:invert cursor-pointer hover:opacity-50"
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

let ButtonLink: React.FC<ButtonLinkProps> = ({ children, href = "", className = "", selected = false, smallpadding = false, custombg = "" }) => {
    let mainColor = custombg ? custombg : (selected ? "--primary-color" : "--secondary-color");
    let textColor = selected ? "--secondary-color" : "--primary-color";

    let baseStyle = `h-[56px] bg-(${mainColor}) text-(${textColor}) font-semibold py-4 ${smallpadding ? "px-4" : "px-8"} border-lg rounded-lg hover:opacity-50`;

    return (
        <a
            className={`${baseStyle} ${className}`}
            href={href}
        >
            {children}
        </a>
    );
};

const Submit: React.FC<ButtonProps> = ({ children, onClick, className = "" }) => {
    const baseStyles = "p-4 bg-(--submit-color) w-full text-(--secondary-color) rounded-lg font-semibold transition-all text-lg h-auto cursor-pointer";
    const onHoverStyle = `hover:bg-(--secondary-color) hover:text-(--submit-color)`;

    return (
        <button
            type="submit"
            className={`${baseStyles} ${onHoverStyle} ${className}`}
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

const Image: React.FC<ImageProps> = ({ src, alt, className = "", width = "100%", height = "auto", rounded = true, shadow = false }) => {
    const baseStyles = `w-full ${width} ${height} object-cover ${rounded ? "rounded-lg" : ""} ${shadow ? "shadow-lg" : ""}`;

    return (
        <img
            src={src}
            alt={alt}
            className={`${baseStyles} ${className}`}
        />
    );
};



interface DataFieldProps extends ChildProps {
    onClick?: () => void;
    colorOverride?: string;
    selected?: boolean;
}

const DataField: React.FC<DataFieldProps> = ({ children, onClick, className = "", selected = false, colorOverride = "--secondary-color" }) => {


    let baseStyle = `min-h-[56px] border-2 rounded-lg px-4 flex gap-4 p-4 font-semibold border-(${colorOverride}) `;
    return (
        <div
            className={`${baseStyle} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};




export { Button, ButtonLink, Submit, Container, Field, Divider, Link, Image, ErrorBox, ToggleBox, DataField };
