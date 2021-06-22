import { useAtom } from "jotai";
import { positionsHistoryAtom } from "../../../store/store";
import { getDomeOfPositionsAround } from "../../../utils/constants";
import { PlayerType } from "./Youtubes";

export function findAdjacentUnoccupiedPositionsTo(
  position: [number, number, number],
  players: PlayerType[]
): [number, number, number][] {
  // given all players and the current position, find the adjacent players ()
  const allPlayerPositions = players.map((p) => p.position);
  const allPlayerPositionsStringified = JSON.stringify(allPlayerPositions);
  const allAdjacentPositions = getDomeOfPositionsAround(position);
  const unoccupiedAdjacentPositions = allAdjacentPositions.filter(
    (p) => !allPlayerPositionsStringified.includes(JSON.stringify(p))
  );

  return unoccupiedAdjacentPositions;
}

// ! doesn't work -- too unlikely to generate a valid url
/**generate an 11 character youtube video ID.
 * It might not be valid...
 */
export function getRandomVideoId() {
  const codeLength = 11;
  const possibles =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-_";
  let code = "";
  for (let i = 0; i < codeLength; i++) {
    code += possibles.charAt(Math.floor(Math.random() * possibles.length));
  }
  return code;
}

export const useCurrentPosition = () => {
  const [positionsHistory] = useAtom(positionsHistoryAtom);

  return positionsHistory[positionsHistory.length - 1];
};
