import React, { useRef, useState } from 'react';
import { ScrollView, View, StyleSheet, Dimensions, ViewStyle, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface PageViewProps {
    children: React.ReactNode | React.ReactNode[];
    style: {
        container?: ViewStyle;
        pageContainer?: ViewStyle;
    }
};

export const PageView: React.FC<PageViewProps> = (props) => {
    const scrollRef = useRef<ScrollView>(null);
    const [page, setPage] = useState(0);
    const { width } = Dimensions.get('window');

    const maxPages = Array.isArray(props.children) ? props.children.length : 1;

    const handleOnScroll = function (event: NativeSyntheticEvent<NativeScrollEvent>) {
        const offsetX = event.nativeEvent.contentOffset.x;
        const currentPage = Math.round(offsetX / width);
        if (page !== currentPage) setPage(currentPage);
    }

    return (
        <>
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                scrollEventThrottle={16}
                style={props.style.container}
                onScroll={handleOnScroll}
            >
                {Array.isArray(props.children) ? props.children.map((child, index) => (
                    <View key={index} style={[props.style.pageContainer, styles.page]}>
                        {child}
                    </View>
                )) :
                    <View style={styles.page}>
                        {props.children}
                    </View>}
            </ScrollView>
            {/* Overlay arrows */}
            {page > 0 && (
                <View style={styles.leftArrowContainer}>
                    <AntDesign name="left" size={32} color="#222" style={styles.arrow} />
                </View>
            )}
            {page < maxPages - 1 && (
                <View style={styles.rightArrowContainer}>
                    <AntDesign name="right" size={32} color="#222" style={styles.arrow} />
                </View>
            )}
        </>
    );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    page: {
        width,
        padding: 20,
        paddingHorizontal: 40,
        flex: 1,
    },
    leftArrowContainer: {
        position: 'absolute',
        left: 8,
        top: '50%',
        transform: [{ translateY: -16 }],
        zIndex: 10,
        pointerEvents: 'none',
    },
    rightArrowContainer: {
        position: 'absolute',
        right: 8,
        top: '50%',
        transform: [{ translateY: -16 }],
        zIndex: 10,
        pointerEvents: 'none',
    },
    arrow: {
        opacity: 0.7,
    },
});

export default PageView;