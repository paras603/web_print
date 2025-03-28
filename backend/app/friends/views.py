from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import logging
import os
from friends.files.process_friends import analyze_data

logger = logging.getLogger(__name__)

@csrf_exempt
def visualize_data(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            file_name = data.get('file_name')

            if not file_name:
                return JsonResponse({'error': 'No file name provided'}, status=400)

            media_path = "media"
            file_path = os.path.join(media_path, file_name)

            if not os.path.exists(file_path):
                return JsonResponse({'error': 'File not found'}, status=404)

            friends_data = analyze_data(file_path)

            return JsonResponse({'message': 'Data visualized successfully', 'friends_data': friends_data}, status=200)

        except Exception as e:
            logger.error(f"Error in visualizing friends data: {str(e)}")
            return JsonResponse({'error': f'Error processing file: {str(e)}'})

    return JsonResponse({'error': 'Invalid request method'}, status=400)
