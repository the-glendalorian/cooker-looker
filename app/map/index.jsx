import { View, Image, StyleSheet, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { collection, getDocs, query } from '@react-native-firebase/firestore';
import { db } from "../../FirebaseConfig";

const MapScreen = () => {
    const kitchensCollection = collection(db, 'kitchens');
    const [kitchens, setKitchens] = useState([]);

    useEffect(() => {
        fetchKitchens();
    })

    const fetchKitchens = async () => {
        const q = query(kitchensCollection);
        const data = await getDocs(q);
        setKitchens(data.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        }));
    }
    
    return (
        <View style={styles.container}>
            <FlatList
                data = {kitchens}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Image 
                        source={{uri: item.image}}
                        style={styles.image}
                    />
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

    image: {
        height: 200,
        width: 400,
    }
});

export default MapScreen;