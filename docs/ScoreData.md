# ScoreData Schema

The structure of ScoreData is dictated by gamecode due to different games featuring different data in their screenshots. When processing, be mindful to implement different behavior for each possible configuration of ScoreData, as detailed below.

### Etterna

Awaiting implementation.

### osu!mania

Awaiting implementation.

### FlashFlashRevolution

```
{
    "game": 3, // Game Id for FFR scores
    "date": int, // Date on scorepost in Time-since-epoch format
    "player": string, // Username of the player
    "title": string, // Chart title
    "artist": string, // Song Artist
    "creator": string, // Name of charter
    "combo": int, // Max Combo value
    "w0": int, // Number of Amazings
    "w1": int, // Number of perfects
    "w2": int, // Number of Goods
    "w3": int, // Number of Averages
    "w4": int, // Number of Misses
    "w5": int, // Number of Boos
    "equiv": float, // AAA Equivalency value
    "raw": float // Raw Goods value
}
```

### Quaver

Awaiting implementation.

### RobeatsCS

Awaiting implementation.