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
    This is a {color} component with a hotpink background.
  </div>
);

export default TestComponent;
