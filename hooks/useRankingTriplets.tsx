import TripletGenerationModule from "@/modules/triplet-generation";
import { useEffect, useState } from "react";

export default function useRankingTriplets(albumId: number, images: string[], method: string) {
	const [loading, setLoading] = useState<boolean>(true);
	const [triplets, setTriplets] = useState<string[][]>([]);
	const [currTriplet, setCurrTriplet] = useState<number>(0);
	const [round, setRound] = useState<0 | 1 | 2>(0);
	const [swiped, setSwiped] = useState<boolean>(false);

	const getInitialTriplets = async () => {
		let generatedTriplets: string[][] = [];

		if (method === "similarity") {
			generatedTriplets = await TripletGenerationModule.similarity(images);
		} else {
			generatedTriplets = await TripletGenerationModule.metadata(images);
		}

		setTriplets(generatedTriplets);
	}

	const getRound2Triplets = async () => {
		console.log("getting the second round triplets");
	};

	useEffect(() => {
		if (triplets.length === 0) return;

		setCurrTriplet(0);
		setRound(1);
		setLoading(false);
	}, [triplets]);

	useEffect(() => {
		if (currTriplet > triplets.length - 1 && round === 1) {
			console.log("end of round 1 triplets");
			setLoading(true);
			setRound(2);
		}

		setSwiped(false);
	}, [currTriplet]);

	useEffect(() => {
		if (round === 2) {
			getRound2Triplets();
		}
	}, [round]);

	useEffect(() => {
		if (swiped) {
			setCurrTriplet(currTriplet + 1);
		}
	}, [swiped]);

	useEffect(() => {
		getInitialTriplets();
	}, []);

	return {
		loading,
		triplets,
		currTriplet,
		swiped,
		setSwiped
	};
}
