import React from 'react';
import styled from 'styled-components';

import { colors } from '../styles';

interface Props {
  title: string;
  text: string;
}

const Title = styled.h3`
  color: ${colors.theme.text};
`;

const Text = styled.p`
  color: ${colors.theme.text};
`;

const Section = ({ title, text }: Props): JSX.Element => (
  <div>
    <Title>{title}</Title>
    <Text>{text}</Text>
  </div>
);

export default Section;
