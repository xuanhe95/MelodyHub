import pandas as pd

# read .csv file
playlist_df = pd.read_csv("playlist_2010to2022.csv")

#############################################################################################
# get artist_genres.csv
#############################################################################################
# Remove completely identical rows
playlist_df.drop_duplicates(inplace=True)

# Print the number of rows in playlist_2010to2022.csv
print("Number of rows in playlist_2010to2022.csv:", len(playlist_df))

# Remove "https://open.spotify.com/playlist/" from playlist_url
playlist_df["playlist_url"] = playlist_df["playlist_url"].str.replace(
    "https://open.spotify.com/playlist/", ""
)

# # Select the required columns for playlist.csv
playlist_df = playlist_df[
    [
        "artist_id",
        "artist_genres",
    ]
]


playlist_df["artist_genres"] = playlist_df["artist_genres"].apply(eval)
# Split artist_genres into separate rows
playlist_df = playlist_df.explode("artist_genres")

playlist_df.drop_duplicates(subset=['artist_id', 'artist_genres'], inplace=True)

print(playlist_df["artist_genres"])


# playlist_df.reset_index(drop=True, inplace=True)

# Save playlist.csv
playlist_df.to_csv("artist_genres.csv", index=False)

# Print the number of rows in playlist.csv
print("Number of rows in artist_genres.csv:", len(playlist_df))
