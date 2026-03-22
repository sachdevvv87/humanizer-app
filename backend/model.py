import os
from huggingface_hub import InferenceClient
from prompts import TONE_PROMPTS
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN", "")
MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.3"

client = InferenceClient(token=HF_TOKEN if HF_TOKEN else None)


def humanize_text(text: str, tone: str = "default") -> str:
    """
    Rewrite the given text using Mistral 7B Instruct via HuggingFace Inference API.
    Falls back gracefully if the API is unavailable.
    """
    if not text or not text.strip():
        return ""

    prompt_template = TONE_PROMPTS.get(tone, TONE_PROMPTS["default"])
    prompt = prompt_template.format(text=text.strip())

    # Format for Mistral Instruct
    formatted_prompt = f"<s>[INST] {prompt} [/INST]"

    try:
        response = client.text_generation(
            formatted_prompt,
            model=MODEL_ID,
            max_new_tokens=1024,
            temperature=0.75,
            top_p=0.92,
            repetition_penalty=1.15,
            do_sample=True,
        )
        # Clean up any leading/trailing whitespace
        return response.strip()

    except Exception as e:
        raise RuntimeError(f"Model inference failed: {str(e)}")
