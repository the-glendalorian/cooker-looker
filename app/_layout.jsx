import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack 
      screenOptions={{
        headerStyle: {
          backgroundColor: "#6b0000"
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontSize: 25,
          fontFamily: "Poppins-Bold"
        },
        contentStyle: {
          padding: 5,
          marginBottom: 20,
          backgroundColor: "white",
        }
    }}>
      <Stack.Screen name="index" options={{title: "Cooker Looker"}} />
      <Stack.Screen name="kitchen" options={{headerTitle: "Back to Search"}} />
    </Stack>);
};

export default RootLayout;
