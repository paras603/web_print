from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
import json

import sys
sys.path.insert(1, './upload/files')

from process_following import generate_followers_plot


@csrf_exempt
def upload_file(request):
    print("hello world")
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

@csrf_exempt
def visualize_data(request):

    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        print(f'request is {data.get('file_name')}')
        # Get the file name from the uploaded data
        file_name = data.get('file_name')
        
        # Assuming the file was uploaded and saved in 'media'
        print()
        # required path to access file ./backend/media/file_name
        file_path = os.path.join('media/', file_name)
        print(f'file path is {file_path}')
        print()

        if not os.path.exists(file_path):
            return JsonResponse({'error': 'File not found in media folder'}, status=404)

        try:
            # Call the function to analyze the data and generate the plot
            following_growth_chart = generate_followers_plot(file_path)

            
            # Return the path to the plot image
            return JsonResponse({'message': 'Data visualized successfully', 'plot_image': following_growth_chart}, status=200)

        except Exception as e:
            return JsonResponse({'error': f'Error processing file: {str(e)}'}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=400)