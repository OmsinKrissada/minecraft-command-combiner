<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useClipboard, useLocalStorage, useTextareaAutosize } from '@vueuse/core'

const commandStorage = useLocalStorage(
  'cmd',
  `setblock @{~ ~ ~} red_wool
setblock @{~1 ~ ~} yellow_wool
setblock @{~2 ~ ~} orange_wool
setblock @{~3 ~ ~} green_wool
setblock @{~4 ~ ~} blue_wool
setblock @{~5 ~ ~} purple_wool`
)
const { textarea: inputarea, input: commandLines } = useTextareaAutosize({
  input: commandStorage
})

const options = reactive({
  prependGamerule: true,
  globalCoordinates: true,
  removeDoubleQuotes: true,
  escapeDoubleQuotes: true
})

const commands = computed(() => {
  return commandLines.value.trim().split('\n')
})

const commandStr = computed(() => {
  const filteredCommands = commands.value.filter((c) => c !== '' && !c.startsWith('#'))
  if (filteredCommands.length === 0) {
    return ''
  }
  const size = filteredCommands.length

  const appendPassenger = (cmdList: string[], position: number): string => {
    const command = cmdList.shift()
    if (command?.startsWith('#')) return appendPassenger(cmdList, position)
    if (!command) {
      const obj = {
        id: 'armor_stand',
        Health: 0,
        Small: 1,
        Invisible: 1,
        Passengers: [
          {
            id: 'falling_block',
            BlockState: { Name: 'chain_command_block', Properties: { facing: 'up' } },
            TileEntityData: { Command: `fill ~ ~4 ~ ~ ~-${size + 2} ~ air` },
            Passengers: [
              {
                id: 'armor_stand',
                Health: 0,
                Small: 1,
                Invisible: 1,
                Passengers: [
                  {
                    id: 'falling_block',
                    BlockState: { Name: 'stone' },
                    Passengers: [
                      {
                        id: 'armor_stand',
                        Health: 0,
                        Small: 1,
                        Invisible: 1,
                        Passengers: [
                          {
                            id: 'falling_block',
                            BlockState: {
                              Name: 'chain_command_block',
                              Properties: { facing: 'down' }
                            },
                            TileEntityData: {
                              Command: `setblock ~ ~-${size + 3} ~ redstone_block`
                            },
                            Passengers: [
                              {
                                id: 'armor_stand',
                                Health: 0,
                                Small: 1,
                                Invisible: 1,
                                Passengers: [
                                  {
                                    id: 'falling_block',
                                    BlockState: {
                                      Name: 'command_block',
                                      Properties: { facing: 'down' }
                                    },
                                    TileEntityData: {
                                      Command: 'gamerule commandBlockOutput false'
                                    },
                                    Passengers: [
                                      {
                                        id: 'armor_stand',
                                        Health: 0,
                                        Small: 1,
                                        Invisible: 1,
                                        Passengers: [
                                          {
                                            id: 'falling_block',
                                            BlockState: { Name: 'redstone_block' }
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
      // return JSON.stringify(obj)
      if (options.removeDoubleQuotes)
        return JSON.stringify(obj).replace(
          // /"(\b\S+\b)":\s*("[^"]*")|(\b\S+\b):\s*(?!null|true|false)(\b\S+\b)/g,
          // /"(\b\S+\b)":\s*"([^"]*)"(?=.*?(?:{|,))/g,
          /(")([^\s"]+)(")\s*:\s*("[^\s"]+"|true|false|\d+|\d+\.\d+|null)/g,
          // '$1$3:$2$4'
          // '$1:$2'
          '$2:$4'
        )
      else return JSON.stringify(obj)
    }

    let processedCommand = command

    if (options.escapeDoubleQuotes) processedCommand = processedCommand.replace(/\\/g, "\\\\").replace(/\"/g, '\\"')

    if (options.globalCoordinates)
      processedCommand = processedCommand.replace(/@{~-?\d* ~-?\d* ~-?\d*}/g, (coords) => {
        const splitted = coords.substring(2, coords.length - 1).split('~')
        let [_, x, y, z] = splitted
        return `~${+x + 1} ~${+y - position - 2} ~${+z - 1}`
      })

    return `{id:armor_stand,Health:0,${
      position > 1 ? 'Small:1,' : ''
    }Invisible:1,Passengers:[{id:falling_block,BlockState:{Name:${
      position === 0 ? 'command_block' : 'chain_command_block'
    },Properties:{facing:up}},TileEntityData:{Command:"${processedCommand}"},Passengers:[${appendPassenger(
      cmdList,
      position + 1
    )}]}]}`
  }

  return `summon falling_block ~ ~1 ~ {BlockState:{Name:stone},Passengers:[${appendPassenger(
    filteredCommands,
    0
  )}]}`
})

const clipboard = useClipboard()
function copyOutput() {
  clipboard.copy(commandStr.value)
}

function copyEggOutput(){
  const receiver = 'TurtleKid'
  const result= `give ${receiver} axolotl_spawn_egg{EntityTag:{id:falling_block,BlockState:{Name:command_block},TileEntityData:{Command:"${commandStr.value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}",auto:1b}},display:{Name:'[{"text":"Cloop-in-a-box","italic":false,"bold":true,"color":"light_purple"}]'},Enchantments:[{id:sharpness}],HideFlags:1} 1`
  clipboard.copy(result)
}

// onMounted(() => {
//   generateCommand()
// })
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="w-full px-4 bg-white border-b border-gray-200">
      <div class="flex items-center h-16 max-w-screen-lg mx-auto">
        <h1 class="font-bold text-xl">Minecraft Command Combiner</h1>
      </div>
    </header>
    <main class="px-5 pt-10">
      <div class="max-w-screen-lg mx-auto">
        <div class="flex flex-col gap-4">
          <div class="mb-5">
            <h3 for="options" class="mb-2 font-semibold text-xl">Settings</h3>
            <div id="options" class="flex flex-col">
              <!-- <div>
                <input
                  type="checkbox"
                  id="prepend-gamerule"
                  class="mr-2"
                  v-model="options.prependGamerule"
                />
                <label for="prepend-gamerule"
                  >Prepend
                  <span class="font-mono text-sm">/gamerule commandBlockOutput false</span></label
                >
              </div> -->
              <div>
                <input
                  type="checkbox"
                  id="global-coords"
                  class="mr-2"
                  v-model="options.globalCoordinates"
                />
                <label for="global-coords">Enable global coordinates feature</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="remove-dquotes"
                  class="mr-2"
                  v-model="options.removeDoubleQuotes"
                />
                <label for="remove-dquotes">Remove unnecessary double quotes</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="escape-dquotes"
                  class="mr-2"
                  v-model="options.escapeDoubleQuotes"
                />
                <label for="escape-dquotes"
                  >Try to escape double quites in commands inside commands (disable this if it
                  causes troubles)</label
                >
              </div>
            </div>
          </div>
          <div class="mb-5">
            <h2 class="mb-2 font-semibold text-xl">Commands (to run in order on setup)</h2>
            <textarea
              ref="inputarea"
              rows="10"
              v-model="commandLines"
              class="w-full p-2 bg-white font-mono text-sm border shadow-sm resize-none rounded"
            />
          </div>
          <div class="mb-5">
            <div class="flex gap-4 items-center mb-2">
              <h2 class="font-semibold text-xl">Output</h2>
              <button
                class="px-2 py-1 bg-green-600 font-medium text-sm text-white shadow-md rounded active:translate-y-[1px]"
                @click="copyOutput"
              >
                Copy to Clipboard
              </button>
              <button
                class="px-2 py-1 bg-green-600 font-medium text-sm text-white shadow-md rounded active:translate-y-[1px]"
                @click="copyEggOutput"
              >
                Copy egg to Clipboard
              </button>
              <span v-if="clipboard.copied.value" class="font-medium">Done.</span>
            </div>
            <p
              class="w-full p-2 font-mono text-xs break-all border shadow rounded whitespace-break-spaces"
            >
              {{ commandStr }}
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

// ผมทำเพื่อระบาย... จะไปลงในเซิฟ kaboom.pw
