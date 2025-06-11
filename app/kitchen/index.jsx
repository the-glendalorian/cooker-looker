import { View, Text, StyleSheet, FlatList, Image, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from '@react-native-firebase/firestore';
import { db } from "../../FirebaseConfig";
import { useLocalSearchParams } from "expo-router";

const KitchenScreen = () => {
    const { name, location, image, daysText, daysColor, firstSeen, lastSeen, shelfLife, locationImage } = useLocalSearchParams();
    const [otherItems, setOtherItems] = useState([]);
    const [itemName, setItemName] = useState(name);
    const [itemImage, setItemImage] = useState(image);
    const [itemLocation, setItemLocation] = useState(location);
    const [itemDaysText, setItemDaysText] = useState(daysText);
    const [itemDaysColor, setItemDaysColor] = useState(daysColor);
    const [itemFirstSeen, setItemFirstSeen] = useState(firstSeen);
    const [itemLastSeen, setItemLastSeen] = useState(lastSeen);
    const [itemShelfLife, setItemShelfLife] = useState(shelfLife);
    const itemsCollection = collection(db, 'items');

    useEffect(() => {
        fetchItems();
    })

    const fetchItems = async () => {
        const q = query(itemsCollection, where("location", "==", itemLocation));
        const data = await getDocs(q);
        const itemList = data.docs.map((doc) => {
            return {...doc.data(), id: doc.id, daysLeft: getDaysLeft(doc.data()), daysText: getDaysText(doc.data()), daysColor: getDaysColor(doc.data())}
        });
        setOtherItems(itemList.sort((a, b) => a.daysLeft - b.daysLeft));
    }

    const getDaysLeft = (item) => {
        const ms1 = item.firstSeen.toDate().getTime();
        const ms2 = item.lastSeen.toDate().getTime();
        const timeDiff = ms2 - ms1;
        return Math.round(item.shelfLife - timeDiff / (1000 * 60 * 60 * 24));
    };

    const getDaysText = (item) => {
        const daysLeft = getDaysLeft(item);
        if (daysLeft <= 0) return "Expired";
        return daysLeft.toString() + "d left";
    }

    const getDaysColor = (item) => {
        const daysLeft = getDaysLeft(item);
        if (daysLeft <= 0) return "#fc0303";
        else if (daysLeft < 4) return "#ff7803";
        return "#3dad00";
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.foodBox}>
                <Image 
                    style={styles.image}
                    source={{uri: itemImage}}
                />
                <View style={styles.foodTextContainer}>
                    <Text style={styles.foodResults}>Results for</Text>
                    <Text style={styles.foodName}>{itemName}</Text>
                </View>
            </View>

            <Text style={{
                fontSize: 17,
                color: itemDaysColor,
                fontFamily: "Poppins-Bold",
                marginTop: 20,
            }}>
                {itemFirstSeen} - {itemLastSeen} ({itemDaysText})
            </Text>
            <Text style={{
                fontSize: 17,
                color: itemDaysColor,
                fontFamily: "Poppins-Bold",
            }}>
                Shelf Life: {itemShelfLife.toString() + " day" + ((itemShelfLife != 1) ? "s" : "")}
            </Text>

            <Text style={styles.foodLocation}>Location: {itemLocation}</Text>
            <View style={styles.locationItem}>
                <Image 
                    source={{uri: locationImage}}
                    style={styles.locationImage}
                />
                <Text style={styles.foodLocation}>All items in {itemLocation}</Text>
                <View style={styles.locationTextContainer}>
                    <FlatList 
                        data = {otherItems}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <Pressable onPress={() => {
                                setItemName(item.name);
                                setItemImage(item.image);
                                setItemDaysText(item.daysText);
                                setItemDaysColor(item.daysColor);
                                setItemFirstSeen(item.firstSeen.toDate().toDateString().slice(4));
                                setItemLastSeen(item.lastSeen.toDate().toDateString().slice(4));
                                setItemShelfLife(item.shelfLife);
                            }} style={styles.foodItem}>
                                <View>
                                    <Image source={{uri: item.image}} style={styles.foodImage}/>
                                    <Text style={styles.foodItemText}>{item.name}</Text>
                                </View>
                            </Pressable>
                        )}
                        horizontal={true}
                    />
                </View>
            </View>
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
        elevation: 5
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
    },

    dayText: {
        fontFamily: "Poppins-Bold",
        fontSize: 16
    }
});

export default KitchenScreen;