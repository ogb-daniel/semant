import { pipeline, type FeatureExtractionPipeline } from "@xenova/transformers";

export class EmbeddingsService {
  private static instance: FeatureExtractionPipeline | null = null;
  private static readonly model = "Xenova/all-MiniLM-L6-v2";
  private constructor() {}
  static async getInstance(): Promise<FeatureExtractionPipeline> {
    if (this.instance == null) {
      console.log("Loading embedding model...");
      this.instance = await pipeline("feature-extraction", this.model);
    }
    return this.instance;
  }
  static async embed(text: string): Promise<Float32Array> {
    const extractor = await this.getInstance();
    const output = await extractor(text, { pooling: "mean", normalize: true });
    return Float32Array.from(output.data);
  }
}
