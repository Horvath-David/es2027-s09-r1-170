"use client"

import { JSON_SERVER_URL } from "@/app/constants"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Project } from "@/lib/types"
import { cn } from "@/lib/utils"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowBigDown,
  ArrowBigLeft,
  ArrowBigRight,
  ArrowBigUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Loader2,
  Pause,
  Play,
  WindIcon,
  X,
} from "lucide-react"
import { useParams } from "next/navigation"
import { Fragment, useEffect, useMemo, useState } from "react"

export function ProjectPage() {
  const { id } = useParams()

  const [windDir, setWindDir] = useState("N")
  const [windSpeed, setWindSpeed] = useState(10)
  const [open, setOpen] = useState(true)

  const [isSimRunning, setIsSimRunning] = useState(false)
  const [turbineMap, setTurbineMap] = useState(
    Array(20).fill(Array(20).fill(false)),
  )
  const [selectedTurbine, setSelectedTurbine] = useState<{
    x: number
    y: number
  }>()

  const { data, isFetching } = useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      const response = await fetch(`${JSON_SERVER_URL}/projects/${id}`)
      return (await response.json()) as Project
    },
  })

  const exclusionMap = useMemo(() => {
    const map: number[][] = Array(20).fill(Array(20).fill(0))

    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 20; y++) {
        if (turbineMap[x][y]) {
          if (x - 1 >= 0 && y - 1 >= 0)
            map[x - 1] = map[x - 1].map((x, i) => (i == y - 1 ? x + 1 : x))
          if (x >= 0 && y - 1 >= 0)
            map[x] = map[x].map((x, i) => (i == y - 1 ? x + 1 : x))
          if (x + 1 <= 19 && y - 1 >= 0)
            map[x + 1] = map[x + 1].map((x, i) => (i == y - 1 ? x + 1 : x))
          if (x - 1 >= 0 && y >= 0)
            map[x - 1] = map[x - 1].map((x, i) => (i == y ? x + 1 : x))
          if (x + 1 <= 19 && y >= 0)
            map[x + 1] = map[x + 1].map((x, i) => (i == y ? x + 1 : x))
          if (x - 1 >= 0 && y + 1 <= 19)
            map[x - 1] = map[x - 1].map((x, i) => (i == y + 1 ? x + 1 : x))
          if (x >= 0 && y + 1 <= 19)
            map[x] = map[x].map((x, i) => (i == y + 1 ? x + 1 : x))
          if (x + 1 <= 19 && y + 1 <= 19)
            map[x + 1] = map[x + 1].map((x, i) => (i == y + 1 ? x + 1 : x))
        }
      }
    }

    return map
  }, [turbineMap])

  const modifierMap = useMemo(() => {
    const map: { [index: string]: { type: string; amount: number }[] } = {}

    if (!isSimRunning) return map

    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 20; y++) {
        if (turbineMap[x][y]) {
          const list: { type: string; amount: number }[] = []
          if (
            getUpwindTile({ x, y }, windDir, 1) == "Lake" ||
            getUpwindTile({ x, y }, windDir, 2) == "Lake"
          ) {
            list.push({ type: "lake", amount: 0.2 })
          }

          if (
            getUpwindTile({ x, y }, windDir, 1) == "Mountain" ||
            getUpwindTile({ x, y }, windDir, 2) == "Mountain" ||
            getUpwindTile({ x, y }, windDir, 3) == "Mountain" ||
            getUpwindTile({ x, y }, windDir, 4) == "Mountain" ||
            getUpwindTile({ x, y }, windDir, 5) == "Mountain"
          ) {
            list.push({ type: "mountain", amount: -0.3 })
          }

          if (
            getUpwindTile({ x, y }, windDir, 1) == "Turbine" ||
            getUpwindTile({ x, y }, windDir, 2) == "Turbine" ||
            getUpwindTile({ x, y }, windDir, 3) == "Turbine"
          ) {
            list.push({ type: "turbine", amount: -0.15 })
          }
          map[`${x},${y}`] = list
        }
      }
    }

    return map
  }, [turbineMap, windDir, isSimRunning])

  const powerMap = useMemo(() => {
    const map: number[][] = Array(20).fill(Array(20).fill(undefined))

    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 20; y++) {
        if (turbineMap[x][y] && modifierMap[`${x},${y}`]) {
          map[x] = map[x].map((val, i) =>
            i == y ? calculatePower({ x, y }, windSpeed) : val,
          )
        }
      }
    }

    return map
  }, [turbineMap, modifierMap, windSpeed])

  const colorMap = useMemo(() => {
    const map: string[][] = Array(20).fill(
      Array(20).fill("hsl(0 100% 50% / 0)"),
    )

    if (!isSimRunning) return map

    const powerValues = powerMap.flat().filter((x) => !isNaN(x))
    const max = Math.max(...powerValues)
    const min = Math.min(...powerValues)
    const diff = max - min

    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 20; y++) {
        if (powerMap[x][y] !== undefined) {
          if (diff == 0) {
            map[x] = map[x].map((x, i) => (i == y ? "hsl(90 100% 50% / 1)" : x))
          } else {
            const currDiff = max - powerMap[x][y]
            const hue = ((diff - currDiff) / diff) * 90
            map[x] = map[x].map((x, i) =>
              i == y ? `hsl(${hue} 100% 50% / 1)` : x,
            )
          }
        }
      }
    }

    return map
  }, [isSimRunning, powerMap])

  async function startSim() {
    setIsSimRunning(true)
  }

  function stopSim() {
    setIsSimRunning(false)
    setSelectedTurbine(undefined)
  }

  function handleTileClick(x: number, y: number) {
    if (isFetching) {
      return
    }

    if (isSimRunning) {
      if (getTileType({ x, y }) != "Turbine") return
      setSelectedTurbine({ x, y })
      setOpen(true)
      return
    }

    if (
      ((data?.cells ?? []).find((cell) => cell.x === x && cell.y === y)?.type ??
        "Grass") != "Grass" ||
      exclusionMap[x][y] > 0
    ) {
      return
    }

    if (turbineMap[x][y]) {
      setTurbineMap((prev) => {
        const _new = [...prev.map((old) => [...old])]
        _new[x][y] = false
        return _new
      })
    } else {
      setTurbineMap((prev) => {
        const _new = [...prev.map((old) => [...old])]
        _new[x][y] = true
        return _new
      })
    }
  }

  function getTileType(pos: { x: number; y: number }) {
    if (pos.x < 0 || pos.x > 19 || pos.y < 0 || pos.y > 19) return "Grass"
    if (turbineMap[pos.x][pos.y]) return "Turbine"
    return (
      (data?.cells ?? []).find((cell) => cell.x === pos.x && cell.y === pos.y)
        ?.type ?? "Grass"
    )
  }

  function getUpwindTile(
    pos: { x: number; y: number },
    dir: string,
    offset: number = 1,
  ) {
    if (dir == "N") pos = { x: pos.x, y: pos.y - offset }
    if (dir == "S") pos = { x: pos.x, y: pos.y + offset }
    if (dir == "E") pos = { x: pos.x + offset, y: pos.y }
    if (dir == "W") pos = { x: pos.x - offset, y: pos.y }

    return getTileType(pos)
  }

  function calculatePower(pos: { x: number; y: number }, windSpeed: number) {
    const modifiers = modifierMap[`${pos.x},${pos.y}`]
    const finalMod = (modifiers?.reduce((a, b) => a + b.amount, 0) ?? 0) + 1
    const effWindSpeed = windSpeed * finalMod

    if (effWindSpeed < 3) return 0
    if (effWindSpeed >= 3 && effWindSpeed < 12)
      return (1500 * ((effWindSpeed - 3) / (12 - 3))) ^ 3
    if (effWindSpeed >= 12 && effWindSpeed < 25) return 1500
    if (effWindSpeed >= 25) return 0

    return 0
  }

  useEffect(() => {
    console.log({ powerMap, modifierMap })
  }, [powerMap, modifierMap])

  return (
    <div
      className={cn(
        "w-full h-full flex gap-4 items-center justify-center",
        !isFetching && "items-start",
      )}
    >
      {isFetching && <Loader2 className='animate-spin' size={32} />}
      {!isFetching && (
        <>
          <Card className='flex-[3] overflow-clip w-full aspect-square relative'>
            <img
              src={data?.mapData}
              alt='Project map'
              className='w-full h-full absolute'
            />
            <div className='absolute w-full h-full bg-[linear-gradient(to_right,#00000033_1px,transparent_1px),linear-gradient(to_bottom,#00000033_1px,transparent_1px)] bg-[top_left] bg-[5%_100%,100%_5%] border-[#00000033]'></div>

            <div className='absolute w-full h-full grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)]'>
              {Array(20)
                .fill(0)
                .map((_, y) => (
                  <Fragment key={y}>
                    {Array(20)
                      .fill(0)
                      .map((_, x) => {
                        const isSelected = selectedTurbine
                          ? selectedTurbine.x === x && selectedTurbine.y === y
                          : false

                        return (
                          <div
                            key={`${x},${y}`}
                            className={cn(
                              "flex select-none items-center justify-center",
                              isSelected && "outlined-turbine",
                              ((!isSimRunning &&
                                (data?.cells ?? []).find(
                                  (cell) => cell.x === x && cell.y === y,
                                )?.type === "Grass" &&
                                exclusionMap[x][y] <= 0) ||
                                turbineMap[x][y]) &&
                                "hover:!bg-white/50 cursor-pointer",
                            )}
                            onClick={() => handleTileClick(x, y)}
                            style={{
                              background: colorMap[x][y],
                            }}
                          >
                            {turbineMap[x][y] ? (
                              <img
                                src='/wind_turbine.png'
                                className='w-full h-full'
                              />
                            ) : (data?.cells ?? []).find(
                                (cell) => cell.x === x && cell.y === y,
                              )?.type === "Grass" && exclusionMap[x][y] > 0 ? (
                              <img
                                src='/exclusion_zone.png'
                                className='w-full h-full'
                              />
                            ) : (
                              <div className='text-white/50'>
                                {windDir === "N" && <ArrowDown />}
                                {windDir === "E" && <ArrowLeft />}
                                {windDir === "S" && <ArrowUp />}
                                {windDir === "W" && <ArrowRight />}
                              </div>
                            )}
                          </div>
                        )
                      })}
                  </Fragment>
                ))}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                  <DialogHeader className='border-b pb-6 -mx-6 px-6'>
                    <DialogTitle className='flex items-center gap-4 text-xl leading-none'>
                      <WindIcon />
                      <span className='mb-0.5'>Turbine at </span>
                      <code className='text-sm bg-muted py-1 px-4 rounded-md border border-foreground/20'>
                        {selectedTurbine?.x} ; {selectedTurbine?.y}
                      </code>
                    </DialogTitle>
                  </DialogHeader>

                  <div className='flex flex-col my-2 gap-6'>
                    <div className='flex gap-6'>
                      <Card
                        className='flex flex-col justify-between gap-4 p-4 flex-1 w-full'
                        style={{
                          background: colorMap[selectedTurbine?.x ?? 0][
                            selectedTurbine?.y ?? 0
                          ].replace("1)", "0.1)"),
                        }}
                      >
                        <span className='font-semibold text-lg text-muted-foreground'>
                          Power output:
                        </span>
                        <span className='ml-auto text-2xl font-semibold'>
                          {powerMap[selectedTurbine?.x ?? 0][
                            selectedTurbine?.y ?? 0
                          ]?.toFixed(2)}{" "}
                          kW
                        </span>
                      </Card>

                      <Card className='flex flex-col justify-between gap-4 p-4 flex-1 w-full'>
                        <span className='font-semibold text-lg text-muted-foreground'>
                          Final modifier:
                        </span>
                        {(() => {
                          const sum = modifierMap[
                            `${selectedTurbine?.x ?? 0},${selectedTurbine?.y ?? 0}`
                          ]?.reduce((a, b) => a + b.amount, 0)

                          return (
                            <span
                              className={cn(
                                "ml-auto text-2xl font-semibold",
                                sum > 0 && "text-green-500",
                                sum < 0 && "text-red-500",
                              )}
                            >
                              {sum > 0 ? "+" : ""}
                              {(sum * 100).toFixed(1)}%
                            </span>
                          )
                        })()}
                      </Card>
                    </div>
                    {modifierMap[
                      `${selectedTurbine?.x ?? 0},${selectedTurbine?.y ?? 0}`
                    ]?.length > 0 && (
                      <Card className='flex flex-col justify-between gap-4 p-4 flex-1 w-full'>
                        <span className='font-semibold text-lg border-b -mx-4 px-4 pb-4'>
                          Modifier list:
                        </span>

                        <ul>
                          {modifierMap[
                            `${selectedTurbine?.x ?? 0},${selectedTurbine?.y ?? 0}`
                          ]?.map(({ type, amount }) => (
                            <li className='flex items-center gap-2'>
                              <span>
                                {{
                                  lake: "Lake wind boost",
                                  mountain: "Mountain wind block",
                                  turbine: "Upwind turbine interference",
                                }[type] ?? "Unknown modifier"}
                              </span>
                              <span
                                className={cn(
                                  "ml-auto text-lg font-semibold",
                                  amount > 0 && "text-green-500",
                                  amount < 0 && "text-red-500",
                                )}
                              >
                                {amount > 0 ? "+" : ""}
                                {(amount * 100).toFixed(1)}%
                              </span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}
                  </div>

                  <DialogFooter className='border-t -mx-6 px-6 pt-6'>
                    <Button className='w-full' onClick={() => setOpen(false)}>
                      <X /> Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
          <Card className='flex-[2] flex flex-col'>
            <CardHeader className='border-b'>
              <CardTitle className='text-lg'>
                <span className='font-normal text-muted-foreground'>
                  Project name:
                </span>{" "}
                {data?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className='flex-1 pt-6'>
              <div className='mb-2 font-medium'>Wind direction:</div>
              <Tabs
                className='w-full'
                value={windDir}
                onValueChange={setWindDir}
              >
                <TabsList className='w-full justify-between'>
                  <TabsTrigger
                    value='N'
                    className='flex gap-1'
                    disabled={isSimRunning}
                  >
                    <ArrowBigDown size={18} />
                    North
                  </TabsTrigger>
                  <TabsTrigger
                    value='E'
                    className='flex gap-1'
                    disabled={isSimRunning}
                  >
                    <ArrowBigLeft size={18} />
                    East
                  </TabsTrigger>
                  <TabsTrigger
                    value='S'
                    className='flex gap-1'
                    disabled={isSimRunning}
                  >
                    <ArrowBigUp size={18} />
                    South
                  </TabsTrigger>
                  <TabsTrigger
                    value='W'
                    className='flex gap-1'
                    disabled={isSimRunning}
                  >
                    <ArrowBigRight size={18} />
                    West
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className='mb-2 mt-4 font-medium'>
                Wind speed: {windSpeed} m/s
              </div>
              <Slider
                value={[windSpeed]}
                onValueChange={(val) => setWindSpeed(val[0])}
                min={0}
                max={40}
                disabled={isSimRunning}
              />
            </CardContent>
            <CardFooter className='border-t pt-6'>
              {!isSimRunning && (
                <Button className='w-full' onClick={startSim}>
                  <Play />
                  Run simulation
                </Button>
              )}

              {isSimRunning && (
                <Button
                  variant='destructive'
                  className='w-full'
                  onClick={stopSim}
                >
                  <Pause />
                  Stop simulation
                </Button>
              )}
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}
