


export const getCertificateLabel = function (certificate: Record<string, any>) {
    return `${certificate.addressDTO.addressName} ${certificate.addressDTO.addressNumber}, ${certificate.addressDTO.town}, ${certificate.addressDTO.province}`;
}

export default {};