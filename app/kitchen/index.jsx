import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { useEffect, useState } from "react";
import { collection, getDocs, query } from '@react-native-firebase/firestore';
import { db } from "../../FirebaseConfig";

const KitchenScreen = () => {
    const [locations, setLocations] = useState([]);
    const locationsCollection = collection(db, 'locations');

    useEffect(() => {
        fetchLocations();
    })

    const fetchLocations = async () => {
        const q = query(locationsCollection);
        const data = await getDocs(q);
        setLocations(data.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        }));
    }
    
    return (
        <View style={styles.container}>
            <FlatList
                data = {locations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.locationItem}>
                        <Image 
                            source={{uri: item.image}}
                            style={styles.image}
                        />
                        <View style={styles.locationTextContainer}>
                            <Text style={styles.locationText}>{item.name}</Text>
                            <FlatList 
                                data = {item.items}
                                keyExtractor={(item) => item.id}
                                numColumns={4}
                                renderItem={({ item }) => (
                                    <View style={styles.foodItem}>
                                        <Image source={{uri: item.image}} style={styles.foodImage}/>
                                    </View>
                                )}
                            />
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

    locationItem: {
        flexDirection: "row",
        justifyContent: "flex-start",
        backgroundColor: "#6b0000",
        padding: 15,
        borderRadius: 10,
        marginVertical: 5
    },

    locationTextContainer: {
        flexDirection: "column",
        backgroundColor: "#6b0000",
        marginLeft: 20
    },

    locationText: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#fff"
    },

    foodItem: {
        flexDirection: "row",
        justifyContent: "flex-start",
        backgroundColor: "#fbe3ab",
        padding: 5,
        borderRadius: 10,
        marginRight: 5,
        marginTop: 10
    },

    image: {
        height: 70,
        width: 70,
        
    },

    foodImage: {
        height: 30,
        width: 30
    }
});

export default KitchenScreen;