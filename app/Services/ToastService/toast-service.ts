import Toast from "react-native-toast-message";

export const showToastError = (text1: string, text2?: string) => {
    Toast.show({
        type: 'error',
        text1: text1,
        text2: text2
    });
}

export const showToastSuccess = (text1: string, text2?:string) => {
    Toast.show({
        type: 'success',
        text1: text1,
        text2: text2
    });
}

export const showToastInfo = (text1: string, text2?:string) => {
    Toast.show({
        type: 'info',
        text1: text1,
        text2: text2
    });
}
