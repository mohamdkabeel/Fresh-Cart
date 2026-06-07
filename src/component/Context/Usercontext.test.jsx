import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { userContetx, Usercontextprovider } from './Usercontext';

function TestConsumer() {
  const { userlogin } = useContext(userContetx);
  return <div data-testid="value">{userlogin ?? 'null'}</div>;
}

describe('Usercontextprovider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('provides null userlogin when no token in localStorage', () => {
    render(
      <Usercontextprovider>
        <TestConsumer />
      </Usercontextprovider>
    );

    expect(screen.getByTestId('value').textContent).toBe('null');
  });

  it('provides userlogin from localStorage when token exists', () => {
    localStorage.setItem('usertoken', 'my-auth-token');

    render(
      <Usercontextprovider>
        <TestConsumer />
      </Usercontextprovider>
    );

    expect(screen.getByTestId('value').textContent).toBe('my-auth-token');
  });
});
