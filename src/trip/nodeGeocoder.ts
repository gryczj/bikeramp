import * as NodeGeocoder from 'node-geocoder';

const options: NodeGeocoder.Options = {
  provider: 'openstreetmap',
  language: 'polish',
};

export const geoCoder = NodeGeocoder(options);
