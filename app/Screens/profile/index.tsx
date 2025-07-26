import {Text, useWindowDimensions, View} from "react-native";
import React, {useEffect, useState} from "react";
import {SceneMap, TabView} from "react-native-tab-view";
import ProfileDetails from "@/app/Components/ProfileDetails";
import {fetchProfile} from "@/app/Services/UserService/user-service";
import User from "@/app/Services/UserService/user";
import ProfileCertificates from "@/app/Components/ProfileCertificates";
import {vinculateOfficialCertificate} from "@/app/Services/certificates/service";
import {useTranslation} from "react-i18next";
import {Stack} from "expo-router";
import { showToastSuccess} from "@/app/Services/ToastService/toast-service";

export default function Index() {
    const [user, setUser] = useState<User | null>(null);
    const { t } = useTranslation();
    const onCertificateVinculate = (documentCaseNumber) => {
        if(user) vinculateOfficialCertificate(user.id, documentCaseNumber).then( getUserInfo);

    };

    const getUserInfo = async () => {
        fetchProfile().then(
            (user) => {
                if(user) {
                    setUser(user);
                }
            }
        );
    }

    const renderScene = SceneMap({
        first: () => <ProfileDetails user={user} setUser={setUser} />,
        second: () =>  <ProfileCertificates onCertificateVinculate={onCertificateVinculate} certificates={user?.certificateDTOList.map( (certificateDTO: any) => { return certificateDTO.certificateId } ) } />,
    });

    const routes = [
        { key: 'first', title: t("profile") },
        { key: 'second', title: 'Certificates' },
    ];

    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);

    useEffect( () => {
        getUserInfo().catch();
    }, [index] )

    return (
        <>
            <Stack.Screen options={{ title: "profile" }} />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                
            />

        </>
    );

}
