"""
Azure Speech-to-Text and Text-to-Speech Service
Handles voice input/output for farmers
"""
import os
import azure.cognitiveservices.speech as speechsdk


class SpeechService:
    def __init__(self):
        self.key = os.getenv("AZURE_SPEECH_KEY")
        self.region = os.getenv("AZURE_SPEECH_REGION")
        self.speech_config = speechsdk.SpeechConfig(
            subscription=self.key,
            region=self.region
        )
    
    async def speech_to_text(self, audio_file_path: str) -> str:
        """
        Convert farmer's voice question to text.
        
        Args:
            audio_file_path: Path to audio file
        
        Returns:
            Transcribed text
        """
        try:
            audio_config = speechsdk.audio.AudioConfig(filename=audio_file_path)
            speech_recognizer = speechsdk.SpeechRecognizer(
                speech_config=self.speech_config,
                audio_config=audio_config
            )
            
            result = speech_recognizer.recognize_once()
            
            if result.reason == speechsdk.ResultReason.RecognizedSpeech:
                return result.text
            elif result.reason == speechsdk.ResultReason.NoMatch:
                raise Exception("Speech not recognized. Please try again.")
            elif result.reason == speechsdk.ResultReason.Canceled:
                raise Exception(f"Speech recognition canceled: {result.cancellation_details.reason}")
        
        except Exception as e:
            raise Exception(f"Speech-to-Text Error: {str(e)}")
    
    async def text_to_speech(self, text: str, output_file: str = None) -> bytes:
        """
        Convert diagnosis/recommendations to speech.
        
        Args:
            text: Text to convert to speech
            output_file: Optional file path to save audio
        
        Returns:
            Audio bytes or file path
        """
        try:
            if output_file:
                audio_config = speechsdk.audio.AudioOutputConfig(filename=output_file)
            else:
                audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
            
            speech_synthesizer = speechsdk.SpeechSynthesizer(
                speech_config=self.speech_config,
                audio_config=audio_config
            )
            
            # Use SSML for better control
            ssml = f"""
            <speak version='1.0' xml:lang='en-US'>
                <voice name='en-US-AvaNeural'>
                    {text}
                </voice>
            </speak>
            """
            
            result = speech_synthesizer.speak_ssml(ssml)
            
            if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
                return {"status": "success", "file": output_file}
            else:
                raise Exception(f"Speech synthesis failed: {result.reason}")
        
        except Exception as e:
            raise Exception(f"Text-to-Speech Error: {str(e)}")
