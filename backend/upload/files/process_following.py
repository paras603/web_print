# backend/files/process_followers.py
import json
import os
from datetime import datetime
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from collections import defaultdict
import threading

def generate_followers_plot(data_file_path):
    print()
    print(f'file path in destination is {data_file_path}')
    print()
    try:
        # Read the saved JSON file
        with open(data_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # Convert timestamp to readable date format and sort the data
        for entry in data['following_v3']:
            timestamp = entry['timestamp']
            readable_date = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')
            entry['timestamp'] = readable_date
        
        sorted_following = sorted(data['following_v3'], key=lambda x: datetime.strptime(x["timestamp"], '%Y-%m-%d %H:%M:%S'))

        # Track cumulative followers per year
        followers_per_year = defaultdict(int)

        for follower in data["following_v3"]:
            year = datetime.strptime(follower['timestamp'], '%Y-%m-%d %H:%M:%S').year
            followers_per_year[year] += 1

        # Create cumulative count
        years = sorted(followers_per_year.keys())
        cumulative_followers = []
        total_followers = 0

        for year in years:
            total_followers += followers_per_year[year]
            cumulative_followers.append(total_followers)

        print()
        print('working till here')
        print()
        # Create plot
        plt.figure(figsize=(10, 5))
        print()
        print('working till here')
        print()
        plt.plot(years, cumulative_followers, marker='o', color='green', linestyle='-', linewidth=2)

        plt.xlabel("Year")
        plt.ylabel("Total Followers")
        plt.title("Cumulative Followers Growth Per Year")
        plt.xticks(years)
        plt.grid(axis='y', linestyle='--', alpha=0.7)



        # Save the plot as an image
        plot_image_path = "media/followers_growth_plot.png"
        plt.savefig(plot_image_path)

        return plot_image_path

    except Exception as e:
        raise Exception(f"Error while processing the file: {str(e)}")
    

# print(generate_followers_plot("./backend/media/following.json"))
