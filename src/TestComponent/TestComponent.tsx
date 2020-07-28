/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export interface TestComponentProps {
  color: 'darkgreen' | 'lightgreen';
  background: string;
}

const TestComponent: React.FC<TestComponentProps> = ({
  color,
  background = 'hotpink'
}) => (
  <div
    css={css`
      background-color: ${background};
      &:hover {
        color: ${color};
      }
    `}
  >
    This is a component with a {background} background and {color} text.
  </div>
);

export default TestComponent;
