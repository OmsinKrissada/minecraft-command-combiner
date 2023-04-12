# Minecraft Command Combiner

This online tool combines multiple minecraft commands to run at once.

## Special feature

### Global coordinates

The tool imagines an anchor, which command blocks will use as a reference point. Said reference point is as an origin for relative coordinates. To achieve this, you can use `@{~ ~ ~}` instead of the regular `~ ~ ~`. I believe the usage is better explained by an example below. This feature allows building via commands (`setblock`, `fill`, etc) easier as you won't have to take into account the actual position of the generated command blocks, which can be troublesome when you insert commands in between.

### Example

The following input

```
setblock @{~ ~ ~} red_wool
setblock @{~1 ~ ~} yellow_wool
setblock @{~2 ~ ~} orange_wool
setblock @{~3 ~ ~} green_wool
setblock @{~4 ~ ~} blue_wool
setblock @{~5 ~ ~} purple_wool
```

is equivalent to

_notice the incrementing y value_

```
setblock ~1 ~-2 ~-1 red_wool
setblock ~2 ~-3 ~-1 yellow_wool
setblock ~3 ~-4 ~-1 orange_wool
setblock ~4 ~-5 ~-1 green_wool
setblock ~5 ~-6 ~-1 blue_wool
setblock ~6 ~-7 ~-1 purple_wool
```
