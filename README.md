# Whats-That-Song


search the interwebs for a mashup of song lyrics, song/artist titles to play some music


Obtain LyricsnMusic and YouTube Data API keys, store them in your server, then run


*(api.lyricsnmusic.com is currently down, affecting the app's ability to find the music, however the logic is apparent in the code)

```
bower install
npm install
gulp
```

This app works by parsing out the text from the user input field with regex, searching against an API for relevant songs that match keywords in the text, then doing additional regex checks againsts possible song lyrics, artist names, and song titles to match the most relevant song particular to the user query. 

The search for songs is decently accurate, where problems come from API returns not being accurate,
for example a Drake song is called "Back to Back" but mislabelled as "Back with a Vengeance". Custom parsing, especially when there is more to go off of from the user field, helps to sift through noise and find the right song.
