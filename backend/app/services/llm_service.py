
import openai
import google.generativeai as genai
from typing import Optional, Dict, Any
from app.core.config import settings

class LLMService:
    def __init__(self):
        if settings.openai_api_key:
            openai.api_key = settings.openai_api_key
        
        if settings.google_ai_api_key:
            genai.configure(api_key=settings.google_ai_api_key)

    async def generate_response(
        self, 
        query: str, 
        context: Optional[str] = None,
        model: str = "gpt-3.5-turbo",
        custom_prompt: Optional[str] = None
    ) -> str:
        try:
            if model.startswith("gpt"):
                return await self._openai_generate(query, context, model, custom_prompt)
            elif model.startswith("gemini"):
                return await self._gemini_generate(query, context, model, custom_prompt)
            else:
                raise ValueError(f"Unsupported model: {model}")
        except Exception as e:
            return f"Error generating response: {str(e)}"

    async def _openai_generate(
        self, 
        query: str, 
        context: Optional[str] = None,
        model: str = "gpt-3.5-turbo",
        custom_prompt: Optional[str] = None
    ) -> str:
        messages = []
        
        if custom_prompt:
            messages.append({"role": "system", "content": custom_prompt})
        
        user_message = query
        if context:
            user_message = f"Context: {context}\n\nQuestion: {query}"
        
        messages.append({"role": "user", "content": user_message})
        
        response = await openai.ChatCompletion.acreate(
            model=model,
            messages=messages,
            max_tokens=1000,
            temperature=0.7
        )
        
        return response.choices[0].message.content

    async def _gemini_generate(
        self, 
        query: str, 
        context: Optional[str] = None,
        model: str = "gemini-pro",
        custom_prompt: Optional[str] = None
    ) -> str:
        model_instance = genai.GenerativeModel(model)
        
        prompt = query
        if context:
            prompt = f"Context: {context}\n\nQuestion: {query}"
        
        if custom_prompt:
            prompt = f"{custom_prompt}\n\n{prompt}"
        
        response = await model_instance.generate_content_async(prompt)
        return response.text

    async def generate_embeddings(self, text: str, model: str = "text-embedding-ada-002") -> list:
        try:
            if model.startswith("text-embedding"):
                response = await openai.Embedding.acreate(
                    model=model,
                    input=text
                )
                return response.data[0].embedding
            else:
                # Use Gemini embeddings if available
                model_instance = genai.GenerativeModel("embedding-001")
                response = await model_instance.embed_content(text)
                return response.embedding
        except Exception as e:
            print(f"Error generating embeddings: {str(e)}")
            return []
