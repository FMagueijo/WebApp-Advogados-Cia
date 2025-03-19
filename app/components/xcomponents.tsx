import React, { useState } from "react";

interface BaseProps {
    className?: string;
}

interface ChildProps extends BaseProps {
    children: React.ReactNode;
}

interface ContainerProps extends ChildProps {
    direction?: 'vertical' | 'horizontal'; // New property to select direction
}
const Container: React.FC<ContainerProps> = ({ children, className = "", direction = 'vertical' }) => {
    const baseStyles = "p-8 rounded-[10px] border-2 border-[var(--secondary-color)] grid gap-[32px]";

    // Determine the grid direction based on the direction prop
    const directionStyle = direction === 'horizontal' ? 'grid-flow-col' : 'grid-flow-row';

    return (
        <div className={`${className} ${baseStyles} ${directionStyle}`}>
            {children}
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
}
interface FieldProps extends BaseProps {
    type?: string;
    name?: string;
    placeholder?: string;
    required?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errorMessage?: string;
    showHideToggle?: boolean;  // To conditionally show hide button for password fields
}

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



const Field: React.FC<FieldProps> = ({
    className = "",
    type = "text",
    name = "Field",
    placeholder = "placeholder",
    required = false,
    value = "",  // Value for controlled components
    onChange,    // External onChange for controlled input
    errorMessage,
    showHideToggle = false,  // Toggle for password visibility
}) => {
    // If no external `onChange` is passed, handle it internally (uncontrolled component)
    const [internalValue, setInternalValue] = useState<string>(value);
    const [hovered, setHovered] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    
    
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleInternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInternalValue(newValue);

        // Call external onChange if it's provided
        if (onChange) {
            onChange(e);
        }
    };

    const inputValue = onChange ? value : internalValue;  // Use external value if provided, otherwise internal state

    return (
        <div className="bg-(--secondary-color) w-full p-4 rounded-[10px] font-light h-auto flex flex-col gap-3">
            <p className="font-semibold text-xs">{name}</p>
            <input
                type={showHideToggle && passwordVisible ? "text" : type} 
                name={name}
                required={required}
                placeholder={placeholder}
                value={inputValue}  // Controlled value if passed from parent or internal state
                onChange={handleInternalChange}  // Uses internal change handler if not controlled
                className={`text-l w-full select-none focus:ring-0 focus:outline-none focus:ring-0 focus:border-transparent ${className}`}
            />
            {showHideToggle && (
                <ToggleBox onChange={togglePasswordVisibility} label="Mostrar Password" checked={passwordVisible}></ToggleBox>
            )}
            {errorMessage && <p className="text-(--error-color) font-semibold text-xs">{errorMessage}</p>}
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

const ButtonLink: React.FC<ButtonLinkProps> = ({ children, href = "", className = "", selected = false, smallpadding = false, custombg = "" }) => {
    const main_color = custombg ? custombg : (selected ? "var(--primary-color)" : "var(--secondary-color)");
    const text_color = selected ? "var(--secondary-color)" : "var(--primary-color)";

    const buttonStyle = {
        backgroundColor: main_color,
        color: text_color,
    };

    const baseStyle = `h-[56px] w-max ${smallpadding ? "px-4" : "px-8"} text-center content-center cursor-pointer group flex justify-between inline-block rounded-lg no-underline p-4 font-semibold`;
    const onHoverStyle = `hover:bg-opacity-50`;

    return (
        <a
            className={`${baseStyle} ${onHoverStyle} ${className}`}
            href={href}
            style={buttonStyle} // Apply inline style for colors
        >
            {children}
        </a>
    );
};

const Submit: React.FC<ButtonProps> = ({ children, onClick, className = "" }) => {
    const baseStyles = "p-4 bg-(--submit-color) w-full text-(--secondary-color) rounded-[10px] font-semibold transition-all text-l h-auto cursor-pointer";
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
    const baseStyles = `w-full ${width} ${height} object-cover ${rounded ? "rounded-[10px]" : ""} ${shadow ? "shadow-lg" : ""}`;

    return (
        <img
            src={src}
            alt={alt}
            className={`${baseStyles} ${className}`}
        />
    );
};

export { Button, ButtonLink, Submit, Container, Field, Divider, Link, Image };
