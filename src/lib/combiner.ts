export function escape(text: string) {
	return text.replace(/\\/g, '\\\\').replace(/\"/g, '\\"');
}

function cmdBlockPassengerTags(
	type: 'chain' | 'impulse' | 'repeating',
	face: 'up' | 'down',
	command: string,
	omitIdTag = false
) {
	const types = {
		chain: 'chain_command_block',
		impulse: 'command_block',
		repeating: 'repeating_command_block'
	};
	return (
		(omitIdTag ? '' : 'id:falling_block,') +
		`BlockState:{Name:${types[type]},Properties:{facing:${face}}},TileEntityData:{Command:"${escape(command)}",auto:1},Motion:[0.0,-10.0,0.0]`
	);
}

function bufferPassengerTags() {
	return `id:allay,Health:0,DeathTime:20`;
}

function globalCoordinateProcess(
	command: string,
	offsetX: number,
	offsetY: number,
	offsetZ: number
) {
	return command.replace(/@{~-?.*? ~-?.*? ~-?.*?}/g, (coords) => {
		const splitted = coords.substring(2, coords.length - 1).split('~');
		let [_, x, y, z] = splitted;
		if (isNaN(+x) || isNaN(+y) || isNaN(+z))
			throw `Cannot process global coordinate: @{~${x} ~${y} ~${z}}`;
		return `~${+x + 1} ~${+y - 1 + offsetY} ~${+z - 1}`;
	});
}

export function generateTagList(cmdList: string[]) {
	const list: string[] = [];
	for (const [index, cmd] of cmdList.entries()) {
		if (index !== 0) list.push(bufferPassengerTags());
		list.push(
			cmdBlockPassengerTags(
				index === cmdList.length - 1 ? 'impulse' : 'chain',
				'down',
				globalCoordinateProcess(cmd, 0, -index + 2, 0),
				index === 0
			)
		);
	}
	return list;
}

// for tower mode
export function appendPassengersFromTagList(tagList: string[]): string {
	const thisTag = tagList.shift();
	if (tagList.length === 0) return `{${thisTag}}`;
	return `{${thisTag},Passengers:[${appendPassengersFromTagList(tagList)}]}`;
}

export function generateCommand(cmdList: string[]): string | null {
	// const
	let tagList: string[];
	tagList = generateTagList([`fill ~ ~-1 ~ ~ ~${cmdList.length} ~ air`, ...cmdList.reverse()]);
	return `summon falling_block ~ ~1 ~ ${appendPassengersFromTagList(tagList)}`;

	// return appendPassengersFromTagList(generateTagList([...cmdList, `fill ~ ~ ~ ~ ~${cmdList.length} ~ air`]));
}

// {BlockState:{Name:"minecraft:spawner"},TileEntityData:{Delay:0,SpawnCount:1,SpawnPotentials:[{data:{entity:{BlockState:{Name:"minecraft:redstone_block"},Passengers:[{DeathTime:20,Health:0.0f,Motion:[0.0d,10.0d,0.0d],Passengers:[{BlockState:{Name:"minecraft:activator_rail"},Time:1,id:"minecraft:falling_block"},{Command:"/fill ~1 ~-2 ~5 ~7 ~3 ~ minecraft:oak_planks hollow",id:"minecraft:command_block_minecart"},{Command:"/fill ~7 ~3 ~5 ~1 ~3 ~5 minecraft:cobblestone_stairs",id:"minecraft:command_block_minecart"},{Command:"/fill ~1 ~3 ~ ~1 ~3 ~5 minecraft:cobblestone_stairs[facing= east]",id:"minecraft:command_block_minecart"},{Command:"/fill ~7 ~3 ~ ~1 ~3 ~ minecraft:cobblestone_stairs[ facing= south]",id:"minecraft:command_block_minecart"},{Command:"/fill ~7 ~3 ~ ~7 ~3 ~5 minecraft:cobblestone_stairs[ facing= west]",id:"minecraft:command_block_minecart"},{Command:"/tag @e[type=minecraft:command_block_minecart,distance=..10] add kill",id:"minecraft:command_block_minecart"},{Command:'/summon falling_block ~ ~ ~-1 {BlockState:{Name:"minecraft:command_block"},TileEntityData:{auto:1b,Command:"kill @e[type=command_block_minecart,tag=kill]"},Time:1,Motion:[0.0,-10.0,0.0],Passengers:[{id:"minecraft:falling_block",BlockState:{Name:"minecraft:command_block"},TileEntityData:{auto:1b,Command:"/fill ~ ~1 ~ ~ ~-1 ~1 air"},Time:1,Motion:[0.0,-10.0,0.0]}]}',id:"minecraft:command_block_minecart"},{Command:"/fill ~6 ~4 ~1 ~6 ~4 ~4 minecraft:cobblestone_stairs[ facing= west]",id:"minecraft:command_block_minecart"},{Command:"/fill ~2 ~4 ~1 ~2 ~4 ~4 minecraft:cobblestone_stairs[ facing= east]",id:"minecraft:command_block_minecart"},{Command:"/fill ~5 ~4 ~1 ~2 ~4 ~1 minecraft:cobblestone_stairs[ facing= south]",id:"minecraft:command_block_minecart"},{Command:"/fill ~5 ~4 ~4 ~2 ~4 ~4 minecraft:cobblestone_stairs[ facing= north]",id:"minecraft:command_block_minecart"},{Command:"/fill ~5 ~4 ~2 ~3 ~4 ~3 cobblestone",id:"minecraft:command_block_minecart"},{Command:"/fill ~4 ~-1 ~ ~4 ~-1 ~ minecraft:oak_door[facing= south]",id:"minecraft:command_block_minecart"},{Command:"/fill ~4 ~ ~ ~4 ~ ~ minecraft:oak_door[facing= south,half=upper]",id:"minecraft:command_block_minecart"},{Command:"/fill ~4 ~-2 ~-1 ~4 ~-2 ~-1 minecraft:oak_stairs[facing= south]",id:"minecraft:command_block_minecart"},{Command:"/fill ~2 ~ ~-1 ~2 ~ ~-1 minecraft:wall_torch[facing=north]",id:"minecraft:command_block_minecart"},{Command:"/fill ~6 ~ ~-1 ~6 ~ ~-1 minecraft:wall_torch[facing=north]",id:"minecraft:command_block_minecart"}],id:"minecraft:cow"}],Time:1,id:"minecraft:falling_block"}},weight:1}],SpawnRange:0},Time:1,id:"minecraft:falling_block"}
