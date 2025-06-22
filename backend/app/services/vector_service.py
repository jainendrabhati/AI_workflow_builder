
import chromadb
from typing import List, Dict, Any, Optional
import json

class VectorService:
    def __init__(self):
        self.client = chromadb.Client()
        
    def get_or_create_collection(self, collection_name: str):
        try:
            collection = self.client.get_collection(collection_name)
        except:
            collection = self.client.create_collection(collection_name)
        return collection
    
    async def store_embeddings(
        self, 
        collection_name: str, 
        texts: List[str], 
        embeddings: List[List[float]], 
        metadata: List[Dict[str, Any]]
    ):
        collection = self.get_or_create_collection(collection_name)
        
        ids = [f"doc_{i}" for i in range(len(texts))]
        
        collection.add(
            embeddings=embeddings,
            documents=texts,
            metadatas=metadata,
            ids=ids
        )
        
        return True
    
    async def search_similar(
        self, 
        collection_name: str, 
        query_embedding: List[float], 
        n_results: int = 5
    ) -> List[Dict[str, Any]]:
        try:
            collection = self.get_or_create_collection(collection_name)
            
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results
            )
            
            return [
                {
                    "text": doc,
                    "metadata": meta,
                    "distance": dist
                }
                for doc, meta, dist in zip(
                    results['documents'][0],
                    results['metadatas'][0],
                    results['distances'][0]
                )
            ]
        except Exception as e:
            print(f"Error searching similar documents: {str(e)}")
            return []
