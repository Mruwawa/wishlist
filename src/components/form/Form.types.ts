export type BaseField = {
    name: string;
    description?: string;
    required?: boolean;
};

export type TextFieldConfig = BaseField & {
    type: "text";
    defaultValue?: string;
    validate?: (value: string) => { valid: boolean, error?: string };
};

export type NumberFieldConfig = BaseField & {
    type: "number";
    defaultValue?: number;
    validate?: (value: number) => { valid: boolean, error?: string };
};

export type FieldProps = TextFieldConfig | NumberFieldConfig;

export type FormValues = Record<string, string | number>;
export type FormErrors = Record<string, string | null>;

export interface FormProps {
    fields: FieldProps[];
    onSubmit?: (values: FormValues) => void;
}