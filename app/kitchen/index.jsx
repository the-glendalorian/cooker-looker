import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from '@react-native-firebase/firestore';
import { db } from "../../FirebaseConfig";
import { useLocalSearchParams } from "expo-router";

const KitchenScreen = () => {
    const { name, location, image } = useLocalSearchParams();
    const [locations, setLocations] = useState([]);
    const locationsCollection = collection(db, 'locations');

    useEffect(() => {
        fetchLocations();
    })

    const fetchLocations = async () => {
        const q = query(locationsCollection, where("name", "==", location));
        const data = await getDocs(q);
        setLocations(data.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        }));
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.foodBox}>
                <Image 
                    style={styles.image}
                    source={{uri: image}}
                />
                <View style={styles.foodTextContainer}>
                    <Text style={styles.foodResults}>Results for</Text>
                    <Text style={styles.foodName}>{name}</Text>
                </View>
            </View>
            <Text style={styles.foodLocation}>Location: {location}</Text>
            <FlatList
                data = {locations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.locationItem}>
                        <Image 
                            source={{uri: item.image}}
                            style={styles.locationImage}
                        />
                        <Text style={styles.foodLocation}>Other items in {item.name}</Text>
                        <View style={styles.locationTextContainer}>
                            <FlatList 
                                data = {item.items.filter((thing) => thing.name.toLowerCase() != name)}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View style={styles.foodItem}>
                                        <Image source={{uri: item.image}} style={styles.foodImage}/>
                                        <Text style={styles.foodItemText}>{item.name}</Text>
                                    </View>
                                )}
                                horizontal={true}
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
        backgroundColor: "#fff",
    },

    foodBox: {
      flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "#fbe3ab",
    padding: 15,
    borderRadius: 15,
    marginVertical: 5,
    elevation: 3  
  },

  foodTextContainer: {
      flex: 2,
      flexDirection: "column",
      backgroundColor: "#fbe3ab",
      marginLeft: 20,
      justifyContent: "center",
      paddingLeft: 10
  },

  foodName: {
      fontSize: 25,
      fontFamily: "Poppins-Bold",
  },

  foodResults: {
      fontSize: 25,
      fontFamily: "Poppins-Bold",
  },

  foodLocation: {
      fontSize: 20,
      marginTop: 20,
      marginBottom: 10,
      fontFamily: "Poppins-Bold"
  },

  image: {
      height: 80,
      width: "25%",
      marginLeft: 5,
      backgroundColor: "white",
      borderRadius: 10,
      padding: 20,
      elevation: 3,
      marginVertical: 5
  },

    locationItem: {
        flexDirection: "column",
        borderRadius: 15,
        justifyContent: "flex-start"
    },

    locationTextContainer: {
        flexDirection: "column",
        backgroundColor: "#383838",
        borderRadius: 15,
        padding: 15,
        elevation: 3,
        height: 125
    },

    locationImage: {
        height: 270,
        width: "100%",
        borderRadius: 15,
        elevation: 3
    },

    foodItem: {
        flexDirection: "column",
        justifyContent: "flex-start",
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
        elevation: 5
    },

    foodImage: {
        height: 50,
        width: 50
    },

    foodItemText: {
        fontSize: 15,
        marginTop: 10,
        textAlign: "center",
        fontFamily: "Poppins-Regular"
    }
});

export default KitchenScreen;