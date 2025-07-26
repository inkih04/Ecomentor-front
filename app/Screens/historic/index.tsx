import React, { useState, } from "react";
import { Text, useWindowDimensions, StyleSheet, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { SceneMap, TabView, TabBar } from "react-native-tab-view";

import InfoCard from "@/app/Components/InfoCard";

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import * as Historic from "@/app/Constants/historic";

import HistoricBarChart from "@/app/Components/HistoricBarChart";
import LocationFilterProvider from "@/app/Components/Providers/LocationFilterProvider";


export default function Index() {
    const layout = useWindowDimensions();
    const { t } = useTranslation();

    const ConstantC02View = () => <CO2View />;
    const ConstantEnergyView = () => <EnergyTransitionView />;
    
    const routes = [
        { key: 'first', title: t('co2Emission') },
        { key: 'second', title: t('energyTransition') },
    ];

    const renderScene = SceneMap({
        first: ConstantC02View,
        second: ConstantEnergyView,
    });

    return (
        <LocationFilterProvider>
            <Stack.Screen options={{ title: "historic" }} />
            <CustomTabView
                routes={routes}
                renderScene={renderScene}
                width={layout.width}
                />
        </LocationFilterProvider>
    );
    
}

interface CustomTabViewProps {
    width?: number;
    renderScene: any;
    routes: Route[];
}
const CustomTabView: React.FC<CustomTabViewProps> = ({ width, renderScene, routes }) => {
    const [index, setIndex] = useState(0);

    return (<TabView 
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: width }}
        renderTabBar={renderTabBar}
        lazy
        />);
}

/**
 * Interface used for type checking
 */
interface Route {
    key: string;
    title: string;
}
const renderTabBar = (props: import('react-native-tab-view').TabBarProps<Route>) => {
    return (
        <TabBar
            testID="TabBar"
            {...props}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={styles.tabBar} />
    );
}

interface InformationCardProps {
    titleTag: string;
    icon: React.JSX.Element;
    textTag: string;
}

const InformationCard: React.FC<InformationCardProps> = (props) => {
    const { t } = useTranslation();

    return (<InfoCard 
        title={t(props.titleTag)}
        icon={props.icon}
        isAccordionEnabled={false}
        style={{...styles}} 
        customItems={
            <>
                <Text>{t(props.textTag)}</Text>
            </>
        }/>);
}


const CO2View: React.FC = () => {
    const { t } = useTranslation();
    
    return (<ScrollView style={{flex: 1}}>
        <InformationCard titleTag="co2Emission" 
            icon={<MaterialCommunityIcons name="smoke" size={24} color="black" />} 
            textTag= "co2EmissionDescription" />
        <HistoricBarChart
            title={`${t('emissions')}`}
            icon={<MaterialCommunityIcons name="smoke" size={24} color="black" />}
            type="emissions"
            columnLabels={Historic.emissions}
        />
        <HistoricBarChart
            title={`${t('qualifications')}`}
            icon={<FontAwesome6 name="certificate" size={24} color="black" />}
            type="qualification"
            columnLabels={Historic.qualifications}
            dataType="qualification"
        />
        <HistoricBarChart
            title={`${t('energyPerformance')}`}
            icon={<SimpleLineIcons name="energy" size={24} color="black" />}
            type="energyPerformance"
            columnLabels={Historic.energyPerformance}
        />
    </ScrollView>);
}


const EnergyTransitionView: React.FC = () => {
    const { t } = useTranslation();

    return (<ScrollView style={{flex: 1}}>
        <InformationCard titleTag="energyTransition" 
            icon={<FontAwesome6 name="house-chimney" size={24} color="black" />} 
            textTag= "energyTransitionDescription" />
        <HistoricBarChart
            title={`${t('percentRenewable')}`}
            icon={<FontAwesome6 name="recycle" size={24} color="black" />}
            type="percentRenewable"
            columnLabels={Historic.percentRenewable}
            dataType="percentatge"
        />
        <HistoricBarChart
            title={`${t('energySaving')}`}
            icon={<MaterialIcons name="energy-savings-leaf" size={24} color="black" />}
            type="energySaving"
            columnLabels={Historic.energySaving}
        />
    </ScrollView>);
}




const styles = StyleSheet.create({
    view: {
        margin:20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    titleContainer: {
        margin: 0,
    },
    container: {
    },
    icon: {
        margin: 0,
    },
    tabBar: {
        backgroundColor: '#568265', 
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    }

});