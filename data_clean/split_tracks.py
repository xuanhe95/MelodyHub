import pandas as pd

# read .csv file
track_df = pd.read_csv('tracks_features.csv')


######################################################################
# get songs.csv
######################################################################
# Select the required columns
song_df = track_df[['id', 'name', 'album_id', 'tempo', 'track_number', 'disc_number','danceability', 'release_date', 'energy', 'duration_ms']]

# Convert release_date format from "MM/DD/YY" to "YYYY-MM-DD" if necessary
song_df['release_date'] = song_df['release_date'].apply(lambda x: pd.to_datetime(x, format='%m/%d/%y').strftime('%Y-%m-%d') if '/' in str(x) else x)

# Convert release_date with only year to "YYYY-01-01"
song_df['release_date'] = song_df['release_date'].apply(lambda x: str(x) + '-01-01' if len(str(x)) == 4 else x)

# Convert release_date with "YYYY-MM" to "YYYY-MM-DD" 
song_df['release_date'] = song_df['release_date'].apply(lambda x: pd.to_datetime(x).strftime('%Y-%m-%d') if len(str(x)) == 7 and '-' in str(x) else x)


# Write the DataFrame to song.csv file
song_df.to_csv('songs.csv', index=False)


# Print the number of rows in the file
num_rows = len(song_df)
print("Number of rows in songs.csv:", num_rows)


######################################################################
# get album.csv and remove duplicates
######################################################################
album_df = track_df[['album_id', 'album']].drop_duplicates()
album_df.to_csv('album.csv', index=False)
print("Number of rows in album.csv:", len(album_df))



#############################################################################################
# get song_album.csv
#############################################################################################
song_album_df = track_df[['id', 'album_id']].copy()
song_album_df.to_csv('song_album.csv', index=False)
print("Number of rows in song_album.csv:", len(song_album_df))



#############################################################################################
# get artist.csv and remove duplicates
#############################################################################################
# create artist.csv 文件
artist_df = track_df[['artist_ids', 'artists']]

# Function to process artist_ids and artists
def process_artists(row):
    # Remove brackets and quotes
    artist_ids = row['artist_ids'].strip("[]").replace("'", "")
    artists = row['artists'].strip("[]").replace("'", "")
    
    # Split multiple artists into separate rows
    artist_ids_list = artist_ids.split(', ')
    artists_list = artists.split(', ')
    
    # Create a list of dictionaries for each artist
    artists_data = []
    for i in range(len(artist_ids_list)):
        artist_data = {'artist_ids': artist_ids_list[i], 'artists': artists_list[i]}
        artists_data.append(artist_data)
    
    return artists_data

# Apply the function to each row
processed_artists = artist_df.apply(process_artists, axis=1)

# Convert the list of dictionaries into a DataFrame
artist_df = pd.DataFrame([item for sublist in processed_artists for item in sublist])

# Remove duplicates based on artist_ids
artist_df.drop_duplicates(subset=['artist_ids'], inplace=True)

# Write the result to artist.csv
artist_df.to_csv('artist.csv', index=False)

# Print the number of rows in artist.csv
print("Number of rows in artist.csv:", len(artist_df))


#############################################################################################
# get released_by.csv
#############################################################################################
# Select the columns 'id' and 'artist_ids' from track_df
released_by_df = track_df[['id', 'artist_ids']].copy()

released_by_df["artist_ids"] = released_by_df["artist_ids"].apply(eval)
# Split artist_genres into separate rows
released_by_df = released_by_df.explode("artist_ids")

released_by_df.drop_duplicates(subset=['id', 'artist_ids'], inplace=True)

# Save the processed DataFrame to released_by.csv
released_by_df.to_csv('released_by.csv', index=False)

# Print the number of rows in released_by.csv
print("Number of rows in released_by.csv:", len(released_by_df))

