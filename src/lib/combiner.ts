function escape(text: string) {
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
		`BlockState:{Name:${types[type]},Properties:{facing:${face}}},TileEntityData:{Command:"${escape(command)}",auto:1}`
	);
}

function bufferPassengerTags() {
	return `id:allay,Health:0`;
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

function generateTagList(cmdList: string[]) {
	const list: string[] = [];
	for (const [index, cmd] of cmdList.entries()) {
		if (index !== 0) list.push(bufferPassengerTags());
		list.push(
			cmdBlockPassengerTags(
				index === cmdList.length - 1 ? 'impulse' : 'chain',
				'down',
				globalCoordinateProcess(cmd, 0, -index, 0),
				index === 0
			)
		);
	}
	return list;
}

// for tower mode
function appendPassengersFromTagList(tagList: string[]): string {
	const thisTag = tagList.shift();
	if (tagList.length === 0) return `{${thisTag}}`;
	return `{${thisTag},Passengers:[${appendPassengersFromTagList(tagList)}]}`;
}

export function generateCommand(cmdList: string[]) {
	// const
	let tagList: string[];
	try {
		tagList = generateTagList([`fill ~ ~-1 ~ ~ ~${cmdList.length} ~ air`, ...cmdList.reverse()]);
	} catch (err) {
		return err;
	}
	return `summon falling_block ~ ~1 ~ ${appendPassengersFromTagList(tagList)}`;
	// return appendPassengersFromTagList(generateTagList([...cmdList, `fill ~ ~ ~ ~ ~${cmdList.length} ~ air`]));
}
