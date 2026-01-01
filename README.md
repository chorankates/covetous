# covetous
pebble watch face

## genesis

i really like the watch face on the `Pebble 2 Duo` screenshot from [repebble.com/watch](https://repebble.com/watch)

but i couldn't figure out which face it was, so this is an attempt to build our own version of it.

## features

- **Day of Month** (upper left) - Displayed in small dot-matrix style
- **Hour** (center-left) - Large pixelated 24-hour format
- **Minute Grid** (below hour) - 6×10 grid where filled squares show elapsed minutes
- **Battery** (upper right) - 5 vertical bars, each representing 20% charge

## building

### prerequisites

1. Install the Pebble SDK via [Rebble](https://rebble.io/):
   ```bash
   # Install pebble tool
   pip install pebble-tool
   
   # Or use the Rebble Docker image
   docker pull rebble/pebble-sdk
   ```

2. Set up Rebble account for deploying to watch

### build commands

```bash
# Build the watchface
pebble build

# Install to emulator
pebble install --emulator basalt

# Install to physical watch (via phone)
pebble install --phone YOUR_PHONE_IP
```

### using docker

```bash
# Build with Docker
docker run --rm -v $(pwd):/pebble rebble/pebble-sdk pebble build

# Run emulator
docker run --rm -it -v $(pwd):/pebble -p 9000:9000 rebble/pebble-sdk pebble install --emulator basalt
```

## supported platforms

- **aplite** - Pebble Classic, Pebble Steel (144×168, B&W)
- **basalt** - Pebble Time, Pebble Time Steel (144×168, color)
- **chalk** - Pebble Time Round (180×180, round color)
- **diorite** - Pebble 2 (144×168, color)
- **emery** - Pebble Time 2 (200×228, color)

## layout

```
┌─────────────────────┐
│ 01          █████   │  ← Day    Battery
│                     │
│ ██  ████            │
│  █  █               │  ← Hour (24h)
│  █  ███             │
│  █     █            │
│ ███ ████            │
│                     │
│ ■ ■ ■ ■ ■ ■         │
│ ■ ■ ■ ■ ■ ■         │
│ ■ ■ ■ ■ ■ ■         │  ← Minutes grid
│ ■ ■ ■ ■ · ·         │     (filled = elapsed)
│ · · · · · ·         │
│ · · · · · ·         │
└─────────────────────┘
```

## license

MIT
