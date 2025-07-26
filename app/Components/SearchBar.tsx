import React, {useState} from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    FlatList,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity
} from 'react-native';
import AntDesign from "@expo/vector-icons/FontAwesome5";
import {colors} from "@/app/Constants/colors";

interface SearchBarProps {
    placeholder?: string;
    onSearch: (searchedText: string, desiredSize: number) => Promise<any[]>;
    leftIconName?: string;
    rightIconName?: string;
    onResultClick: (item: any) => void;
    displayAttribute: string; //since results are displayed by an attribute of the response, we need to know what attribute to display
    displayResults: boolean;
    changeDisplayResults: (newState: boolean) => void;
    setViewMode: (newViewMode: string) => void;
    openFilterModal: (viewModal: boolean) => void;
}


const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search', displayAttribute, displayResults, changeDisplayResults, setViewMode, openFilterModal, onSearch, onResultClick, leftIconName = 'search', rightIconName = 'filter' }) => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);  //TODO-> use it to display load icon while searching
    const [results, setResults] = useState<any[]>([]);
    //TODO-> show results state, that is controlled when clicking a result (it hides the resultlist), outside the search bar or while searching
    //this should be a call to the backend
    async function handleSearch() {
        if (!text) return;

        setIsLoading(true);

        try  {
            const locationsResponses = await onSearch(text, 3);
            changeDisplayResults(true)
            setResults(locationsResponses);
        }
        catch (error) {
            changeDisplayResults(false);
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleResultClick = (item: any) => {
        changeDisplayResults(false);
        onResultClick(item);
    }

    const handleOutsideClick = () => {
        changeDisplayResults(false);
        Keyboard.dismiss();
    }

    return (
        <TouchableWithoutFeedback onPress={handleOutsideClick}>
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    {leftIconName &&
                        <TouchableOpacity onPress={handleSearch}>
                            <AntDesign name={leftIconName} size={24} style={styles.icon} />
                        </TouchableOpacity>
                    }
                    <TextInput
                        style={styles.searchInput}
                        placeholder={placeholder}
                        onChangeText={(text) => setText(text)}
                        placeholderTextColor={'#666'}
                        onSubmitEditing={handleSearch}
                        onFocus={() => changeDisplayResults(true)} //Show list on click
                    />
                    <TouchableOpacity
                        onPress={() => openFilterModal(true)}>
                        {rightIconName && <AntDesign name={rightIconName} size={24} style={styles.icon} />}
                    </TouchableOpacity>
                </View>
                {results.length > 0 && !isLoading && displayResults && (
                    <View style={styles.resultsContainer}>
                        <FlatList
                            data={results}
                            keyExtractor={(result, index) => result.coordinates.toString() + index.toString()}
                            renderItem={({ item }) => (
                                <Text
                                    style={styles.resultItem}
                                    onPress={() => handleResultClick(item)}
                                >
                                    {item[displayAttribute]}
                                </Text>
                            )}
                        />
                    </View>
                )}
                {isLoading && (
                    <View style={styles.resultsContainer}>
                        <Text style={styles.resultItem}>
                            Searching Results...
                        </Text>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
        zIndex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.subtleWhite,
        width: '90%',
        borderRadius: 10,
        margin: 10,
        paddingHorizontal: 10,
        height: 45,
        top: 11,
    },
    searchInput: {
        flex: 1,
        fontSize: 18,
        marginLeft: 8,
        color: '#000',
    },
    icon: {
        padding: 5,
        color: 'black',
    },
    resultsContainer: {
        width: '90%',
        backgroundColor: colors.subtleWhite,
        borderRadius: 10,
        marginTop: 2,
        maxHeight: 200,
        overflow: 'hidden',
    },
    resultItem: {
        padding: 15,
        borderBottomWidth: 1.2,
        borderBottomColor: '#eee',
        fontSize: 16,
    },
});

export default SearchBar;