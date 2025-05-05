import { MaterialIcons } from "@expo/vector-icons";
import { Surface, Text, useTheme } from "react-native-paper";

export default function SuccessPopup({ message }: { message: string }) {
	const theme = useTheme();

	return (
		<Surface
			elevation={0}
			style={{
				padding: 16,
				marginBottom: 16,
				backgroundColor: theme.colors.primaryContainer,
				borderRadius: 10,
				flexDirection: "row",
				alignItems: "center"
			}}
		>
			<MaterialIcons name="check-circle-outline" color={theme.colors.primary} size={24} />
			<Text variant="titleMedium" style={{ marginLeft: 12, color: theme.colors.primary }}>
				{message}
			</Text>
		</Surface>
	);
}
