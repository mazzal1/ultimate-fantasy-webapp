import { fireEvent, render, screen } from '@testing-library/react';
import { GdprBanner } from '../../components/gdpr/GdprBanner';
import { I18nProvider } from '../../contexts/I18nContext';

describe('GdprBanner', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows on first visit and stores consent when accepted', async () => {
    render(
      <I18nProvider>
        <GdprBanner />
      </I18nProvider>,
    );

    const button = await screen.findByRole('button', { name: /accept/i });
    fireEvent.click(button);

    expect(window.localStorage.getItem('uf-gdpr-consent')).toBe('accepted');
    expect(screen.queryByText(/privacy and data use/i)).not.toBeInTheDocument();
  });
});
