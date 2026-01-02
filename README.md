# covetous
my first pebble watch face

## genesis

i really like the watch face on the `Pebble 2 Duo` screenshot from [repebble.com/watch](https://repebble.com/watch)

but i couldn't figure out which face it was, so this is an attempt to build our own version of it.

## features

- **Day of Month** (upper left) - Displayed in small dot-matrix style
- **Hour** (center-left) - Large pixelated 24-hour format
- **Minute Grid** (below hour) - 10x6 grid where filled squares show elapsed minutes
- **Battery** (upper right) - 5 vertical bars, each representing 20% charge

## screenshots

| platform  | screenshot                                |
|-----------|-------------------------------------------|
| `aplite`  | ![aplite](media/screenshots/aplite.png)   |
| `basalt`  | ![basalt](media/screenshots/basalt.png)   |
| `chalk`   | ![chalk](media/screenshots/chalk.png)     |
| `diorite` | ![diorite](media/screenshots/diorite.png) |
| `emery`   | ![emery](media/screenshots/emery.png)     |
| `flint`   | ![flint](media/screenshots/flint.png)     | 

it looks right on a Duo 2, but the `chalk` and `emery` implementations don't take the different dimensions in to account and are not right. will fix this in the future
