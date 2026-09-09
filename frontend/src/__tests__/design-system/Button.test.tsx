import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from '../../design-system';

describe('Button', () => {
  it('renders children and handles click events', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Roll initiative</Button>);

    fireEvent.click(screen.getByRole('button', { name: /roll initiative/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
