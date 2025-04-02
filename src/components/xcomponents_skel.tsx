interface BaseProps {
    className?: string;
    children?: React.ReactNode;
}

interface ContainerProps extends BaseProps {
    direction?: 'vertical' | 'horizontal' | 'wrap';
}

const Container: React.FC<ContainerProps> = ({ className = "", direction = 'vertical', children }) => {
    const directionStyle = direction === 'horizontal' ? 'grid-flow-col' :
        direction === 'wrap' ? 'flex flex-wrap' : 'grid-flow-row';

    return (
        <div className={`${className} ${directionStyle} flex p-8 rounded-lg border-2 border-(--secondary-color) animate-pulse gap-8`}>{children}</div>
    );
};

const ToggleBox: React.FC<BaseProps> = ({ className = "" }) => (
    <div className={`${className} flex items-center gap-2`}>
        <div className="relative w-10 h-6 rounded-full bg-gray-300 animate-pulse">
            <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-gray-400/80 transition-transform" />
        </div>
    </div>
);

const Textarea: React.FC<BaseProps> = ({ className = "" }) => (
    <div className={`${className} w-full p-4 rounded-lg bg-gray-300/20 animate-pulse`}>
        <div className="h-24 bg-gray-400/30 rounded-md" />
    </div>
);

const Field: React.FC<BaseProps> = ({ className = "" }) => (
    <div className={`${className} w-full p-4 rounded-lg bg-gray-300/20 animate-pulse`}>
        <div className="h-8 bg-gray-400/30 rounded-md" />
    </div>
);

const ErrorBox: React.FC<BaseProps> = ({ className = "" }) => (
    <div className={`${className} w-full h-12 rounded-lg bg-red-200/30 animate-pulse`} />
);

const Button: React.FC<BaseProps> = ({ className = "" }) => (
    <div className={`${className} h-14 rounded-lg bg-gray-300/30 animate-pulse`} />
);

const Divider: React.FC<BaseProps> = ({ className = "" }) => (
    <div className={`${className} w-full h-px bg-gray-300/50 animate-pulse`} />
);

const Link: React.FC<BaseProps> = ({ className = "" }) => (
    <div className={`${className} min-h-14 rounded-lg border-2 border-gray-300/50 bg-gray-200/20 animate-pulse`} />
);

const HeaderLink: React.FC<BaseProps> = ({ className = "" }) => (
    <div className={`${className} w-full h-12 rounded-lg bg-gray-300/20 animate-pulse`} />
);

const ButtonLink: React.FC<BaseProps> = ({ className = "" }) => (
    <div className={`${className} min-h-14 rounded-lg bg-gray-300/30 animate-pulse`} />
);

const Submit: React.FC<BaseProps> = ({ className = "" }) => (
    <div className={`${className} w-full h-12 rounded-lg bg-gray-400/30 animate-pulse`} />
);

const Image: React.FC<BaseProps> = ({ className = "" }) => (
    <div className={`${className} w-full h-full aspect-video rounded-lg bg-gray-300/30 animate-pulse`} />
);

const DataField: React.FC<BaseProps> = ({ className = "" }) => (
    <div className={`${className} min-h-14 border-2 border-gray-300/50 rounded-lg bg-gray-200/20 animate-pulse`} />
);

const Dados: React.FC<BaseProps> = ({ className = "" }) => (
    <Container className={className}>
        <div className="space-y-2">
            <div className="w-1/3 h-4 bg-gray-300/30 rounded-md" />
            <div className="w-2/3 h-6 bg-gray-400/20 rounded-md" />
        </div>
    </Container>
);

const SortBox: React.FC<BaseProps> = ({ className = "" }) => (
    <div className={`${className} relative w-max`}>
        <div className="h-12 w-48 rounded-lg bg-gray-300/30 animate-pulse" />
    </div>
);

const Dropdown: React.FC<BaseProps> = ({ className = "" }) => (
    <div className={`${className} relative w-max`}>
        <div className="h-12 w-64 rounded-lg bg-gray-300/30 animate-pulse" />
    </div>
);

const FilterBox: React.FC<BaseProps> = ({ className = "" }) => (
    <div className={`${className} relative w-full`}>
        <div className="h-12 w-56 rounded-lg bg-gray-300/30 animate-pulse" />
    </div>
);

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