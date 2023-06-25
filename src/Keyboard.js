import React, { useState } from 'react'
import './Keyboard.css';

const KEY_TYPES = {
  CALCULATOR_OPERATOR: "calculator-operation",
  MATH_OPERATOR: "math-operation",
  NUMBER: "number",
};

const KEY_NAMES = {
  CLEAR: "clear",
  NEGATE: "negate",
  PERCENTAGE: "percentage",
  DIVIDE: "divide",
  SEVEN: "seven",
  EIGHT: "eight",
  NINE: "nine",
  MULTIPLY: "multiply",
  FOUR: "four",
  FIVE: "five",
  SIX: "six",
  SUBTRACT: "subtract",
  ONE: "one",
  TWO: "two",
  THREE: "three",
  ADD: "add",
  ZERO: "zero",
  DOT: "dot",
  EQUALS: "equals",
};

const keys = [
  {value: "AC", name: KEY_NAMES.CLEAR, type: KEY_TYPES.CALCULATOR_OPERATOR},
  {value: "+/-", name: KEY_NAMES.NEGATE, type: KEY_TYPES.CALCULATOR_OPERATOR},
  {value: "%", name: KEY_NAMES.PERCENTAGE, type: KEY_TYPES.CALCULATOR_OPERATOR},
  {value: "÷", name: KEY_NAMES.DIVIDE, type: KEY_TYPES.MATH_OPERATOR},
  {value: 7, name: KEY_NAMES.SEVEN, type: KEY_TYPES.NUMBER},
  {value: 8, name: KEY_NAMES.EIGHT, type: KEY_TYPES.NUMBER},
  {value: 9, name: KEY_NAMES.NINE, type: KEY_TYPES.NUMBER},
  {value: "×", name: KEY_NAMES.MULTIPLY, type: KEY_TYPES.MATH_OPERATOR},
  {value: 4, name: KEY_NAMES.FOUR, type: KEY_TYPES.NUMBER},
  {value: 5, name: KEY_NAMES.FIVE, type: KEY_TYPES.NUMBER},
  {value: 6, name: KEY_NAMES.SIX, type: KEY_TYPES.NUMBER},
  {value: "–", name: KEY_NAMES.SUBTRACT, type: KEY_TYPES.MATH_OPERATOR},
  {value: 1, name: KEY_NAMES.ONE, type: KEY_TYPES.NUMBER},
  {value: 2, name: KEY_NAMES.TWO, type: KEY_TYPES.NUMBER},
  {value: 3, name: KEY_NAMES.THREE, type: KEY_TYPES.NUMBER},
  {value: "+", name: KEY_NAMES.ADD, type: KEY_TYPES.MATH_OPERATOR},
  {value: 0, name: KEY_NAMES.ZERO, type: KEY_TYPES.NUMBER},
  {value: ".", name: KEY_NAMES.DOT, type: KEY_TYPES.NUMBER},
  {value: "=", name: KEY_NAMES.EQUALS, type: KEY_TYPES.MATH_OPERATOR},
];

function calculate(num1, sign, num2) {
  if (sign === 'add') {
    return num1 + num2;
  } else if (sign === 'subtract') {
    return num1 - num2;
  } else if (sign === 'multiply') {
    return num1 * num2;
  } else if (sign === 'divide') {
    return num1 / num2;
  }
}

export default function Keyboard({updateDisplay, currentDisplayValue}) {
  const [numbers, setNumbers] = useState([0]);
  const [sign, setSign] = useState("");
  const [prevOperation, setPrevOperation] = useState([]);
  const [isAwaitingDecimalPercision, setIsAwaitingDecimalPercision] = useState(false);

  return (
    <div className='keyboard'>
      {keys.map(key => {
        let keyClass = `key key-${key.name} ${key.type}`;
        let clickHandler;

        if (key.name === KEY_NAMES.EQUALS) {
          clickHandler = () => {
            let res = 0;
            let [num1, num2] = numbers;
            if (sign === "" && prevOperation.length > 0) {
              res = calculate(num1, ...prevOperation);
            } else {
              res = calculate(num1, sign, num2);
              setPrevOperation([sign, num2]);
              setSign("");
            }
            updateDisplay(res);
            setNumbers([res]);
          };
        } else if (key.name === KEY_NAMES.DOT) {
          clickHandler = () => {
            if (currentDisplayValue % 1 === 0 && !isAwaitingDecimalPercision) {
              setIsAwaitingDecimalPercision(true);
              updateDisplay(`${currentDisplayValue}.`);
            }
          };
        } else if (key.type === KEY_TYPES.MATH_OPERATOR) {
          keyClass = sign === key.name ? `${keyClass} active-operation` : keyClass;
          clickHandler = () => {
            setSign(key.name);
          };
        } else if (key.type === KEY_TYPES.CALCULATOR_OPERATOR) {
          clickHandler = () => {
            setNumbers([...numbers, key.value]);
            updateDisplay(key.value);
          };
        } else {
          clickHandler = () => {
            if (isAwaitingDecimalPercision) {
              let concatNumberAsString;
              if (sign !== "" && numbers.length === 1) {
                concatNumberAsString = `0.${key.value}`;
              } else {
                const lastNumber = numbers[numbers.length-1];
                concatNumberAsString = `${lastNumber}.${key.value}`;
              }
              const newNumber = parseFloat(concatNumberAsString);
              setNumbers([...numbers.slice(0, numbers.length-1), newNumber]);
              updateDisplay(newNumber);
              setIsAwaitingDecimalPercision(false);
            } else if (sign !== "" && numbers.length === 1) {
              setNumbers([...numbers, key.value]);
              updateDisplay(key.value);
            } else if (numbers.length > 0) {
              const lastNumber = numbers[numbers.length-1];
              const concatNumberAsString = `${lastNumber}${key.value}`;
              const newNumber = concatNumberAsString.includes('.') ? parseFloat(concatNumberAsString) : parseInt(concatNumberAsString);
              setNumbers([...numbers.slice(0, numbers.length-1), newNumber]);
              updateDisplay(newNumber);
            } else {
              setNumbers([key.value]);
              updateDisplay(key.value);
            }
          };
        }

        return (
          <button className={keyClass} onClick={clickHandler}>{key.value}</button>
        );
      })}
    </div>
  )
}
