//MAIN PAGE OF THE APP, SHOULD BE DESTRUCTURED a little atleast
//TODO-> REFACTOR, CONVERT MAP, SEARCHBAR TO COMPONENT, REQUEST PERMISSIONS TOO
import {View} from "react-native";
import {Stack} from "expo-router";
import MapView, {Region} from "react-native-maps";
import {locations} from "@/app/Constants/locations";
import "@/i18n";
import {useEffect, useRef, useState} from "react";
import {
    fetchCertificateByID,
    fetchCoordinatesWithCertificateInsideRegionAndFilter
} from "@/app/Services/CertificatesService/map";
import {CertificateInfo, FilterValue, ProcessedAddress} from "@/app/Constants/types";
import BottomSheet from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CustomBottomSheet from "@/app/Components/CustomBottomSheet";
import SearchBar from "@/app/Components/SearchBar";
import CustomMap from "@/app/Components/CustomMap";
import {fetchLocationByName} from "@/app/Services/ExternalService/location";
import FilterModal from "@/app/Components/FilterModal";
import {useCertificates} from "@/app/CustomHooks/certificatesHook";
import {useLocationPermission} from "@/app/CustomHooks/locationPermissionHook";
import {showToastError} from "@/app/Services/ToastService/toast-service";
import { router } from "expo-router";
import {
    requestNotificationPermissions,
    scheduleNotifications
} from "@/app/Services/NotificationsService/notificationsHandler";
import {useAuth} from "@/context/AuthContext";

export default function Index() {
    const mapRef = useRef<MapView>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const [currentRegion, setRegion] = useState<Region>(locations.BCN); //region to load the certificates
    const [currentCertificate, setCurrentCertificate] = useState<CertificateInfo>() //certificate selected
    const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null); //marker selected for displaying
    const [displayResults, setDisplayResults] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState("markers");
    const [currentFilter, setCurrentFilter] = useState<FilterValue>({}); //current filter selected, initialized to NONE
    const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);
    const [certificates, setCertificates] = useState<ProcessedAddress[]>([]);
    // states for comparing to certificates
    const [compareMode, setCompareMode] = useState<boolean>(false);
    const [firstCertificate, setFirstCertificate] = useState<CertificateInfo | undefined>(undefined);

    const { authState } = useAuth();

    useEffect(() => {
        if (authState?.authenticated) {
            requestNotificationPermissions();
            scheduleNotifications();
        }
    }, [authState?.authenticated]);

    useEffect(() => {
        if (authState?.authenticated) {
            loadCertificates();
        }
    }, [authState?.authenticated, JSON.stringify(currentFilter), currentRegion]);

    //ask for user location permissions on first render
    const hasLocationPermission = useLocationPermission();

    const onRegionChange = (region: Region) => {
        setRegion(region);
    }

    //loads certificates from catalonia with current filter
    const loadCertificates = async () => {
        const CataloniaCertificates  = await fetchCoordinatesWithCertificateInsideRegionAndFilter(40.5227, 42.8616, 0.1604, 3.3321, currentFilter)
        setCertificates(CataloniaCertificates);
    }

    const markerPressed = async (ProcessedAddress: ProcessedAddress) => {
        try {
            if (ProcessedAddress.certificates && ProcessedAddress.certificates.length > 0) {
                if (!ProcessedAddress.hasMultipleCertificates) { //TODO-> Implement logic for multiple certificates?
                    const certificateId: number = ProcessedAddress.certificates[0];
                    const certificate: CertificateInfo | undefined = await fetchCertificateByID(certificateId);
                    if (certificate) setSelectedMarkerId(certificate.id);
                    setCurrentCertificate(certificate);
                    if (compareMode && firstCertificate && certificate) {
                        if (firstCertificate.id === certificate.id) return;
                        setCompareMode(false);
                        setFirstCertificate(undefined);
                        router.push({
                            pathname: "/Screens/home/comparison",
                            params: {
                                cert1: JSON.stringify(firstCertificate),
                                cert2: JSON.stringify(certificate)
                            }
                        });
                        return;
                    }

                    const zoomedRegion: Region = {
                        latitude: ProcessedAddress.latitude,
                        longitude: ProcessedAddress.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    };
                    mapRef.current?.animateToRegion(zoomedRegion, 500);
                    setRegion(zoomedRegion);
                }
            }
        } catch (error) {
            showToastError("No information for this marker");
        }
    };

    const moveToRegion = (latitude: number, longitude: number) => {
        //region of the current certificate while zoomed
        const zoomedRegion: Region = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };

        //move camera to new region
        mapRef.current?.animateToRegion(zoomedRegion, 500);
        setRegion(zoomedRegion);
    }

    const handleMapPress = () => {
        if (selectedMarkerId) { //logic for going back to default text if no marker pressed
            setSelectedMarkerId(null);
            setCurrentCertificate(undefined);
        }

        if (compareMode) {
            setCompareMode(false);
            setSelectedMarkerId(null);
            setFirstCertificate(undefined);
            setCurrentCertificate(undefined);
        }

        setDisplayResults(false);
    }

    const onLocationResultClick = (selectedLocation:any) => {
        moveToRegion(selectedLocation.coordinates.latitude, selectedLocation.coordinates.longitude);
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <Stack.Screen options={{ title: "home" }} />
                {isFilterModalVisible &&
                    <FilterModal
                        closeModal = {() => setIsFilterModalVisible(false)}
                        setCurrentFilter={setCurrentFilter}
                        setViewMode={setViewMode}
                        viewMode={viewMode}
                        currentFilter={currentFilter}
                    />
                }
                <CustomMap
                    ref = {mapRef}
                    currentRegion={currentRegion}
                    certificates={certificates}
                    onRegionChange={onRegionChange}
                    onMarkerPress={markerPressed}
                    onMapPress={handleMapPress}
                    viewMode={viewMode}
                />
                <SearchBar
                    onSearch = {async (query) => fetchLocationByName(query, 3)}
                    displayAttribute={"nom"}
                    onResultClick={onLocationResultClick}
                    displayResults = {displayResults}
                    changeDisplayResults = {setDisplayResults}
                    setViewMode={setViewMode}
                    openFilterModal = {setIsFilterModalVisible}
                />
                {viewMode === 'markers' &&
                    <CustomBottomSheet
                        bottomSheetRef={bottomSheetRef}
                        address={currentCertificate?.address}
                        emissionsAndEnergy={currentCertificate?.emissionsAndEnergy}
                        sustainabilityFeatures={currentCertificate?.sustainabilityFeatures}
                        buildingInfo={currentCertificate?.buildingInfo}
                        heatingAndCooling={currentCertificate?.heatingAndCooling}
                        hasMarkerSelected = {currentCertificate?.id !== undefined}
                        setCompareMode={setCompareMode}
                        setFirstCertificate={setFirstCertificate}
                        currentCertificate = {currentCertificate}
                        compareMode={compareMode}
                    />
                }
            </View>
    </GestureHandlerRootView>
);
}