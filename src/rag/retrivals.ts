import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { DATA_DIR } from "../paths.js";
import path from "node:path";
import { embeddings } from "../config.js";
import fs from "node:fs/promises";
import { Document } from "@langchain/core/documents";

const policiesDir = path.join(DATA_DIR, "policies");
const fileNames = await fs.readdir(policiesDir);
const docs = (
  await Promise.all(
    fileNames.map(async (name: string) => {
      const filePath = path.join(policiesDir, name);
      if (name.endsWith(".pdf")) {
        return new PDFLoader(filePath).load();
      }
      if (name.endsWith(".md") || name.endsWith(".txt")) {
        const text = await fs.readFile(filePath, "utf8");
        return [new Document({ pageContent: text, metadata: { source: filePath } })];
      }
      return [];
    })
  )
).flat();

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
});

const splitDocs = await splitter.splitDocuments(docs);
console.log('splitDocs:', splitDocs.length);

const vectorStore = new MemoryVectorStore(embeddings);

await vectorStore.addDocuments(splitDocs);

export default vectorStore;