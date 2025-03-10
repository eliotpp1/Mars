import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { Stars } from "../../components/Stars";
import { SceneObject } from "../../components/SceneObject";
import { AnimatedHuman } from "../../components/AnimatedHuman";
import { CameraSetup } from "../../components/CameraSetup";
import { useNavigate } from "react-router-dom";
import { useSound } from "../../context/SoundContext";
import API_URL from "../../constants/api";

export const Scene = ({
  setBirdFound,
  setMonkeyFound,
  birdFound,
  monkeyFound,
  frogFound,
  q1Found,
  q2Found,
  setAnimationComplete,
  animationComplete

}) => {
  const navigate = useNavigate();
  const cameraRef = useRef();
  const birdRef = useRef();
  const humanRef = useRef();
  const rocketRef = useRef();
  const monkeyRef = useRef();
  const { isMuted } = useSound();

  const frogRef = useRef();
  const [launched, setLaunched] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [isWalking, setIsWalking] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [cameraTarget, setCameraTarget] = useState([65, 0, -47]);

  const ambianceSound = new Audio("/assets/sounds/soundTerre.mp3");
  const clickSound = new Audio("/assets/sounds/click.mp3");
  const takeOffSound = new Audio("/assets/sounds/takeoff.mp3");

  useEffect(() => {
    if (localStorage.getItem("selectedVehicle") === null) {
      localStorage.setItem("selectedVehicle", 0);
    }
    fetchVehicle();
  }, []);

  useEffect(() => {
    if (!isMuted) {
      ambianceSound.loop = true;
      ambianceSound.volume = 0.09;
      ambianceSound.play();
    } else {
      ambianceSound.pause();
    }
    return () => {
      ambianceSound.pause();
    };
  }, [isMuted]);
  const fetchVehicle = async () => {
    let id = parseInt(localStorage.getItem("selectedVehicle")) + 1;
    const response = await fetch(`${API_URL}/vehicles/${id}`);
    const data = await response.json();
    setVehicle(data.model);
  };

  const tempCameraTarget = useRef({ x: 65, y: 0, z: -47 });

  useEffect(() => {
    if (q2Found) {
      setIsWalking(true);
      gsap
        .timeline()
        .to(humanRef.current.position, {
          z: 0,
          duration: 2,
          ease: "power2.inOut",
        })
        .to(humanRef.current.rotation, {
          y: 4.5,
          duration: 0.5,
          ease: "power1.out",
        })
        .to(humanRef.current.position, {
          x: 0,
          duration: 3,
          ease: "power2.inOut",
          onComplete: () => {
            setIsWalking(false);
            setIsVisible(false);
            setAnimationComplete(true);
          },
        });
      gsap
        .timeline()
        .to(cameraRef.current.position, {
          x: 20,
          y: 10,
          z: -20,
          duration: 2,
          ease: "power2.inOut",
        })
        .to(
          tempCameraTarget.current,
          {
            x: 0,
            y: 2,
            z: 0,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
              setCameraTarget([
                tempCameraTarget.current.x,
                tempCameraTarget.current.y,
                tempCameraTarget.current.z,
              ]);
            },
          },
          "<"
        )
        .to(cameraRef.current.position, {
          x: 20,
          y: 10,
          z: -10,
          duration: 2,
          ease: "power2.inOut",
        });
    }
  }, [q2Found]);

  const handleBirdClick = () => {
    if (!birdFound) {
    clickSound.play();
    setBirdFound(true);
    setIsWalking(true);

    gsap.to(humanRef.current.position, {
      x: 35,
      duration: 3,
      ease: "power1.inOut",
      onComplete: () => {
        setIsWalking(false);
      },
    });

    gsap.to(birdRef.current.position, {
      y: 25,
      duration: 1.5,
      ease: "power1.out",
    });

    gsap.to(birdRef.current.rotation, {
      y: Math.PI * 2,
      duration: 2,
      ease: "power1.inOut",
    });

    gsap
      .timeline()
      .to(cameraRef.current.position, {
        x: 60,
        y: 10,
        z: -40,
        duration: 1,
        ease: "power2.inOut",
      })
      .to(cameraRef.current.position, {
        x: 50,
        y: 5,
        z: -48,
        duration: 1.5,
        ease: "power1.out",
      });

    gsap.to(tempCameraTarget.current, {
      x: 45,
      y: 5,
      z: -48,
      duration: 2,
      ease: "power1.inOut",
      onUpdate: function () {
        setCameraTarget([
          tempCameraTarget.current.x,
          tempCameraTarget.current.y,
          tempCameraTarget.current.z,
        ]);
      },
    });
  }
  };

  const handleMonkeyClick = () => {
    if (!monkeyFound && birdFound) {
    clickSound.play();
    setMonkeyFound(true);
    setIsWalking(true);

    const mainTimeline = gsap.timeline();

    mainTimeline
      .to(humanRef.current.position, {
        x: 15,
        duration: 2,
        ease: "power1.inOut",
      })
      .to(
        cameraRef.current.position,
        {
          x: 25,
          duration: 2,
          ease: "power1.inOut",
        },
        "<"
      )
      .to(
        tempCameraTarget.current,
        {
          x: 15,
          duration: 2,
          ease: "power1.inOut",
          onUpdate: function () {
            setCameraTarget([
              tempCameraTarget.current.x,
              tempCameraTarget.current.y,
              tempCameraTarget.current.z,
            ]);
          },
        },
        "<"
      )
      .to(humanRef.current.rotation, {
        y: 6,
        duration: 1,
        ease: "power1.inOut",
      })
      .to(
        cameraRef.current.position,
        {
          x: 15,
          y: 10,
          z: -60,
          duration: 1,
          ease: "power1.inOut",
        },
        "<"
      )
      .to(
        tempCameraTarget.current,
        {
          z: -25,
          duration: 1,
          ease: "power1.inOut",
          onUpdate: function () {
            setCameraTarget([
              tempCameraTarget.current.x,
              tempCameraTarget.current.y,
              tempCameraTarget.current.z,
            ]);
          },
        },
        "<"
      )
      .to(humanRef.current.position, {
        z: -22,
        duration: 2,
        ease: "power1.inOut",
        onComplete: () => {
          setIsWalking(false);
        },
      })
      .to(
        cameraRef.current.position,
        {
          z: -35,
          y: 5,
          duration: 2,
          ease: "power1.inOut",
        },
        "<"
      );
    }
  };

  const launchRocket = () => {
    if (!launched && q1Found && q2Found && animationComplete ) {
      // La fusée ne se lance que si les deux QCM sont réussis
      takeOffSound.play();
      setLaunched(true);
      gsap.to(rocketRef.current.position, {
        y: 30,
        duration: 4,
        ease: "power2.out",
        onComplete: () => {
          navigate("/Ciel");
        },
      });
    }
  };

  return (
    <>
      <color attach="background" args={["#000020"]} />
      <Stars />

      <CameraSetup
        cameraRef={cameraRef}
        cameraPosition={[75, 5, -48]}
        cameraTarget={cameraTarget}
      />

      <SceneObject
        modelPath="/assets/models/terre/terre.glb"
        position={[18, -2, -4]}
        scale={2}
      />
      {isVisible && (
        <AnimatedHuman
          position={[65, -2, -46]}
          rotation={[0, 4.7, 0]}
          scale={1}
          ref={humanRef}
          isWalking={isWalking}
        />
      )}

      <SceneObject
        modelPath="/assets/models/terre/bird.glb"
        position={[97, 20, -61]}
        scale={5}
        onClick={handleBirdClick}
        cursor="pointer"
        meshRef={birdRef}
      />

      <SceneObject
        modelPath="/assets/models/terre/snake.glb"
        position={[65, 0.3, -35]}
        rotation={[0, 3, 0]}
        scale={3}
      />

      <SceneObject
        modelPath="/assets/models/terre/tiger.glb"
        position={[50, -2, -55]}
        rotation={[0, 1.4, 0]}
        scale={1.3}
      />

      <SceneObject
        modelPath="/assets/models/terre/singe.glb"
        position={[38, -1.7, -22]}
        rotation={[0, Math.PI / 2, 0]}
        scale={5}
        onClick={handleMonkeyClick}
        cursor="pointer"
        meshRef={monkeyRef}
      />

      <SceneObject
        modelPath="/assets/models/terre/frog.glb"
        position={[-50.5, 31.9, 25]}
        rotation={[-0.2, 4, 0]}
        scale={10}
        ref={frogRef}
      />

      <SceneObject
        modelPath={vehicle || "/assets/models/vehicles/rocket.glb"}
        position={[0, 2, 0]}
        scale={10}
        onClick={launchRocket}
        meshRef={rocketRef}
      />

      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-5, 5, 5]} intensity={1} />
    </>
  );
};
