import Plane from "./Plane";

const Walls = () => {
  const worldDepth = 8;
  // const worldWidth = 8;
  // can't use useWindowSize -- Plane doesn't cooperate with changing width/height
  const worldWidth = (Math.min(900, window.innerWidth) / 736) * 6;
  // const worldHeight = 8;
  const worldHeight = (Math.min(900, window.innerHeight) / 736) * 6;

  const walls = [
    // {/* behind (back wall) */}
    {
      rotation: [0 * Math.PI, 0, 0],
      position: [0, -0, -worldDepth],
      width: worldWidth,
      height: worldHeight,
    },
    // {/* in front (camera-side) */}
    {
      rotation: [0, -1 * Math.PI, 0],
      position: [0, -0, worldDepth / 2],
      width: worldWidth,
      height: worldHeight,
    },
    // {/* left */}
    {
      rotation: [0, 0.5 * Math.PI, 0],
      position: [-worldWidth, 0, 0],
      width: worldDepth,
      height: worldHeight,
    },
    // {/* right */}
    {
      rotation: [0, -0.5 * Math.PI, 0],
      position: [worldWidth, -0, 0],
      width: worldDepth,
      height: worldHeight,
    },
    // {/* floor */}
    {
      rotation: [-0.5 * Math.PI, 0, 0],
      position: [0, -worldHeight, 0],
      width: worldWidth,
      height: worldDepth,
    },
    // {/* ceiling */}
    {
      rotation: [0.5 * Math.PI, 0, 0],
      position: [0, worldHeight, 0],
      width: worldWidth,
      height: worldDepth,
    },
  ];

  return (
    <>
      {walls.map((props, idx) => (
        <Plane key={idx} {...props} />
      ))}
    </>
  );
};

export default Walls;
