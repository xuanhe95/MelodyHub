import pandas as pd

# read .csv file
playlist_df = pd.read_csv("playlist_2010to2022.csv")

#############################################################################################
# get playlist.csv and get playlist_songs.csv
#############################################################################################

# Print the number of rows in playlist_2010to2022.csv
#print("Number of rows:", len(playlist_df))

# create the first DataFrame, "playlist_url", "year", "track_id", "artist_id" 
playlist_df_first = playlist_df[["playlist_url", "year", "track_id", "artist_id"]]

playlist_df_first["playlist_url"] = playlist_df_first["playlist_url"].str.replace(
    "https://open.spotify.com/playlist/", ""
)


playlist_df_second = playlist_df_first.drop(columns=["track_id", "artist_id"])
playlist_df_second.drop_duplicates(subset=['playlist_url', 'year'], inplace=True)


#print("First DataFrame:")
#print(playlist_df_first.head())

#print("\nSecond DataFrame:")
#print(playlist_df_second.head())

# Save playlist.csv
playlist_df_first.to_csv("playlist_songs.csv", index=False)
playlist_df_second.to_csv("playlist.csv", index=False)

