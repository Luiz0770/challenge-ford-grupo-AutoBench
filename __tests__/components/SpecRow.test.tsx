import React from 'react';
import { render } from '@testing-library/react-native';
import { SpecRow } from '../../components/vehicle/SpecRow';

describe('SpecRow', () => {
  it('renders label and value', () => {
    const { getByText } = render(
      <SpecRow label="Motor" value="V6 3.0L Bi-Turbo" />
    );
    expect(getByText('Motor')).toBeTruthy();
    expect(getByText('V6 3.0L Bi-Turbo')).toBeTruthy();
  });

  it('renders unit when provided', () => {
    const { getByText } = render(
      <SpecRow label="Potência" value="397 cv" unit="@ 5.650 RPM" />
    );
    expect(getByText('@ 5.650 RPM')).toBeTruthy();
  });

  it('renders Não Disponível value', () => {
    const { getByText } = render(
      <SpecRow label="Velocidade Máxima" value="Não Disponível" />
    );
    expect(getByText('Não Disponível')).toBeTruthy();
  });
});
