import React from 'react';
import styled from 'styled-components';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  $customStyles?: string;
}

const StyledLabel = styled.label<LabelProps>`
  display: block;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};

  ${props => props.$customStyles}
`;

export const Label: React.FC<LabelProps> = (props) => {
  return <StyledLabel {...props} />;
};
