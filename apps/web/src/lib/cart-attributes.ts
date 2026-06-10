import type { Specimen } from "@rocksa/domain";

export const cartAttributeRows = (
  specimen: Specimen,
): [label: string, value: string][] => {
  const rows: [string, string | null | undefined][] = [
    ["Carat", specimen.attributes["Carat"] ?? specimen.attributes["Weight"]],
    ["Cut", specimen.attributes["Cut"]],
    ["Clarity", specimen.attributes["Clarity"]],
    ["Origin", specimen.originCountry],
  ];
  return rows.filter((entry): entry is [string, string] => !!entry[1]);
};
