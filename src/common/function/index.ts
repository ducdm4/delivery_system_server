export const generatePasswordString = () => {
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz'[
    Math.floor(Math.random() * 26)
  ];
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[
    Math.floor(Math.random() * 26)
  ];
  const special = ')!@#$%^&*('[Math.floor(Math.random() * 10)];
  return `${lowerCase}${upperCase}${special}${Math.floor(
    Math.random() * 1000,
  )}`;
};
