import React, { useState, useEffect, useRef } from "react";

type AnimatedAsciiArtProps = object;

const AnimatedAsciiArt: React.FC<AnimatedAsciiArtProps> = () => {
  const [hoveredChars, setHoveredChars] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [animatedChars, setAnimatedChars] = useState<{ [key: string]: string }>(
    {},
  );
  const animationFrameRef = useRef<number>();

  const asciiChars = '!@#$%^&*()_+{}|:"<>?';

  const baseAsciiArt = `
 ███████╗██████╗  █████╗ ███╗   ██╗ ██████╗██╗███████╗
 ██╔════╝██╔══██╗██╔══██╗████╗  ██║██╔════╝██║██╔════╝
 █████╗  ██████╔╝███████║██╔██╗ ██║██║     ██║███████╗
 ██╔══╝  ██╔══██╗██╔══██║██║╚██╗██║██║     ██║╚════██║
 ██║     ██║  ██║██║  ██║██║ ╚████║╚██████╗██║███████║
 ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚═╝╚══════╝

 ██████╗  █████╗  ██████╗ ██╗   ██╗██╗      █████╗ ██╗   ██╗ █████╗ ███╗   ██╗
 ██╔══██╗██╔══██╗██╔════╝ ██║   ██║██║     ██╔══██╗╚██╗ ██╔╝██╔══██╗████╗  ██║
 ██████╔╝███████║██║  ███╗██║   ██║██║     ███████║ ╚████╔╝ ███████║██╔██╗ ██║
 ██╔═══╝ ██╔══██║██║   ██║██║   ██║██║     ██╔══██║  ╚██╔╝  ██╔══██║██║╚██╗██║
 ██║     ██║  ██║╚██████╔╝╚██████╔╝███████╗██║  ██║   ██║   ██║  ██║██║ ╚████║
 ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝



                    Systems Automation Engineer
`.split("\n");

  // Function to animate a single character at the specified position
  const animateChar = (charKey: string) => {
    let frameCount = 0;

    // Animation loop function
    const animate = () => {
      frameCount++;
      // Stop animation after 15 frames
      if (frameCount > 15) {
        setHoveredChars((prev) => ({ ...prev, [charKey]: false }));
        setAnimatedChars((prev) => ({ ...prev, [charKey]: "" }));
        return;
      }
      // Update the character with a random one
      setAnimatedChars((prev) => ({ ...prev, [charKey]: getRandomChar() }));
      // Schedule next frame
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  // Cleanup effect to cancel any ongoing animations when component unmounts
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handler for mouse hover over characters
  const handleCharHover = (charKey: string) => {
    setHoveredChars((prev) => ({ ...prev, [charKey]: true }));
    animateChar(charKey);
  };

  // Helper function to get a random character from asciiChars
  const getRandomChar = () => {
    return asciiChars[Math.floor(Math.random() * asciiChars.length)];
  };

  return (
    <div className="whitespace-pre font-mono">
      {baseAsciiArt.map((line, lineIndex) => {
        // Check if current line is the job title
        const isJobTitle = line.includes(" Systems Automation Engineer");

        return (
          <div key={lineIndex} className="leading-none">
            {Array.from(line).map((char, charIndex) => {
              // Create unique key for each character position
              const charKey = `${lineIndex}-${charIndex}`;
              // Determine if this character is currently animating
              const isAnimatingChar = hoveredChars[charKey] && char !== " ";

              return (
                <span
                  key={charKey}
                  className={`transition-colors duration-150 ${
                    // Different colors for job title, animating chars, and regular text
                    isJobTitle
                      ? "text-green-400"
                      : isAnimatingChar
                      ? "text-green-500"
                      : "text-blue-500"
                  }`}
                  onMouseEnter={() => handleCharHover(charKey)}
                >
                  {/* Show either the animated character or original character */}
                  {isAnimatingChar ? animatedChars[charKey] || char : char}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default AnimatedAsciiArt;
