import fitz  # PyMuPDF
from typing import List, Dict, Any, Optional
from app.services.llm_service import LLMService
from app.services.vector_service import VectorService

class DocumentService:
    def __init__(self):
        self.llm_service = LLMService()
        self.vector_service = VectorService()
    
    async def extract_text_from_pdf(self, file_content: bytes) -> str:
        try:
            doc = fitz.open(stream=file_content, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            return text
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")
    
    async def process_document(
        self, 
        filename: str, 
        file_content: bytes, 
        workflow_id: Optional[int] = None
    ) -> Dict[str, Any]:
        try:
            # Extract text
            if filename.endswith('.pdf'):
                text = await self.extract_text_from_pdf(file_content)
            else:
                text = file_content.decode('utf-8')
            
            # Split text into chunks
            chunks = self._split_text(text, chunk_size=1000, overlap=200)
            
            # Generate embeddings
            embeddings = []
            for chunk in chunks:
                embedding = await self.llm_service.generate_embeddings(chunk)
                embeddings.append(embedding)
            
            # Store in vector database
            collection_name = f"workflow_{workflow_id}" if workflow_id else "default"
            metadata = [{"filename": filename, "chunk_id": i} for i in range(len(chunks))]
            
            await self.vector_service.store_embeddings(
                collection_name=collection_name,
                texts=chunks,
                embeddings=embeddings,
                metadata=metadata
            )
            
            return {
                "filename": filename,
                "text_length": len(text),
                "chunks_count": len(chunks),
                "status": "processed"
            }
        except Exception as e:
            raise Exception(f"Error processing document: {str(e)}")
    
    def _split_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        chunks = []
        start = 0
        while start < len(text):
            end = min(start + chunk_size, len(text))
            chunks.append(text[start:end])
            start = end - overlap
            if start >= len(text):
                break
        return chunks
    
    async def search_documents(
        self, 
        query: str, 
        workflow_id: Optional[int] = None,
        n_results: int = 5
    ) -> List[Dict[str, Any]]:
        try:
            # Generate query embedding
            query_embedding = await self.llm_service.generate_embeddings(query)
            
            # Search in vector database
            collection_name = f"workflow_{workflow_id}" if workflow_id else "default"
            results = await self.vector_service.search_similar(
                collection_name=collection_name,
                query_embedding=query_embedding,
                n_results=n_results
            )
            return results
        except Exception as e:
            print(f"Error searching documents: {str(e)}")
            return []
