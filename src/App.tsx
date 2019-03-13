import React, { Fragment } from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

import { GlobalStyles, Navbar, Page, Section } from './components';
import paths from './paths';

interface Props {
  i18n: i18next.i18n;
}

const App = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Page>
        <Navbar links={paths.navbarLinks} />
        <Section title={t('What is the NTC')} text={t('Good question')} />
        <Section title={t('Can the NTC help my chapter')} text={t('Sure can')} />
        <Section title={t('My email is broken')} text={t('Nope')} />
        <Section title={t('Interested in tech')} text={t('Welcome aboard')} />
      </Page>
      <GlobalStyles />
    </Fragment>
  );
};

export default App;
