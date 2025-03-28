import json
from datetime import datetime
from collections import defaultdict
import matplotlib.pyplot as plt

def analyze_data(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)

        for entry in data["friends_v2"]:
            timestamp = entry['timestamp']
            readable_date = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')
            entry['timestamp'] = readable_date

        sorted_data = sorted(data["friends_v2"], key=lambda x: datetime.strptime(x["timestamp"], '%Y-%m-%d %H:%M:%S'))

        # track cumulative friends added per year
        friends_per_year = defaultdict(int)

        for friend in data["friends_v2"]:
            year = datetime.strptime(friend['timestamp'], '%Y-%m-%d %H:%M:%S').year
            friends_per_year[year] += 1

        # cumulative count of friends added of each year
        years = sorted(friends_per_year.keys())
        cumulative_friends = []
        total_friends = 0

        for year in years:
            total_friends += friends_per_year[year]
            cumulative_friends.append(total_friends)

        #create plot
        plt.figure(figsize=(10,5))
        plt.plot(years, cumulative_friends, marker='o', color='green', linestyle='-', linewidth=2)

        # add labels for each marker
        for i, txt in enumerate(cumulative_friends):
            plt.text(years[i], cumulative_friends[i], str(txt), fontsize=10, ha='right', va='bottom', color='black')

        plt.xlabel("Year")
        plt.ylabel("Total Friends")
        plt.title("Cumulative Friends Growth Per Year")
        plt.xticks(years)
        plt.grid(axis='y', linestyle='--', alpha=0.7)

        # save the plot as an image
        plot_image_path = "media/friends_growth_plot.png"
        plt.savefig(plot_image_path)

        print(plot_image_path)

        analyzed_data = {
            "friends": sorted_data,
            "friends_growth_chart": plot_image_path
        }

        return analyzed_data

    except Exception as e:
        raise Exception(f"Error while processing the file: {str(e)}")