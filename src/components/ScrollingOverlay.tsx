import { useStore } from "./store/store";
import { NUM_ANIMATION_STEPS } from "../utils/constants";
import styled from "styled-components/macro";
import { HEIGHT_MULTIPLIER } from "./ScrollHandler";
import { animated, useSpring } from "@react-spring/web";
import { useWindowSize } from "../utils/hooks";
const WIDTH_PX = 100;

export function ScrollingOverlaySimple() {
  // scroll overlay height is 10x window height
  const { height } = useWindowSize();
  const totalScrollableHeight = height * HEIGHT_MULTIPLIER;
  const numberIndicatorHeight =
    totalScrollableHeight / (NUM_ANIMATION_STEPS + 2);
  const scrollY = useStore((s) => s.scrollY);
  const isScrolling = useStore((s) => s.isScrolling);

  const translateY = 2 * numberIndicatorHeight - scrollY;
  const spring = useSpring({
    opacity: isScrolling ? 0.5 : 0,
    transform: `translateY(${translateY}px)`,
  });
  return (
    <SOStyles {...{ numberIndicatorHeight }}>
      <animated.div className="animated" style={spring}>
        {[...Array(NUM_ANIMATION_STEPS)].map((_, idx) => {
          const numDisplay = NUM_ANIMATION_STEPS - idx - 1;
          return (
            <div
              className="numIndicator"
              style={{
                transform: `translate(${0}px,${idx * numberIndicatorHeight}px)`,
              }}
              key={idx}
            >
              {1 > numDisplay || numDisplay > 20 ? null : numDisplay}
              <div
                className={`tickWrapper${idx === 0 ? " first" : ""}${
                  idx === NUM_ANIMATION_STEPS - 1 ? " last" : ""
                }`}
              />
            </div>
          );
        })}
      </animated.div>
    </SOStyles>
  );
}
const SOStyles = styled.div`
  height: 100vh;
  pointer-events: none;
  .animated {
    height: ${HEIGHT_MULTIPLIER * 100}%;
  }
  .numIndicator {
    color: silver;
    font-size: 48px;
    height: ${(p) => p.numberIndicatorHeight}px;
    z-index: 999;
    pointer-events: none;
    width: ${WIDTH_PX}px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    margin-left: 16px;
    .tickWrapper {
      position: relative;
      margin-top: -28px;
      &:not(.last)::after {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        right: -10px;
        width: 50px;
        height: 2px;
        background: white;
      }
    }
  }
`;

// export default function ScrollingOverlay() {
//   const rot = useControl("rot", {
//     type: "number",
//     min: -10,
//     max: 10,
//     value: 1.47,
//   });

//   return (
//     <mesh>
//       {[...Array(22)].map((_, idx) => (
//         <NumberIndicator key={idx} num={idx} {...{ rot }} />
//       ))}
//     </mesh>
//   );
// }

// const degToRad = (THREE as any).Math.degToRad;

// function NumberIndicator({ num, rot }) {
//   const isTabletOrLarger = useMediaQuery(`(min-width: ${768}px)`);
//   const isDesktopOrLarger = useMediaQuery(`(min-width: ${1000}px)`);
//   const width = isDesktopOrLarger ? 20 : isTabletOrLarger ? 15 : 10;
//   const height = 5;
//   const depth = 0.2;

//   const animationStep = useAnimationStep();
//   // const rotX = (-rot * num + -0.4 * animationStep) / Math.PI;
//   // const translateY = -Math.sin(animationStep / NUM_ANIMATION_STEPS);
//   const heightIndex = num - animationStep;

//   const ref = useRef(null as any);
//   // const springProps = useSpring({
//   //   rotX,
//   //   translateY,
//   //   onFrame: ({ rotX, translateY }) => {
//   //     ref.current.rotation.x =
//   //       degToRad(90) * 0.14 * (num - animationStep);
//   //     // ref.current.translateY = translateY;
//   //   },
//   // });

//   const [x, y, z] = [
//     degToRad(90) * 0.14 * heightIndex,
//     -heightIndex * height,
//     -0.58 * heightIndex ** 2.04,
//   ];

//   const [position, setPosition] = useState([x, y, z]);

//   useFrame(() => {
//     setPosition([x, y, z]);
//     // ref.current.rotation.x = degToRad(90) * 0.14 * heightIndex;
//     // ref.current.position.y = -heightIndex * height;
//     // ref.current.position.z = -0.58 * heightIndex ** 2.04;
//   });

//   return (
//     <mesh
//       ref={ref}
//       position={position}
//       // {...{
//       //   // position: [0, -heightIndex * height, -0.58 * heightIndex ** 2.04],
//       //   position,
//       //   // rotation: [degToRad(90) * 0.14 * heightIndex, 0, 0],
//       //   // translate: [0, 10, 0],
//       // }}
//     >
//       <boxBufferGeometry args={[width, height, depth]} position={position} />
//       <meshLambertMaterial color={"red"} />
//     </mesh>
//   );
// }
