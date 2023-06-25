import React, { useEffect, useRef, useState } from 'react'
import './Display.css';

const INITIAL_FONT_SIZE = 50;

export default function Display({value}) {
  const [displayFontSize, setDisplayFontSize] = useState(INITIAL_FONT_SIZE);
  const displayRef = useRef();
  const displayTextRef = useRef();

  useEffect(() => {
    const displayWidth = displayRef.current.offsetWidth;
    const displayTextWidth = displayTextRef.current.offsetWidth;
    const currentDisplayValueLength = String(value).length;
    const averageCharWidth = displayTextWidth / currentDisplayValueLength;
    const shouldMakeFontSmaller = (currentDisplayValueLength + 1) * averageCharWidth > (displayWidth - 20);
    if (shouldMakeFontSmaller) {
      setDisplayFontSize(displayFontSize * 0.9);
    }
  }, [value]);

  return (
    <div ref={displayRef} 
         className='display' 
         style={{fontSize: `${displayFontSize}px`}}>
          <label ref={displayTextRef}>{value}</label>
    </div>
  )
}
