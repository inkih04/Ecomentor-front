
import { CalculateForm } from "@/app/Constants/form"
import { useEffect, useReducer } from "react";
import { Certificate } from "../Constants/certificates/qualifications";
import { FieldPaths, OneOf } from "../Utils/type";

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { UseFormReturn, useForm } from "react-hook-form";
import { sendCalculateForm, vinculateUnofficialCertificate } from "../Services/Calculate/service";
import { showToastError, showToastSuccess } from "../Services/ToastService/toast-service";
import { fetchProfile } from "../Services/UserService/user-service";
import { deleteCertificate } from "../Services/certificates/service";

// FormShape defines a type with all the fields of the form
export interface CalculateFormUseProps<FormShape extends object> {
    form: CalculateForm<FormShape>;
    formSchema: yup.ObjectSchema<FormShape>;
    registerFields?: FieldPaths<FormShape>[];
}

type ProcessingType = 'submit' | 'accept' | 'reject' | 'none';
type CalculateStateType = 'form' | 'result';
type CalculateState = {
    type: CalculateStateType;
    processing: ProcessingType;
    data?: Certificate;
}

type CalculateStateAction = OneOf<{
    submit: boolean;
    result: {
        data: Certificate;
    }
    accept: boolean;
    reject: boolean;
    reset: boolean;
    error: boolean;
}>;


export const useCalculateForm = function <FormShape extends object>({ form, formSchema, registerFields }: CalculateFormUseProps<FormShape>) {
    const [state, dispatch] = useReducer(handleCalculateState, { type: 'form', processing: 'none' });
    const formResult = useForm({
        resolver: yupResolver(formSchema),
    });

    useEffect(function registerFieldsOnMount() {
        if (registerFields === undefined) return;

        registerFields.forEach((field) => formResult.register(field as any))

    }, [formSchema]);

    useEffect(function handleProcessingState() {
        if (state.processing == 'submit') {
            const handleSubmitSuccess = (data: any) => {
                sendCalculateForm(data)
                    .then(value => {
                        if (value !== undefined) {
                            dispatch({ result: { data: value as Certificate } });
                        } else {
                            dispatch({ error: true });
                        }

                    });
            };
            const handleSubmitError = (error: any) => {
                displayErrors(error);
                dispatch({ reset: true });
            };

            const submit = async () => {
                formResult.handleSubmit(handleSubmitSuccess, handleSubmitError)();
            }

            submit();
        }


        if (state.processing == 'accept') {
            fetchProfile()
                .then((user) => {
                    if (state.data === undefined)
                        throw TypeError('Data state cannot be undefined. There is an bug with hook logic');

                    return vinculateUnofficialCertificate(user.id, state.data.certificateId);
                })
                .then((result) => {
                    if (result) {
                        showToastSuccess("Certificate succesfully saved");
                    }

                    dispatch({ reset: true });
                });
        }

        if (state.processing == 'reject') {
            if (state.data === undefined)
                throw TypeError('Data state cannot be undefined. There is an bug with hook logic');

            deleteCertificate(state.data.certificateId)
                .then((result) => {
                    if (result) {
                        showToastSuccess("Certificate succesfully rejected");
                    } else {
                        showToastError("Certificate couldn't be rejected");
                    }

                    dispatch({ reset: true });
                });
        }


    }, [state.processing]);

    const returnData = formResult as unknown as UseFormReturn<FormShape, any, any>;
    return {
        submit: () => dispatch({ submit: true }),
        accept: () => dispatch({ accept: true }),
        reject: () => dispatch({ reject: true }),

        formResult: returnData,

        isProcessing: state.processing !== 'none',
        currentState: state,
    }
}

const handleCalculateState = (state: CalculateState, action: CalculateStateAction): CalculateState => {
    if (action.submit) {
        return { ...state, processing: 'submit' };
    } else if (action.result) {
        return { type: 'result', processing: 'none', data: action.result.data };
    } else if (action.accept) {
        return { ...state, processing: 'accept' };
    } else if (action.reset) {
        return { type: 'form', processing: 'none' };
    } else if (action.reject) {
        return { ...state, processing: 'reject' };
    } else if (action.error) {
        return { ...state, processing: 'none' };
    }

    return state;
};

const displayErrors = (error: object) => {
    const msgs: string[] = [];
    const search = (value: Record<string, any>, targetKey: string) => {
        if (Array.isArray(value)) {
            value.forEach((value) => search(value, targetKey));
        } else if (value !== null && typeof value === 'object') {
            for (const key in value) {
                if (key === targetKey) {
                    msgs.push(value[key] as string);
                }
                search(value[key], targetKey);
            }
        }
    }

    search(error, "message");

    if (msgs.length > 0)
        showToastError(msgs[0]);
}


export default useCalculateForm;