import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, MD3LightTheme as DefaultTheme, PaperProvider } from "react-native-paper";
import { SQLiteProvider } from "expo-sqlite";
import "react-native-reanimated";
import { Suspense } from "react";
import { createTablesIfNeeded } from "@/utils/db";

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
			<Suspense fallback={<Text>Loading...</Text>}>
				<SQLiteProvider databaseName="albums.db" onInit={createTablesIfNeeded} useSuspense>
					<Stack
						screenOptions={{
							headerTitleAlign: "center",
							headerLargeTitle: true
						}}
					>
						<Stack.Screen name="index" />
						<Stack.Screen name="view/[id]" />
						<Stack.Screen name="manage/[id]" />
						<Stack.Screen name="create" />
						<Stack.Screen name="rank" />
						<Stack.Screen name="+not-found" />
					</Stack>
					<StatusBar style="dark" />
				</SQLiteProvider>
			</Suspense>
		</PaperProvider>
	);
}
