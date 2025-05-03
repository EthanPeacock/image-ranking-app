import { MaterialIcons } from "@expo/vector-icons";
import { Surface, Text, useTheme } from "react-native-paper";

export default function ErrorPopup({ message }: { message: string }) {
	const theme = useTheme();

	return (
		<Surface
			elevation={0}
			style={{
				padding: 16,
				marginBottom: 16,
				backgroundColor: theme.colors.errorContainer,
				borderRadius: 10,
				flexDirection: "row",
				alignItems: "center",
			}}
		>
			<MaterialIcons name="error-outline" color={theme.colors.error} size={24} />
			<Text variant="titleMedium" style={{ marginLeft: 12, color: theme.colors.error }}>
				{message}
			</Text>
		</Surface>
	);
}
