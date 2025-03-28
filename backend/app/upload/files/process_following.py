# backend/files/process_followers.py
import json
import os
from datetime import datetime
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from collections import defaultdict
import threading
from wordcloud import WordCloud
from textblob import TextBlob

def generate_followers_plot(data_file_path):
    try:
        # Read the saved JSON file
        with open(data_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # Convert timestamp to readable date format and sort the data
        for entry in data['following_v3']:
            timestamp = entry['timestamp']
            readable_date = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')
            entry['timestamp'] = readable_date
        
        #sorted data for following according to time (year)
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

        # Create plot
        plt.figure(figsize=(10, 5))
        plt.plot(years, cumulative_followers, marker='o', color='green', linestyle='-', linewidth=2)

        # Add labels for each marker
        for i, txt in enumerate(cumulative_followers):
            plt.text(years[i], cumulative_followers[i], str(txt), fontsize=10, ha='right', va='bottom', color='black')

        plt.xlabel("Year")
        plt.ylabel("Total Followers")
        plt.title("Cumulative Followers Growth Per Year")
        plt.xticks(years)
        plt.grid(axis='y', linestyle='--', alpha=0.7)

        # Save the plot as an image
        plot_image_path = "media/followers_growth_plot.png"
        plt.savefig(plot_image_path)
    
        #word cloud

        #extract names
        following_names = [entry["name"] for entry in data["following_v3"]]

        #join all names as a single string seperated by space for word cloud to work
        names_text = " ".join(following_names)

        #create word cloud and save
        wordcloud = WordCloud(
            width = 800,
            height = 400,
            background_color = 'white',
            colormap = 'viridis',
            max_words = 200,
            min_font_size = 10
        ).generate(names_text)

        plt.figure(figsize=(10,5))
        plt.imshow(wordcloud, interpolation='bilinear')
        plt.axis('off')
        plt.title('Followers Name Word Cloud', fontsize = 18, pad=15)

              # Save the plot as an image
        wc_image_path = "media/word_cloud.png"
        plt.savefig(wc_image_path)
        

            #sentiment analysis

        # Analyze sentiment of each name
        sentiment_scores = {name: TextBlob(name).sentiment.polarity for name in following_names}

        # Classify sentiment: positive, neutral, negative
        positive_names = [name for name, score in sentiment_scores.items() if score > 0]
        neutral_names = [name for name, score in sentiment_scores.items() if score == 0]
        negative_names = [name for name, score in sentiment_scores.items() if score < 0]

        # Display sentiment breakdown
        print(f"Positive names: {len(positive_names)}")
        print(f"Neutral names: {len(neutral_names)}")
        print(f"Negative names: {len(negative_names)}")

        # Create a word cloud for positive names
        positive_cloud = WordCloud(
            width=800,
            height=400,
            background_color="white",
            colormap="Greens",
            max_words=200
        ).generate(" ".join(positive_names))

        # Create a word cloud for negative names
        negative_cloud = WordCloud(
            width=800,
            height=400,
            background_color="white",
            colormap="Reds",
            max_words=200
        ).generate(" ".join(negative_names))

        # create neutral cloud for nuetral names
        neutral_cloud = WordCloud(
            width = 800,
            height = 400,
            background_color="white",
            colormap = "bone",
            max_words= 200
        ).generate(" ".join(neutral_names))


        # save the positive word cloud
        plt.figure(figsize=(10, 5))
        plt.imshow(positive_cloud, interpolation="bilinear")
        plt.axis("off")
        plt.title("Positive Vibe Followers", fontsize=18, pad=15)
        positive_sentiment_img_path = "media/positive_sentiment.png"
        plt.savefig(positive_sentiment_img_path)

        # save the negative word cloud
        plt.figure(figsize=(10, 5))
        plt.imshow(negative_cloud, interpolation="bilinear")
        plt.axis("off")
        plt.title("Negative Vibe Followers", fontsize=18, pad=15)
        negative_sentiment_img_path = "media/negative_sentiment.png"
        plt.savefig(negative_sentiment_img_path)

        # save the neutral word cloud
        plt.figure(figsize=(10,5))
        plt.imshow(neutral_cloud, interpolation="bilinear")
        plt.axis("off")
        plt.title("Neutral Vibe followers", fontsize=18, pad=15)
        netural_sentiment_img_path = "media/neutral_sentiment.png"
        plt.savefig(netural_sentiment_img_path)

        result = {
            "following": sorted_following,
            "follower_growth_chart": plot_image_path,
            "wc": wc_image_path,
            "positive_wc": positive_sentiment_img_path,
            "negative_wc": negative_sentiment_img_path,
            "neutral_wc": netural_sentiment_img_path
        }

        return result

    except Exception as e:
        raise Exception(f"Error while processing the file: {str(e)}")
    
