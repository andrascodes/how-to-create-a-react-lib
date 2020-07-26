/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export interface TestComponentProps {
  color: 'darkgreen' | 'lightgreen';
}

const TestComponent: React.FC<TestComponentProps> = ({ color }) => (
  <div
    css={css`
      background-color: hotpink;
      &:hover {
        color: ${color};
      }
    `}
  >
    This is a component with a hotpink background and {color} text.
  </div>
);

export default TestComponent;
