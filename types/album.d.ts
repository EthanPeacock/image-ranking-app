interface AlbumDetails {
	id: number;
	name: string;
	description: string;
	thumbnail: string | null;
	imgCount: number;
}

interface CreateAlbum {
	name: string;
	description: string;
	images: string[];
}

interface UpdateAlbum {
	id: number;
	name: string;
	description: string;
}

interface AlbumImages {
	Rank1: string[];
	Rank2: string[];
	Rank3: string[];
}

interface ImageRanking {
	imageId: number;
	rank: number;
}

export type { AlbumDetails, CreateAlbum, UpdateAlbum, AlbumImages, ImageRanking };
