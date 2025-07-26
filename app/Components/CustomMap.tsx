import React, {forwardRef, useMemo} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, {Heatmap, Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps';
import MapViewClustering from 'react-native-map-clustering';
import { locations } from '@/app/Constants/locations';
import { ProcessedAddress } from '@/app/Constants/types';
import smallHouseIcon from '@/assets/images/greenHouse.png';
import bigHouseIcon from '@/assets/images/house-64.png';

interface CustomMapProps {
    currentRegion: Region;
    certificates: ProcessedAddress[];
    onRegionChange: (region: Region) => void;
    onMarkerPress: (certificate: ProcessedAddress) => void;
    onMapPress: () => void;
    viewMode: string;
}

// Define interface for cluster marker props
interface ClusterMarkerProps {
    count: number;
    coordinate?: {
        longitude: number;
        latitude: number;
    };
}

// Custom cluster marker component
const CustomClusterMarker: React.FC<ClusterMarkerProps> = ({ count }) => {
    return (
        <View style={styles.clusterContainer}>
            <Text style={styles.clusterText}>{count}</Text>
        </View>
    );
};

//using forwardRef since react 18 doesn't allow refs as props (change to 19?)
const CustomMap = forwardRef<MapView, CustomMapProps>(
    ({ currentRegion, certificates, onRegionChange, onMarkerPress, onMapPress, viewMode }, ref) => {
        //function that returns the map ref using .current and checking that its ok
        const getMapRef = () => {
            if (ref && typeof ref !== 'function' && ref.current) {
                return ref.current;
            }
            return null;
        };

        const whenMapLoaded = () => {
            getMapRef()?.animateToRegion(locations.BCN,500);
        };

        const heatMapPoints = certificates.map((cert) => ({
            latitude: cert.latitude,
            longitude: cert.longitude,
            weight: cert.certificates?.length || 1,
        }));

        //avoid unnecessary re renders
        const mapContent = useMemo(() => {
            if (viewMode === 'markers') {
                return (
                    <MapViewClustering
                        ref={ref}
                        style={styles.map}
                        initialRegion={currentRegion}
                        provider={PROVIDER_GOOGLE}
                        showsUserLocation
                        showsMyLocationButton
                        onMapLoaded={whenMapLoaded}
                        onRegionChangeComplete={onRegionChange}
                        onPress={onMapPress}
                        paddingAdjustmentBehavior="automatic"
                        mapPadding={{
                            top: 60,      //Size of searchbar
                            bottom: 200,  //Size ob bottomsheet(aprox)
                            left: 0,
                            right: 0
                        }}
                        clusterColor="#00796B"
                        clusterTextColor="#ffffff"
                        radius={50}
                        maxZoom={15}
                        minZoom={1}
                        extent={512}
                        nodeSize={64}
                        renderCluster={(cluster) => {
                            const { id, geometry, properties } = cluster;
                            const count = properties.point_count;
                            const coordinate = {
                                longitude: geometry.coordinates[0],
                                latitude: geometry.coordinates[1]
                            };

                            return (
                                <Marker
                                    key={`cluster-${id}`}
                                    coordinate={coordinate}
                                >
                                    <CustomClusterMarker count={count} />
                                </Marker>
                            );
                        }}
                    >
                        {certificates.map((processedAddress) => (
                            <Marker
                                key={processedAddress.longitude.toString() + processedAddress.addressName}
                                coordinate={{
                                    longitude: processedAddress.longitude,
                                    latitude: processedAddress.latitude
                                }}
                                title={processedAddress.addressName}
                                onPress={() => onMarkerPress(processedAddress)}
                            />
                        ))}
                    </MapViewClustering>
                );
            } else {
                // Heatmap view
                return (
                    <MapView
                        ref={ref}
                        style={styles.map}
                        initialRegion={currentRegion}
                        provider={PROVIDER_GOOGLE}
                        showsUserLocation
                        showsMyLocationButton
                        onMapLoaded={whenMapLoaded}
                        onRegionChangeComplete={onRegionChange}
                        onPress={onMapPress}
                        paddingAdjustmentBehavior="automatic"
                        mapPadding={{
                            top: 60,
                            bottom: 200,
                            left: 0,
                            right: 0
                        }}
                    >
                        {certificates.length > 0 && (
                            <Heatmap
                                points={heatMapPoints}
                                opacity={0.7}
                                radius={40}
                                gradient={{
                                    colors: ["#00FF00", "#FFFF00", "#FF0000"],
                                    startPoints: [0.2, 0.5, 0.8],
                                    colorMapSize: 256,
                                }}
                            />
                        )}
                    </MapView>
                );
            }
        }, [viewMode, certificates, currentRegion, onRegionChange, onMapPress, onMarkerPress, ref]);

        return mapContent;
    }
);

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
    clusterContainer: {
        borderRadius: 20,
        backgroundColor: 'rgba(0, 121, 107, 0.8)',
        borderWidth: 8,
        borderColor: '#009688',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clusterText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default CustomMap;