import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #f5f5f5;
`;

const LogoText = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  margin-left: 8px;
`;

const Logo: React.FC = () => {
  return (
    <LogoWrapper>
      <Image src="https://dev.strapi.bitontree.com/uploads/Frame_427319506_66101dba25.svg?updatedAt=2025-01-16T08%3A08%3A32.926Z" alt="Project Management Logo" width={32} height={32} />
      <LogoText>PM Dashboard</LogoText>
    </LogoWrapper>
  );
};

export default Logo;

