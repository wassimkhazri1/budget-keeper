import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesBackground = ({ bgColor = "#e2d1d1ff" }) => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine); // Load the full particles.js library
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          // color: "#000000", // Black background (change as needed)
          //  color: "#e2d1d1ff", // Black background (change as needed)
          color: bgColor, // Utilise la couleur passée en prop
        },
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            // value: "#ffffff", // White dots
             value: "#cc2222ff", // red dots
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: 0.5,
            random: false,
          },
          size: {
            value: 3,
            random: true,
          },
          line_linked: {
            enable: true,
            distance: 150, // Distance between linked dots
            color: "#ffffff",
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2, // Slower movement
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "repulse", // Dots repel on hover
            },
            onclick: {
              enable: true,
              mode: "push", // Push dots on click
            },
          },
        },
      }}
    />
  );
};

export default ParticlesBackground;