"""
PDF Export Router
Handles PDF report generation and download
"""

from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from fastapi.responses import FileResponse, StreamingResponse
import io
import json
from pathlib import Path

from ..services.pdf_generator import PDFGenerator, bytes_to_base64, save_pdf_to_file
from ..routers.auth import get_current_user
from ..routers.history import load_user_history, get_user_history_file

router = APIRouter(prefix="/api/export", tags=["export"])

# PDF storage directory
PDF_STORAGE_DIR = Path("./data/exports")
PDF_STORAGE_DIR.mkdir(parents=True, exist_ok=True)


@router.get("/diagnosis/{diagnosis_id}/pdf")
async def export_diagnosis_pdf(
    diagnosis_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Export a single diagnosis as PDF
    
    Returns:
        PDF file for download
    """
    try:
        user_id = current_user["user_id"]
        history = load_user_history(user_id, limit=1000)
        
        # Find diagnosis
        diagnosis = None
        for record in history:
            if record.get("id") == diagnosis_id:
                diagnosis = record
                break
        
        if not diagnosis:
            raise HTTPException(status_code=404, detail="Diagnosis not found")
        
        # Get user info for report header
        users_file = Path("./data/users.json")
        user_data = None
        if users_file.exists():
            with open(users_file, 'r') as f:
                users = json.load(f)
                user_data = users.get(user_id, {})
        
        # Generate PDF
        pdf_bytes = PDFGenerator.generate_diagnosis_report(diagnosis, user_data)
        
        # Return as download
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=diagnosis_{diagnosis_id}.pdf"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/pdf")
async def export_history_pdf(
    current_user: dict = Depends(get_current_user)
):
    """
    Export complete diagnosis history as PDF
    
    Returns:
        PDF file with all diagnoses
    """
    try:
        user_id = current_user["user_id"]
        history = load_user_history(user_id, limit=1000)
        
        # Load statistics
        stats = None
        history_file = get_user_history_file(user_id)
        if history_file.exists():
            with open(history_file, 'r') as f:
                records = [json.loads(line) for line in f if line.strip()]
            
            diseases = {}
            languages = {}
            for record in records:
                for tag in record.get('detected_tags', []):
                    diseases[tag] = diseases.get(tag, 0) + 1
                lang = record.get('language', 'en')
                languages[lang] = languages.get(lang, 0) + 1
            
            stats = {
                'total_diagnoses': len(records),
                'languages_used': languages,
                'top_diseases': sorted(diseases.items(), key=lambda x: x[1], reverse=True)[:10],
                'first_diagnosis': records[-1].get('timestamp') if records else None,
                'last_diagnosis': records[0].get('timestamp') if records else None,
            }
        
        # Get user data
        users_file = Path("./data/users.json")
        user_data = None
        if users_file.exists():
            with open(users_file, 'r') as f:
                users = json.load(f)
                user_data = users.get(user_id, {})
        
        # Generate PDF
        pdf_bytes = PDFGenerator.generate_history_report(history, stats, user_data)
        
        # Return as download
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=diagnosis_history.pdf"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/diagnosis/{diagnosis_id}/pdf/preview")
async def preview_diagnosis_pdf(
    diagnosis_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get a preview of diagnosis PDF as base64
    
    Returns:
        Base64 encoded PDF for preview
    """
    try:
        user_id = current_user["user_id"]
        history = load_user_history(user_id, limit=1000)
        
        # Find diagnosis
        diagnosis = None
        for record in history:
            if record.get("id") == diagnosis_id:
                diagnosis = record
                break
        
        if not diagnosis:
            raise HTTPException(status_code=404, detail="Diagnosis not found")
        
        # Get user data
        users_file = Path("./data/users.json")
        user_data = None
        if users_file.exists():
            with open(users_file, 'r') as f:
                users = json.load(f)
                user_data = users.get(user_id, {})
        
        # Generate PDF
        pdf_bytes = PDFGenerator.generate_diagnosis_report(diagnosis, user_data)
        pdf_base64 = bytes_to_base64(pdf_bytes)
        
        return {
            "status": "success",
            "data": {
                "pdf_base64": pdf_base64,
                "filename": f"diagnosis_{diagnosis_id}.pdf",
                "size_bytes": len(pdf_bytes)
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/history/pdf/preview")
async def preview_history_pdf(
    current_user: dict = Depends(get_current_user)
):
    """
    Get a preview of history PDF as base64
    
    Returns:
        Base64 encoded PDF for preview
    """
    try:
        user_id = current_user["user_id"]
        history = load_user_history(user_id, limit=1000)
        
        # Load statistics
        stats = None
        history_file = get_user_history_file(user_id)
        if history_file.exists():
            with open(history_file, 'r') as f:
                records = [json.loads(line) for line in f if line.strip()]
            
            diseases = {}
            languages = {}
            for record in records:
                for tag in record.get('detected_tags', []):
                    diseases[tag] = diseases.get(tag, 0) + 1
                lang = record.get('language', 'en')
                languages[lang] = languages.get(lang, 0) + 1
            
            stats = {
                'total_diagnoses': len(records),
                'languages_used': languages,
                'top_diseases': sorted(diseases.items(), key=lambda x: x[1], reverse=True)[:10],
                'first_diagnosis': records[-1].get('timestamp') if records else None,
                'last_diagnosis': records[0].get('timestamp') if records else None,
            }
        
        # Get user data
        users_file = Path("./data/users.json")
        user_data = None
        if users_file.exists():
            with open(users_file, 'r') as f:
                users = json.load(f)
                user_data = users.get(user_id, {})
        
        # Generate PDF
        pdf_bytes = PDFGenerator.generate_history_report(history, stats, user_data)
        pdf_base64 = bytes_to_base64(pdf_bytes)
        
        return {
            "status": "success",
            "data": {
                "pdf_base64": pdf_base64,
                "filename": "diagnosis_history.pdf",
                "size_bytes": len(pdf_bytes)
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
