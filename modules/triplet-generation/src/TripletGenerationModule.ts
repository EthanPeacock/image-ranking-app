import { NativeModule, requireNativeModule } from 'expo';

declare class TripletGenerationModule extends NativeModule {
	similarity(imgs: string[]): string[][];
	metadata(imgs: string[]): string[][];
}

export default requireNativeModule<TripletGenerationModule>("TripletGeneration");
