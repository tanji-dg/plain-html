import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { colors, spacing } from '../styles';
import logo from '../public/img/dsa-ntc-logo.svg';

const Wrapper = styled.div`
  text-align: center;
  margin-bottom: ${spacing.xxlarge};

  h1 {
    margin-bottom: ${spacing.large};
  }
`;

const Links = styled.div`
  @media screen and (max-width: 800px) {
    display: grid;
  }

  @media screen and (min-width: 801px) {
    margin-bottom: 50px;
  }
`;

const Link = styled.a`
  background-color: ${colors.theme.primary};
  color: ${colors.theme.bg};
  padding: ${spacing.medium} ${spacing.large};
  margin: ${spacing.small};
  border-radius: ${spacing.small};
  text-decoration: none;
`;

interface Props {
  links: {
    text: string;
    link: string;
  }[];
}

const Navbar = ({ links }: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <img src={logo} />
      <h1>{t('DSA National Tech Committee')}</h1>
      <Links>
        {links.slice(0, 3).map((link) => (
          <Link key={link.text} href={link.link} target="_blank">
            {t(link.text)}
          </Link>
        ))}
      </Links>
      <Links>
        {links.slice(3).map((link) => (
          <Link key={link.text} href={link.link} target="_blank">
            {t(link.text)}
          </Link>
        ))}
      </Links>
    </Wrapper>
  );
};

export default Navbar;
