# API Documentation

## Overview

This WebSocket server allows real-time multiplayer typing games. Players are matched in pairs and compete to type a generated paragraph as quickly and accurately as possible.

---

## 🔌 Client → Server Events

### `join`

Join the game queue with a specified paragraph style.

**Payload:**

```json
{
  "style": "descriptive" // Required: writing style for paragraph generation
}
```

**Description:**

- If another player is waiting, both are matched and the game starts.
- If no player is waiting, the user waits for an opponent.

---

### `counter`

Send the number of correctly typed words during gameplay.

**Payload:**

```json
{
  "counter": 15 // Integer: number of correct words typed
}
```

**Description:**
Used to track player performance in real-time.

---

## 📤 Server → Client Events

### `waiting`

Sent when the user is waiting for another player.

**Payload:**

```json
{
  "message": "Waiting for another player..."
}
```

---

### `start`

Sent to both players when the game begins.

**Payload:**

```json
{
  "paragraph": ["The", "quick", "brown", "fox", "..."]
}
```

**Description:**
Provides the paragraph each player must type.

---

### `countdown`

A countdown timer before the game starts.

**Payload:**

```json
{
  "countdown": 5 // Seconds remaining before game starts
}
```

**Description:**
Counts down from 5 to 0, then starts the game.

---

### `gameStart`

Signals the beginning of the game.

**Payload:**

```json
{
  "duration": 180 // Total duration in seconds
}
```

---

### `gameEnd`

Sent at the end of the game or when an opponent disconnects.

**Payload:**

```json
{
  "status": "Winner" | "Loser" | "Draw",
  "score": 120 // Final score (10 points per correct word)
}
```

---

### `error`

Emitted when the server fails to generate a paragraph.

**Payload:**

```json
{
  "message": "Failed to generate paragraph."
}
```
