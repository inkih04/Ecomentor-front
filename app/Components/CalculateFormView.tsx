import * as yup from 'yup';
import { CalculateForm, CalculateFormField, InputType } from "../Constants/form";
import { ScrollView, StyleSheet, Switch, Text, View, ViewStyle } from 'react-native';
import PageView from './PageView';
import colors from '../Constants/colors';
import { useTranslation } from 'react-i18next';
import { useContext, useState } from 'react';
import CalculateFormContext from '@/context/CalculateFormContext';
import RadioButtonView from './Form/RadioButtonView';
import NumericalInput from './Form/NumericalInput';
import FilterPicker from './CustomPicker';
import { YearInput } from './Form/YearInput';
import CustomTextInput from './Form/CustomTextInput';
import { UseFormReturn } from 'react-hook-form';
import { FieldPaths } from '../Utils/type';


interface CalculateFormViewProps<FormShape extends object> {
    form: CalculateForm<FormShape>;
    formSchema: yup.ObjectSchema<FormShape, yup.AnyObject, any, "">;
    formResult?: UseFormReturn<FormShape, any, any>;

    style?: {
        container?: ViewStyle;
        pageContainer?: ViewStyle;
    }
}

export const CalculateFormView = <FormShape extends object>({ form, formSchema, formResult, style }: CalculateFormViewProps<FormShape>) => {
    return <PageView style={{ ...style }} >{form.pages.map((page, index) => {
        return <ScrollView key={index} style={[form.styles?.pageContainer, page.style?.pageContainer]}>{
            page.fields.map((field, fieldIndex) => <FieldView key={fieldIndex} {...field} formResult={formResult}
                                                              schema={getSchemaAtPath(formSchema, field.fieldKey)} />)
        }</ScrollView>
    })}</PageView>
};

interface FieldProps {
    required: boolean;
    type: InputType;
}

const FieldView = <FormShape extends object>(props: CalculateFormField<FormShape> & {
    schema?: yup.AnySchema<any>, formResult?: UseFormReturn<any, any, any>
}) => {
    const { t } = useTranslation();

    const { type, required } = inferType(props, props.schema);
    const [isRegistered, setRegistered] = useState(required ? true : false);

    const formResult = props.formResult !== undefined ? props.formResult : useContext(CalculateFormContext)?.formResult;

    return <View style={styles.container}>
        <View style={[styles.fieldWrapper, !isRegistered && styles.disabledLabelWrapper]}>
            {isRegistered ? <Field
                    {...props}
                    type={type}
                    formResult={formResult} //ensure formResult is passed to Field
                /> :
                <Text style={styles.disabledLabel}>{t(props.labelTag ?? "")}</Text>}
        </View>
        {!required && <View style={styles.switchWrapper}>
            <Switch onValueChange={() => {
                if (isRegistered) {
                    formResult?.unregister(props.fieldKey);
                    setRegistered(prev => !prev);
                } else {
                    setRegistered(prev => !prev);
                    formResult?.register(props.fieldKey);
                }
            }}
                    value={isRegistered} />
        </View>}
    </View>;
};

function getSchemaAtPath<FormShape extends object>(schema: yup.AnySchema, path: FieldPaths<FormShape>): yup.AnySchema | undefined {
    const parts = (path as string).split('.');
    let current: any = schema;

    for (const part of parts) {
        if (current?.type === 'object' && current.fields?.[part]) {
            current = current.fields[part];
        } else {
            return undefined;
        }
    }

    return current;
}


