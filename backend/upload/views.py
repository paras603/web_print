from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os

@csrf_exempt
def upload_file(request):
    if request.method == 'POST':
        file = request.FILES.get('file')

        if not file:
            return JsonResponse({'error': 'No file uploaded'}, status=400)

        # Ensure media directory exists
        media_path = "media"
        if not os.path.exists(media_path):
            os.makedirs(media_path)

        # Save the file to media folder
        file_path = os.path.join(media_path, file.name)
        with open(file_path, "wb+") as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        return JsonResponse({'message': f'File "{file.name}" uploaded successfully'}, status=200)

    return JsonResponse({'error': 'Invalid request method'}, status=400)
