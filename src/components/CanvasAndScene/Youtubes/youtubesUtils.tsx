import { getDomeOfPositionsAround } from "../../../utils/constants";
import { PlayerType } from "./Youtubes";

export function findAdjacentUnoccupiedPositionsTo(
  position: [number, number, number],
  players: PlayerType[]
): [number, number, number][] {
  // given all players and the current position, find the adjacent players ()
  const playerPositions = players.map((p) => p.position);
  const allAdjacentPositions = getDomeOfPositionsAround(position);
  const unoccupiedAdjacentPositions = allAdjacentPositions.filter(
    (p) => !playerPositions.includes(p)
  );

  return unoccupiedAdjacentPositions;
}