const Field = function <FormShape extends object>(props: CalculateFormField<FormShape> & { type: InputType, formResult?: UseFormReturn<any, any, any> }) {
    const { t } = useTranslation();

    const handleRadioButtonView = <T extends string>(key: string | null, fieldKey: T) => {
        if (key === 'yes')
            props.formResult?.setValue(fieldKey, true as any);
        else
            props.formResult?.setValue(fieldKey, false as any);
    };

    switch (props.type) {
        case "booleanOption":
            props.formResult?.register(props.fieldKey);

            return (<RadioButtonView
                key={props.fieldKey + props.type}
                label={props.labelTag ? t(props.labelTag) : props.fieldKey as string}
                onPress={(key) => handleRadioButtonView(key, props.fieldKey as any)}
                onMount={(key) => handleRadioButtonView(key, props.fieldKey as any)}
                required
            />);
        case "numberInput": {
            props.formResult?.register(props.fieldKey, { valueAsNumber: true });

            return (<NumericalInput
                key={props.fieldKey + props.type}
                label={props.labelTag ? t(props.labelTag) : props.fieldKey as string}
                onChangeValue={(value) => props.formResult?.setValue(props.fieldKey, value as any)}
                units={typeof props.numberInput !== 'boolean' ? props.numberInput?.units : undefined}
                style={{
                    container: { marginVertical: 10 },
                }}
            />);
        }
        case "picker": {
            props.formResult?.register(props.fieldKey, { valueAsNumber: isArrayOfNumbers(props.picker?.values) });

            const dataset = props.picker?.data.map((type) => ({ name: t(type), value: type })) ?? [];
            if (props.picker?.values) {
                props.picker.values.forEach((value, index) => {
                    const data = dataset.at(index);
                    if (data) {
                        data.value = value.toString();
                    }
                });
            }
            let currentFormValue: string | number | boolean | undefined | null = props.formResult?.watch(props.fieldKey);


            if (currentFormValue === undefined && dataset.length > 0 && dataset[0]?.value !== undefined) {
                if (props.formResult?.getValues(props.fieldKey) === undefined) {
                    const defaultValue = dataset[0].value; // This is a string
                    props.formResult?.setValue(props.fieldKey, defaultValue as any, {
                        shouldDirty: false,
                        shouldTouch: false,
                        shouldValidate: false
                    });
                    currentFormValue = defaultValue;
                }
            }

            const selectedValueForPicker = currentFormValue !== undefined ? String(currentFormValue) : (dataset[0]?.value ?? "");

            return (<FilterPicker
                key={props.fieldKey + props.type}
                label={props.labelTag ? t(props.labelTag) : props.fieldKey as string}
                data={dataset}
                selectedValue={selectedValueForPicker}
                filterName={props.fieldKey as string}
                onValueChange={(_filterName, selectedValue) => {
                    const valueToSet = isArrayOfNumbers(props.picker?.values) ? parseFloat(selectedValue) : selectedValue;
                    props.formResult?.setValue(props.fieldKey, valueToSet as any);
                }}
            />);
        }
        case "yearInput": {
            props.formResult?.register(props.fieldKey);

            return (<YearInput
                key={props.fieldKey + props.type}
                label={props.labelTag ? t(props.labelTag) : props.fieldKey as string}
                onChangeValue={(value) => props.formResult?.setValue(props.fieldKey, value as any)}
                style={{
                    container: { marginVertical: 10 },
                }}
            />);
        }
        case "textInput": {
            props.formResult?.register(props.fieldKey);

            return (<CustomTextInput
                key={props.fieldKey + props.type}
                label={props.labelTag ? t(props.labelTag) : props.fieldKey as string}
                onChangeValue={(value) => props.formResult?.setValue(props.fieldKey, value as any)}
                pattern={typeof props.textInput !== 'boolean' ? props.textInput?.pattern : undefined}
                onMountValue={typeof props.textInput !== 'boolean' ? props.textInput?.onMountValue : undefined}
                style={{
                    container: { marginVertical: 10 },
                }}
            />);
        }
        default:
            return <Text>{`${props.fieldKey as string} COMPONENT NOT IMPLEMENTED`}</Text>;
    }

}

const inferType = function <FormShape extends object>(fieldProps: CalculateFormField<FormShape>, schemaField?: yup.AnySchema): FieldProps {
    if (schemaField === undefined)
        return { required: false, type: 'none' };

    const output: FieldProps = {
        required: false,
        type: 'textInput',
    }

    switch (schemaField.describe().type) {
        case 'number': {
            if (schemaField.describe().oneOf.length > 0) {
                output.type = 'picker';
            } else {
                output.type = 'numberInput';
            }

            break;
        }

        case 'boolean': {
            output.type = 'booleanOption';
            break;
        }
        case 'string': {
            if (schemaField.describe().oneOf.length > 0)
                output.type = 'picker';

            break;
        }
    }

    output.required = !schemaField.describe().optional;

    if (fieldProps.customType !== undefined)
        output.type = fieldProps.customType;

    return output;
}

const isArrayOfNumbers = (array?: string[] | number[]) => {
    return Array.isArray(array) && array.every(
        item => typeof item === 'number'
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 5, // Added some vertical margin for better spacing between fields
    },
    fieldWrapper: {
        flex: 1,
    },
    disabledLabelWrapper: {
        display: 'flex',
        justifyContent: 'center',
        minHeight: 50, // Ensure it has some height like other inputs
        paddingVertical: 10, // Match padding of other inputs
    },
    disabledLabel: {
        color: colors.darkGreen,
        fontSize: 16,
        fontWeight: '700',
        paddingLeft: 1, // Consistent with other label styles potentially
    },
    switchWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Center switch vertically
        paddingLeft: 10, // Add some space between field and switch
    }
});


export default CalculateFormView;