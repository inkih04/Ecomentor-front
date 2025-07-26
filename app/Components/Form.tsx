import React, {useEffect, useState} from 'react';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from "@/app/Constants/colors";
import AntDesign from "@expo/vector-icons/FontAwesome5";
import {useTranslation} from "react-i18next";



export interface FormField {
    key: string;
    tag?: string;
    value?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    icon?: string;
    inputMode?: string;
    disabled?: boolean;
}

export interface FormProps<T> {
    schema: yup.ObjectSchema,
    fields: FormField[],
    //Formdata type is kept generic to mantain reusability will passing eslint
    //TODO better workaround?
    formSubmit: (formData: T) => void,
    action?: string,
}

const Form: React.FC<React.PropsWithChildren<FormProps<any>>> = ({schema, fields, formSubmit, children, action = "submit"})  => {

    const { t } = useTranslation();

    const createDefaultValues = () => fields.reduce<Record<string, string>>((acc, { key, value }) => {
        acc[key] = value ?? '';
        return acc;
    }, {});

    const {control, handleSubmit, formState: { errors}, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: createDefaultValues(),
        mode: 'onChange',
    });

    useEffect(() => {
        fields.forEach(field => {
            setValue(field.key, field.value ?? '');
        });
    }, [fields]);

    const [passwordVisible, setPasswordVisible] = useState(false);


    const onPressSend = (formData) => {
        formSubmit(formData);
    }
    return (
        <View style={styles.form}>
            { fields.map(({key, placeholder, secureTextEntry, inputMode, icon, tag, disabled})  => {
                const error = errors[key];
                const errorMessage = (error?.message || '');

                return (
                    <View key = {key} style={styles.formItem}>
                        { (tag) && <Text style={styles.errorText}>{tag}</Text>  }
                        <View style={[styles.inputContainer, disabled && { backgroundColor: '#e0e0e0' }]}>
                            { (icon) && <AntDesign style={StyleSheet.flatten([styles.icon])} name={icon} size={28}/> }
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({field: {onChange, value}}) => (
                                    <TextInput
                                            //TODO improve disabled styling
                                            style= {[((icon) ? styles.input : (secureTextEntry) ? stylesEyeIcon.input : stylesNoIcon.input), disabled && { backgroundColor: 'transparent' }] }
                                            onChangeText={onChange}
                                            value={value}
                                            editable={!disabled}
                                            placeholder={placeholder ? t(placeholder) : ""}
                                            inputMode= { inputMode ?? 'text' }
                                            secureTextEntry={secureTextEntry && !passwordVisible}
                                    />
                                )}
                                name={key}
                            />
                            {secureTextEntry && (
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                >
                                    <AntDesign
                                        name={passwordVisible ? "eye" : "eye-slash"}
                                        size={24}
                                        color={colors.darkGreen}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text style={[styles.errorText, { height: errorMessage ? undefined : 0 }]}>
                            {t(errorMessage)}
                        </Text>
                    </View>
                );
            })}
            {children}
            {(action === 'submit') &&
            <TouchableOpacity style={submitButton.button} onPress={handleSubmit(onPressSend)}>
                <AntDesign name="paper-plane" size={24} color="white" style={submitButton.icon} />
                <Text style={submitButton.buttonText}>{t("submit")}</Text>
            </TouchableOpacity>
            }
            {(action === 'save') &&
            <TouchableOpacity style={saveButton.button} onPress={handleSubmit(onPressSend)}>
                <AntDesign name="save" size={24} color="white" style={saveButton.icon} />
                <Text style={saveButton.buttonText}>{t("save")}</Text>
            </TouchableOpacity>
            }

        </View>
    )
}


const styles = StyleSheet.create({
    form: {
        gap: 8,
        width: "100%",
        backgroundColor: 'transparent',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    formItem: {
        width: "100%",
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#fff",
        borderWidth: 1,
        width: "70%",
        borderColor: colors.darkGreen,
        borderRadius: 8,
        paddingHorizontal: 10,
        position: "relative",
    },
    input: {
        height: 44,
        flex: 1,
        paddingLeft: 45,
        paddingVertical: 10,
        backgroundColor: "#fff",
        color: colors.darkGreen,
        borderRadius: 8,
        zIndex: 0,
    },
    eyeIcon: {
        position: "absolute",
        right: 12,
    },
    icon: {
        position: "absolute",
        left: 12,
        color: colors.darkGreen,
        zIndex: 1,
    },
    button: {
        backgroundColor: colors.darkGreen,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 4,
        alignSelf: "flex-start",
        fontWeight: 'bold',
    }
});

const submitButton = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.forestGreen,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        marginLeft: 8,
    },
    icon: {
        color: "white",
    }
})

const saveButton = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#05F",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        marginLeft: 8,
    },
    icon: {
        color: "white",
    }
})

const stylesNoIcon = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: colors.darkGreen,
        borderRadius: 8,
        paddingHorizontal: 10,
        position: "relative",
    },
    input: {
        height: 44,
        flex: 1,
        backgroundColor: "#fff",
        color: colors.darkGreen,
        borderRadius: 8,
        zIndex: 0,
    },
});

const stylesEyeIcon = StyleSheet.create({
    input: {
        height: 44,
        flex: 1,
        paddingRight: 45,
        paddingVertical: 10,
        backgroundColor: "#fff",
        color: colors.darkGreen,
        borderRadius: 8,
        zIndex: 0,
    }
});

export default Form;
