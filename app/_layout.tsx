import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MD3LightTheme as DefaultTheme, PaperProvider } from "react-native-paper";
import "react-native-reanimated";

export default function RootLayout() {
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf")
	});

	if (!loaded) {
		// Async font loading only occurs in development.
		return null;
	}

	return (
		<PaperProvider theme={DefaultTheme}>
			<Stack screenOptions={{
				headerTitleAlign: "center",
				headerLargeTitle: true
			}}>
				<Stack.Screen name="index" />
				<Stack.Screen name="view" />
				<Stack.Screen name="manage" />
				<Stack.Screen name="create" />
				<Stack.Screen name="rank" />
				<Stack.Screen name="+not-found" />
			</Stack>
			<StatusBar style="dark" />
		</PaperProvider>
	);
}
