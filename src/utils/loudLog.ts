export const loudLog = (label: string, str: any) => {
  const styling =
    'color: #fff; background-color: #0c74b3; font-family:monospace; font-size: 14px; font-weight: semi-bold; width: 100%; text-align: center;';
  console.log('%c======== ' + label + ' ========', styling);
  console.log(str);
  console.log(
    `%c${Array.from({ length: 18 + label.length })
      .fill('=')
      .join('')}`,
    styling
  );
};
