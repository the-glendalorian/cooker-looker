import { View, Text, StyleSheet, FlatList, Image, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { collection, getDocs, query, Timestamp } from '@react-native-firebase/firestore';
import { db } from "../../FirebaseConfig";
import { useLocalSearchParams } from "expo-router";

const KitchenScreen = () => {
    const getTimestamp = (time) => {
        return new Timestamp(time.seconds, time.nanoseconds);
    }

    const locationsCollection = collection(db, 'locations');
    const { name, location, image, daysText, daysColor, firstSeen, lastSeen, shelfLife, locationImage, id, allItems, days, sus } = useLocalSearchParams();
    const [otherItems, setOtherItems] = useState(JSON.parse(allItems));
    const [locations, setLocations] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(location);
    const [currentLocationImage, setCurrentLocationImage] = useState(locationImage);
    const [currentItem, setCurrentItem] = useState({
        name: name,
        image: image,
        daysText: daysText,
        daysColor: daysColor,
        firstSeen: getTimestamp(JSON.parse(firstSeen)), 
        lastSeen: getTimestamp(JSON.parse(lastSeen)), 
        shelfLife: shelfLife,
        id: id,
        days: days,
        sus: parseInt(sus)
    });

    useEffect(() => {
        fetchLocations();
    });

    const getDaysLeft = (item) => {
        const ms1 = getTimestamp(item.firstSeen).toDate().getTime();
        const ms2 = getTimestamp(item.lastSeen).toDate().getTime();
        const timeDiff = ms2 - ms1;
        return Math.round(item.shelfLife - timeDiff / (1000 * 60 * 60 * 24));
    }

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

    const getDays = (item) => {
        return getTimestamp(item.firstSeen).toDate().toDateString().slice(4) + " - " + getTimestamp(item.lastSeen).toDate().toDateString().slice(4);
    }

    const getSusEmoji = (item) => {
        if (item.sus == 2) return String.fromCodePoint("0x1F630");
        else if (item.sus == 1) return String.fromCodePoint("0x1F914");
        return String.fromCodePoint("0x1F600");
    }

    const getSusColor = (item) => {
        if (item.sus == 2) return "#ffb3a3";
        else if (item.sus == 1) return "#ffd3a3";
        return "#fbe3ab";
    }

    const updateLocation = (targetLocation) => {
        const foundLocation = locations.find(location => location.name == targetLocation);
        const itemList = foundLocation.items.sort((a, b) => {
            if (a.sus != b.sus) {
                return b.sus - a.sus;
            }
            return a.daysLeft - b.daysLeft;
        });
        setOtherItems(itemList);

        if (currentLocation != targetLocation) {
            setCurrentLocation(targetLocation);
            setCurrentLocationImage(foundLocation.image);

            if (itemList.length != 0) {
                const item = itemList[0];
                const newItem = {
                    name: item.name,
                    image: item.image,
                    firstSeen: item.firstSeen, 
                    lastSeen: item.lastSeen, 
                    daysText: getDaysText(item),
                    daysColor: getDaysColor(item),
                    shelfLife: item.shelfLife,
                    id: item.id,
                    days: getDays(item),
                    sus: item.sus
                };
                setCurrentItem(newItem);
            }
            
            else {
                setCurrentItem({
                    name: "",
                    image: "https://res.cloudinary.com/daqnsb9zx/image/upload/v1749917245/question_kcusxh.jpg",
                    daysText: "",
                    daysColor: "#fbe3ab",
                    firstSeen: "", 
                    lastSeen: "", 
                    shelfLife: 0,
                    id: -1,
                    days: "",
                    sus: 0
                });
            }
        }
    }

    const fetchLocations = async () => {
        const q = query(locationsCollection);
        const data = await getDocs(q);
        const locationsList = data.docs.map((doc) => {
            return {...doc.data(), id: doc.id, number: doc.data().name.split(" ").pop()}
        });
        setLocations(locationsList.sort((a, b) => a.number - b.number));
    };
    
    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                backgroundColor: getSusColor(currentItem),
                padding: 10,
                borderRadius: 15,
                marginVertical: 5,
                elevation: 3 
            }}>
                <Image 
                    style={styles.image}
                    source={{uri: currentItem.image}}
                />
                <View style={{
                    flex: 2,
                    flexDirection: "column",
                    backgroundColor: "#fbe3ab",
                    marginLeft: 20,
                    justifyContent: "center",
                    backgroundColor: getSusColor(currentItem)
                }}>
                    <Text style={styles.foodResults}>{currentItem.name != "" ? "Results for" : "No available items"} {currentItem.name}</Text>
                    <Text style={styles.foodText}>{currentItem.days}</Text>
                    <View style={styles.foodItemContainer}>
                        <Text style={styles.foodText}>{currentItem.shelfLife == 0 ? "" : "Shelf Life: " + currentItem.shelfLife.toString() + " day" + ((currentItem.shelfLife != 1) ? "s" : "")}</Text>
                        <Text style={{
                            fontSize: 14,
                            color: "white",
                            fontFamily: "Poppins-Bold",
                            backgroundColor: currentItem.daysColor,
                            borderRadius: 15,
                            paddingTop: 3,
                            paddingHorizontal: 10,
                            marginLeft: 10
                        }}>
                            {currentItem.daysText}
                        </Text>
                    </View>
                </View>
            </View>

            <Text style={styles.foodLocation}>Location: {currentLocation} {getSusEmoji(currentItem)}</Text>
            <Image 
                source={{uri: currentLocationImage}}
                style={styles.locationImage}
            />
            <View style={styles.locationBox}>
                <FlatList 
                    data = {locations}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => {
                            if (item.name != currentLocation) {
                                updateLocation(item.name);
                            }
                        }} style={{
                            backgroundColor: item.name == currentLocation ? "white" : "#b8b8b8",
                            paddingHorizontal: 10,
                            borderRadius: 10,
                            marginRight: 10,
                            height: 40,
                            textAlign: "center"
                        }}>
                            <Text style={styles.foodItemText}>{item.number}</Text>
                        </Pressable>
                    )}
                    horizontal={true}
                />
            </View>
            <Text style={styles.foodLocation}>All items in {currentLocation}</Text>
            <View style={styles.locationTextContainer}>
                <FlatList 
                    data = {otherItems}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => {
                            const newItem = {
                                name: item.name,
                                image: item.image,
                                firstSeen: getTimestamp(item.firstSeen), 
                                lastSeen: getTimestamp(item.lastSeen), 
                                daysText: getDaysText(item),
                                daysColor: getDaysColor(item),
                                shelfLife: item.shelfLife,
                                id: item.id,
                                days: getDays(item),
                                sus: item.sus
                            };
                            setCurrentItem(newItem);
                        }} style={{
                            flexDirection: "column",
                            justifyContent: "center",
                            backgroundColor: currentItem.id == item.id ? "white" : "#b8b8b8",
                            padding: 10,
                            borderRadius: 10,
                            marginRight: 10,
                            elevation: 3
                        }}>
                            <View style={styles.foodItemBox}>
                                <Image source={{uri: item.image}} style={styles.foodImage}/>
                                <Text style={styles.foodItemText}>{item.name}</Text>
                            </View>
                        </Pressable>
                    )}
                    horizontal={true}
                />
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

    foodName: {
        fontSize: 20,
        fontFamily: "Poppins-Bold",
    },

    foodResults: {
        fontSize: 19,
        fontFamily: "Poppins-Bold",
    },

    foodText: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: "#383838"
    },

    foodItemContainer: {
        flexDirection: "row"
    },

    foodLocation: {
        fontSize: 18,
        marginTop: 20,
        marginBottom: 5,
        fontFamily: "Poppins-Bold"
    },

    image: {
        height: 70,
        width: 70,
        marginLeft: 5,
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 3,
        marginVertical: 15
    },

    locationItem: {
        flexDirection: "column",
        borderRadius: 15,
        justifyContent: "flex-start"
    },

    locationTextContainer: {
        backgroundColor: "#282828",
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

    locationBox: {
        backgroundColor: "#5c5c5c",
        padding: 10,
        borderRadius: 15,
        marginVertical: 10,
        elevation: 1  
    },

    foodItem: {
        flexDirection: "column",
        justifyContent: "flex-start",
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
        elevation: 3
    },

    foodItemBox: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },

    foodImage: {
        height: 50,
        width: 50,
        textAlign: "center"
    },

    foodItemText: {
        fontSize: 15,
        marginTop: 10,
        textAlign: "center",
        fontFamily: "Poppins-Regular"
    },
});

export default KitchenScreen;