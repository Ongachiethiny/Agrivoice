"""
Azure OpenAI GPT-4 Service
Handles crop diagnosis and organic solution recommendations
"""
import os
import json
from openai import AzureOpenAI


class GPT4Service:
    def __init__(self):
        self.client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_KEY"),
            api_version="2023-12-01-preview",
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )
        self.model = os.getenv("AZURE_OPENAI_MODEL", "gpt-4")
    
    async def diagnose_crop(self, image_tags: list, user_question: str) -> dict:
        """
        Use GPT-4 to diagnose crop health and recommend organic solutions.
        
        Args:
            image_tags: List of tags detected in the image
            user_question: User's question about the crop
        
        Returns:
            dict with diagnosis, disease_name, severity, and organic_solutions
        """
        try:
            system_prompt = """You are an expert organic agronomist with 20+ years of experience in sustainable farming.
Your role is to:
1. Analyze crop health conditions from image descriptions
2. Identify diseases, pests, or nutrient deficiencies
3. Provide organic, sustainable treatment solutions
4. Suggest preventive measures

Always respond in JSON format with the following structure:
{
    "disease_name": "name of identified disease",
    "severity": "low/medium/high",
    "confidence": 0-1,
    "diagnosis": "detailed diagnosis",
    "organic_solutions": ["solution1", "solution2", "solution3"],
    "prevention": ["prevention1", "prevention2"],
    "estimated_recovery_days": number,
    "recommended_practices": ["practice1", "practice2"]
}"""

            user_message = f"""
Image analysis tags: {', '.join(image_tags)}

Farmer's question: {user_question}

Please diagnose the crop condition and provide organic treatment recommendations."""

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            # Extract JSON from response
            content = response.choices[0].message.content
            diagnosis = json.loads(content)
            
            return diagnosis
        
        except json.JSONDecodeError:
            raise Exception("Failed to parse GPT-4 response as JSON")
        except Exception as e:
            raise Exception(f"GPT-4 API Error: {str(e)}")
    
    async def generate_treatment_plan(self, diagnosis: dict) -> dict:
        """
        Generate a detailed treatment plan based on diagnosis.
        """
        try:
            prompt = f"""Based on this diagnosis: {json.dumps(diagnosis)}
            
Generate a week-by-week treatment plan in JSON format:
{{
    "week_1": "actions",
    "week_2": "actions",
    "week_3": "actions",
    "week_4": "actions",
    "monitoring_tips": ["tip1", "tip2"],
    "success_indicators": ["indicator1", "indicator2"]
}}"""

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )
            
            treatment_plan = json.loads(response.choices[0].message.content)
            return treatment_plan
        
        except Exception as e:
            raise Exception(f"Treatment Plan Generation Error: {str(e)}")
