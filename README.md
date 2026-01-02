# covetous
my first pebble watch face

get it on the [appstore](https://apps.rebble.io/en_US/application/69581fbe39d92d0009bb746e)!

## genesis

i really like the watch face on the `Pebble 2 Duo` screenshot from [repebble.com/watch](https://repebble.com/watch)

but i couldn't figure out which face it was, so this is an attempt to build our own version of it.

## elements

| position     | description                          |
|--------------|--------------------------------------|
| upper left   | day of the month                     |
| center left  | hour of the day                      |
| lower center | 10x6 grid showing minute of the hour |
| upper right  | watch battery %                      |

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
