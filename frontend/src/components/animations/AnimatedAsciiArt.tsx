import React, { useState, useEffect, useRef, useCallback, memo } from "react";

// Define the props interface for the component
interface AnimatedAsciiArtProps {
  className?: string; // Optional custom class name
  textColor?: string; // Color for normal text
  highlightColor?: string; // Color for animated text
  titleColor?: string; // Color for the job title
}

const AnimatedAsciiArt: React.FC<AnimatedAsciiArtProps> = ({
  className = "",
  textColor = "text-blue-500",
  highlightColor = "text-green-500",
  titleColor = "text-green-400",
}) => {
  // Track which characters are currently being hovered
  const [hoveredChars, setHoveredChars] = useState(new Set<string>());

  // Store the current animated character for each position
  const [animatedChars, setAnimatedChars] = useState(new Map<string, string>());

  // Keep track of animation frame IDs for cleanup
  const animationsRef = useRef(new Map<string, number>());

  // Characters to use in the animation effect
  const asciiChars = '!@#$%^&*()_+{}|:"<>?';

  // The main ASCII art content, split into lines
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

  // Generate a random character for the animation effect
  const getRandomChar = useCallback(() => {
    return asciiChars[Math.floor(Math.random() * asciiChars.length)];
  }, [asciiChars]);

  // Clean up a specific character's animation
  const cleanupAnimation = useCallback((charKey: string) => {
    const animationId = animationsRef.current.get(charKey);
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationsRef.current.delete(charKey);
    }
  }, []);

  // Handle the animation of a single character
  const animateChar = useCallback(
    (charKey: string) => {
      let frameCount = 0;

      const animate = () => {
        frameCount++;

        // Stop animation after 15 frames
        if (frameCount > 15) {
          cleanupAnimation(charKey);
          // Remove character from hover state
          setHoveredChars((prev) => {
            const next = new Set(prev);
            next.delete(charKey);
            return next;
          });
          // Remove animated character
          setAnimatedChars((prev) => {
            const next = new Map(prev);
            next.delete(charKey);
            return next;
          });
          return;
        }

        // Update the animated character with a new random one
        setAnimatedChars((prev) => {
          const next = new Map(prev);
          next.set(charKey, getRandomChar());
          return next;
        });

        // Schedule next animation frame and store its ID
        const frameId = requestAnimationFrame(animate);
        animationsRef.current.set(charKey, frameId);
      };

      // Clean up any existing animation for this character
      cleanupAnimation(charKey);

      // Start the new animation
      animate();
    },
    [getRandomChar, cleanupAnimation],
  );

  // Clean up animations on component unmount
  useEffect(() => {
    // Capture the ref value inside the effect
    const animations = animationsRef.current;
    return () => {
      // Use the captured value in cleanup
      animations.forEach((frameId) => {
        cancelAnimationFrame(frameId);
      });
    };
  }, []);

  // Memoized individual character component for better performance
  const AsciiChar = memo(
    ({
      char,
      charKey,
      isJobTitle,
    }: {
      char: string;
      charKey: string;
      isJobTitle: boolean;
    }) => {
      // Determine if this character is currently animating
      const isAnimatingChar = hoveredChars.has(charKey) && char !== " ";

      return (
        <span
          className={`transition-colors duration-150 ${
            isJobTitle
              ? titleColor
              : isAnimatingChar
              ? highlightColor
              : textColor
          }`}
          onMouseEnter={() => {
            if (char !== " ") {
              // Add character to hover state and start animation
              setHoveredChars((prev) => new Set(prev).add(charKey));
              animateChar(charKey);
            }
          }}
        >
          {/* Display either the animated character or the original one */}
          {isAnimatingChar ? animatedChars.get(charKey) || char : char}
        </span>
      );
    },
  );

  return (
    <div className={`whitespace-pre font-mono ${className}`}>
      {baseAsciiArt.map((line, lineIndex) => {
        // Check if this line contains the job title
        const isJobTitle = line.includes("Systems Automation Engineer");

        return (
          <div key={lineIndex} className="leading-none">
            {Array.from(line).map((char, charIndex) => (
              <AsciiChar
                key={`${lineIndex}-${charIndex}`}
                char={char}
                charKey={`${lineIndex}-${charIndex}`}
                isJobTitle={isJobTitle}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default memo(AnimatedAsciiArt);
