import { View, Text, StyleSheet, FlatList, Image, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from '@react-native-firebase/firestore';
import { db } from "../../FirebaseConfig";

const SearchScreen = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const itemsCollection = collection(db, 'items');

    useEffect(() => {
        fetchItems();
    }, [searchValue]);

    const fetchItems = async () => {
        const q = query(itemsCollection, where("name", ">=", searchValue.toLowerCase()), where("name", "<=", searchValue.toLowerCase() + "\uf8ff"));
        const data = await getDocs(q);
        setFoodItems(data.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        }));
    };

    return (
            <View style={styles.container}>
                <TextInput 
                    placeholder="Search..."
                    value={searchValue}
                    onChangeText={text => {
                        fetchItems();
                        setSearchValue(text);
                    }}
                    style={styles.searchBar}
                    placeholderTextColor={"white"}
                />
                <FlatList
                    data = {foodItems}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.foodItem}>
                            <Image 
                                style={styles.image}
                                source={{uri: item.image}}
                            />
                            <View style={styles.foodTextContainer}>
                                <Text style={styles.foodName}>{item.name}</Text>
                                <Text style={styles.foodLocation}>{item.location}</Text>
                            </View>
                        </View>
                    )}
                />
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff"
    },

    foodItem: {
        flexDirection: "row",
        justifyContent: "flex-start",
        backgroundColor: "#fbe3ab",
        padding: 15,
        borderRadius: 10,
        marginVertical: 5    
    },

    foodTextContainer: {
        flexDirection: "column",
        backgroundColor: "#fbe3ab",
        marginLeft: 20
    },

    foodName: {
        fontSize: 17,
        fontWeight: "bold"
    },

    foodLocation: {
        fontSize: 17,
        marginTop: 5
    },

    image: {
        height: 50,
        width: 50
    },

    searchBar: {
        backgroundColor: "#6b0000",
        borderRadius: 10,
        color: "white",
        padding: 10,
        marginBottom: 10,
        fontSize: 18
    }
});

export default SearchScreen;