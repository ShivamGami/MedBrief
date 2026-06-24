from google import genai
from ...Security.Settings import settings 

async def call_genai(prompts: str) -> str:
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        model_name = settings.GEMINI_MODEL
        
        if model_name.startswith("models/"):
            model_name = model_name.replace("models/", "", 1)
            
        response = client.models.generate_content(
            model=model_name,
            contents=prompts
        )
        return response.text
        
    except Exception as e:
        raise RuntimeError(f"GenAI Model is throwing error: {e}") from e