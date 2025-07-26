
export const useTranslation = jest.fn(() => {
    return {
        t: (data: string) => data
    }
})

export default {}