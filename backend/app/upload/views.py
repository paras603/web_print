from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
import json

# Import function from the correct module
from upload.files.process_following import generate_followers_plot


import logging
logger = logging.getLogger(__name__)

logger.info("upload_file view is being called")


@csrf_exempt
def upload_file(request):
    print("hello world")

    if request.method == 'POST':
        file = request.FILES.get('file')

        if not file:
            logger.error('No file uploaded')
            return JsonResponse({'error': 'No file uploaded'}, status=400)

        try:
            media_path = "media"
            if not os.path.exists(media_path):
                os.makedirs(media_path)

            file_path = os.path.join(media_path, file.name)
            with open(file_path, "wb+") as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

            return JsonResponse({'message': f'File "{file.name}" uploaded successfully'}, status=200)

        except Exception as e:
            logger.error(f"Error during file upload: {str(e)}")
            return JsonResponse({'error': f'Error during file upload: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)



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

            # Call to generate followers plot
            followers_data = generate_followers_plot(file_path)

            return JsonResponse({'message': 'Data visualized successfully', 'followers_data': followers_data}, status=200)

        except Exception as e:
            logger.error(f"Error in visualize_data: {str(e)}")
            return JsonResponse({'error': f'Error processing file: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)
