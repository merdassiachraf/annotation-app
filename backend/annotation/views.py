from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
import fitz 
import docx 
from django.utils.timezone import now
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, HttpResponse
import logging

import json

@csrf_exempt
@require_http_methods(["POST"])
def extract_text(request):
    if 'file' not in request.FILES:
        return JsonResponse({'error': 'No file provided'}, status=400)
    
    file = request.FILES['file']
    file_name = default_storage.save(file.name, ContentFile(file.read()))
    file_path = default_storage.path(file_name)

    try:
        text = ""
        if file.name.lower().endswith('.pdf'):
            # Open the PDF file with PyMuPDF
            pdf_document = fitz.open(file_path)
            for page_num in range(len(pdf_document)):
                page = pdf_document.load_page(page_num)
                text += page.get_text().replace('\n', ' ')
        elif file.name.lower().endswith('.docx'):
            # Open the DOCX file with python-docx
            doc = docx.Document(file_path)
            for paragraph in doc.paragraphs:
                text += paragraph.text + " "
        else:
            os.remove(file_path)
            return JsonResponse({'error': 'Unsupported file type'}, status=400)

    except Exception as e:
        os.remove(file_path)
        return JsonResponse({'error': f'Error reading file: {e}'}, status=500)

    # Clean up the temporary file immediately after reading its content
    os.remove(file_path)

    # Return the extracted text in a JSON response
    return JsonResponse({'text': text})

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["POST"])
def export_json(request):
    try:
        logger.info("Request body: %s", request.body)
        report = json.loads(request.body)
        if not report:
            return JsonResponse({'error': 'No report data provided'}, status=400)
        
        json_content = json.dumps(report, indent=4)
        filename = now().strftime("%Y-%m-%d_%H-%M-%S") + ".json"
        
        response = HttpResponse(json_content, content_type='application/json')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        return response

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        logger.error("Error processing request: %s", e)
        return JsonResponse({'error': f'Error processing request: {e}'}, status=500)
    